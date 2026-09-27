// Element details for the element picker: selector generation (runs inside the page) and
// formatting for AI agents (runs in the host). Selector functions must stay self-contained:
// they are converted to strings with `toString()` and evaluated in the page.

/** The parts of a DOM element the selector functions use (so they can be unit tested). */
export interface SelectorElement {
  tagName: string;
  id: string;
  classList: ArrayLike<string>;
  parentElement: SelectorElement | null;
  children: ArrayLike<SelectorElement>;
  getAttribute(name: string): string | null;
}

/**
 * A short CSS selector that matches only `element`. Prefers ids, test ids, ARIA labels and names,
 * then tag plus stable class names, then `:nth-of-type` steps up to a unique ancestor.
 * `count` returns how many elements a selector matches in the document; `escape` is `CSS.escape`.
 */
export function buildSelector(
  element: SelectorElement,
  count: (selector: string) => number,
  escape: (value: string) => string,
): string {
  const ATTRIBUTES = ['data-testid', 'data-test', 'data-cy', 'data-qa', 'aria-label', 'name'];
  // Generated class names (CSS modules, styled-components, Tailwind arbitrary values, hashes).
  const unstable = (cls: string) =>
    /^(css|sc|jsx|emotion|svelte)-|__[a-z0-9]{5,}$|[_-][a-f0-9]{6,}$|\d{3,}|[:[\]/()]/i.test(cls);
  const unique = (selector: string) => {
    try {
      return count(selector) === 1;
    } catch {
      return false;
    }
  };
  const describe = (el: SelectorElement): string[] => {
    const tag = el.tagName.toLowerCase();
    const candidates: string[] = [];
    if (el.id && !unstable(el.id)) candidates.push(`#${escape(el.id)}`);
    for (const name of ATTRIBUTES) {
      const value = el.getAttribute(name);
      if (value && value.length < 80)
        candidates.push(`${tag}[${name}="${value.replace(/"/g, '\\"')}"]`);
    }
    const classes = Array.from(el.classList)
      .filter((cls) => !unstable(cls))
      .slice(0, 3)
      .map((cls) => `.${escape(cls)}`);
    if (classes.length) candidates.push(tag + classes.join(''));
    candidates.push(tag);
    return candidates;
  };
  const nthOfType = (el: SelectorElement): string => {
    const tag = el.tagName.toLowerCase();
    const parent = el.parentElement;
    if (!parent) return tag;
    const siblings = Array.from(parent.children).filter((child) => child.tagName === el.tagName);
    return siblings.length > 1 ? `${tag}:nth-of-type(${siblings.indexOf(el) + 1})` : tag;
  };

  // 1. Something on the element itself is unique.
  for (const candidate of describe(element)) {
    if (unique(candidate)) return candidate;
  }
  // 2. Walk up, prefixing with ancestors, until the path is unique.
  let path =
    describe(element).find((c) => c !== element.tagName.toLowerCase()) ?? nthOfType(element);
  if (!unique(path)) path = nthOfType(element);
  let current = element.parentElement;
  while (current && !unique(path)) {
    const ancestor = describe(current).find((candidate) => unique(candidate));
    if (ancestor) {
      path = `${ancestor} > ${path}`;
      if (unique(path)) return path;
      // The ancestor is unique but the child step is not: make the child step exact.
      return `${ancestor} > ${pathFromTo(element, current, nthOfType)}`;
    }
    path = `${nthOfType(current)} > ${path}`;
    current = current.parentElement;
  }
  return path;

  function pathFromTo(
    el: SelectorElement,
    ancestor: SelectorElement,
    step: (e: SelectorElement) => string,
  ): string {
    const steps: string[] = [];
    for (
      let node: SelectorElement | null = el;
      node && node !== ancestor;
      node = node.parentElement
    ) {
      steps.unshift(step(node));
    }
    return steps.join(' > ');
  }
}

/** An XPath from the document root, e.g. `/html/body/main/form/button[2]`. */
export function buildXPath(element: SelectorElement): string {
  const steps: string[] = [];
  for (let el: SelectorElement | null = element; el; el = el.parentElement) {
    const tag = el.tagName.toLowerCase();
    const parent = el.parentElement;
    const same = parent ? Array.from(parent.children).filter((c) => c.tagName === el!.tagName) : [];
    steps.unshift(same.length > 1 ? `${tag}[${same.indexOf(el) + 1}]` : tag);
  }
  return `/${steps.join('/')}`;
}

export interface ElementComponent {
  framework: 'react' | 'vue' | 'svelte' | 'angular';
  name: string;
  /** Source file, when the framework's dev build exposes it. */
  file?: string;
  line?: number;
}

export interface ElementDetails {
  tag: string;
  id?: string;
  classes: string[];
  selector: string;
  xpath: string;
  text?: string;
  html: string;
  attributes: Record<string, string>;
  /** Position in the viewport, CSS pixels. */
  rect: { x: number; y: number; width: number; height: number };
  styles: Record<string, string>;
  role?: string;
  name?: string;
  component?: ElementComponent;
  pageUrl: string;
  pageTitle: string;
  viewport: { width: number; height: number };
  /** URL of the iframe the element is in, when it is not the top document. */
  frameUrl?: string;
  /** Path of a screenshot of the element (Alt+click). */
  screenshot?: string;
}

export type CopyFormat = 'markdown' | 'json' | 'selector' | 'html';

export type DetailField =
  | 'page'
  | 'selector'
  | 'xpath'
  | 'role'
  | 'component'
  | 'box'
  | 'text'
  | 'styles'
  | 'attributes'
  | 'html';

export const ALL_FIELDS: readonly DetailField[] = [
  'page',
  'selector',
  'xpath',
  'role',
  'component',
  'box',
  'text',
  'styles',
  'attributes',
  'html',
];

/** The label for an element in headings: `button#save.primary`. */
export function elementLabel(details: Pick<ElementDetails, 'tag' | 'id' | 'classes'>): string {
  return `${details.tag}${details.id ? `#${details.id}` : ''}${details.classes
    .slice(0, 3)
    .map((cls) => `.${cls}`)
    .join('')}`;
}

function componentLabel(component: ElementComponent): string {
  const location = component.file
    ? ` (${component.file}${component.line ? `:${component.line}` : ''})`
    : '';
  return `\`<${component.name}>\`${location} [${component.framework}]`;
}

/** Formats one or more picked elements for pasting into an AI chat. */
export function formatDetails(
  elements: ElementDetails[],
  format: CopyFormat,
  fields: readonly DetailField[] = ALL_FIELDS,
): string {
  switch (format) {
    case 'selector':
      return elements.map((e) => e.selector).join('\n');
    case 'html':
      return elements.map((e) => e.html).join('\n\n');
    case 'json': {
      const pick = (e: ElementDetails) => {
        const out: Record<string, unknown> = { element: elementLabel(e) };
        if (fields.includes('page'))
          out.page = {
            url: e.pageUrl,
            title: e.pageTitle,
            viewport: e.viewport,
            frameUrl: e.frameUrl,
          };
        if (fields.includes('selector')) out.selector = e.selector;
        if (fields.includes('xpath')) out.xpath = e.xpath;
        if (fields.includes('role')) out.role = e.role ? { role: e.role, name: e.name } : undefined;
        if (fields.includes('component')) out.component = e.component;
        if (fields.includes('box')) out.box = e.rect;
        if (fields.includes('text')) out.text = e.text;
        if (fields.includes('styles')) out.styles = e.styles;
        if (fields.includes('attributes')) out.attributes = e.attributes;
        if (fields.includes('html')) out.html = e.html;
        if (e.screenshot) out.screenshot = e.screenshot;
        return out;
      };
      return JSON.stringify(
        elements.length === 1 ? pick(elements[0]!) : elements.map(pick),
        null,
        2,
      );
    }
    case 'markdown':
      return elements
        .map((e, index) => {
          const lines = [
            `### ${elements.length > 1 ? `${index + 1}. ` : ''}Element: \`${elementLabel(e)}\``,
          ];
          if (fields.includes('page')) {
            lines.push(`- Page: ${e.pageUrl} (${e.viewport.width}×${e.viewport.height})`);
            if (e.frameUrl) lines.push(`- Frame: ${e.frameUrl}`);
          }
          if (fields.includes('selector')) lines.push(`- Selector: \`${e.selector}\``);
          if (fields.includes('xpath')) lines.push(`- XPath: \`${e.xpath}\``);
          if (fields.includes('role') && e.role) {
            lines.push(`- Role/name: ${e.role}${e.name ? ` "${e.name}"` : ''}`);
          }
          if (fields.includes('component') && e.component) {
            lines.push(`- Component: ${componentLabel(e.component)}`);
          }
          if (fields.includes('box')) {
            const r = e.rect;
            lines.push(
              `- Box: ${Math.round(r.width)}×${Math.round(r.height)} at (${Math.round(r.x)}, ${Math.round(r.y)})`,
            );
          }
          if (fields.includes('text') && e.text) lines.push(`- Text: "${e.text}"`);
          if (fields.includes('styles')) {
            const styles = Object.entries(e.styles)
              .map(([k, v]) => `${k}:${v}`)
              .join('; ');
            if (styles) lines.push(`- Styles: ${styles}`);
          }
          if (fields.includes('attributes')) {
            const attributes = Object.entries(e.attributes)
              .filter(([name]) => name !== 'class' && name !== 'id' && name !== 'style')
              .map(([k, v]) => `${k}="${v}"`)
              .join(' ');
            if (attributes) lines.push(`- Attributes: ${attributes}`);
          }
          if (e.screenshot) lines.push(`- Screenshot: ${e.screenshot}`);
          if (fields.includes('html')) lines.push('```html', e.html, '```');
          return lines.join('\n');
        })
        .join('\n\n');
  }
}
