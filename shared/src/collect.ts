// Collects element details inside a page. Used by the VS Code extension (as source text sent
// over CDP, via `toString()`) and by the browser extension (called directly), so the function
// must stay self-contained: everything it needs comes in through its parameters.
import { buildSelector, buildXPath, type ElementDetails } from './elementInfo';

/** Computed styles worth showing; values that are defaults are dropped. */
export const STYLE_PROPERTIES = [
  'display',
  'position',
  'width',
  'height',
  'margin',
  'padding',
  'color',
  'background-color',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'border',
  'border-radius',
  'z-index',
  'flex-direction',
  'justify-content',
  'align-items',
  'gap',
  'grid-template-columns',
  'opacity',
  'overflow',
];

export interface CollectHelpers {
  buildSelector: typeof buildSelector;
  buildXPath: typeof buildXPath;
  styleProperties: readonly string[];
}

export type CollectedDetails = Omit<ElementDetails, 'role' | 'name'> & {
  scroll: { x: number; y: number };
};

/**
 * Everything the element picker copies about an element, except role and accessible name
 * (the VS Code extension reads those from Chrome's accessibility tree; see `accessibleInfo`).
 */
export function collectElementDetails(
  el: Element,
  maxHtml: number,
  helpers: CollectHelpers,
): CollectedDetails {
  const doc = el.ownerDocument;
  const win = (doc.defaultView || window) as Window & typeof globalThis;
  const rootNode = el.getRootNode() as Document | ShadowRoot;
  const root: Document | ShadowRoot = 'querySelectorAll' in rootNode ? rootNode : doc;
  const escape = (value: string) => (win.CSS && win.CSS.escape ? win.CSS.escape(value) : value);
  let selector = helpers.buildSelector(el, (s) => root.querySelectorAll(s).length, escape);
  if (root !== doc && 'host' in root && root.host) {
    const hostRoot = root.host.getRootNode() as Document | ShadowRoot;
    const host = helpers.buildSelector(
      root.host,
      (s) => ('querySelectorAll' in hostRoot ? hostRoot : doc).querySelectorAll(s).length,
      escape,
    );
    selector = host + ' >>> ' + selector;
  }
  const rect = el.getBoundingClientRect();
  const attributes: Record<string, string> = {};
  for (const attribute of Array.from(el.attributes || [])) {
    attributes[attribute.name] = attribute.value.slice(0, 300);
  }
  const html5 = el as HTMLElement;
  const text =
    (html5.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 200) ||
    undefined;
  let html = el.outerHTML || '';
  if (html.length > maxHtml) {
    // Keep the element's own tag with its children collapsed.
    const shallow = el.cloneNode(false) as Element;
    if (el.children.length) shallow.innerHTML = '…';
    else shallow.textContent = (el.textContent || '').slice(0, 80) + '…';
    html = shallow.outerHTML.slice(0, maxHtml);
  }
  const computed = win.getComputedStyle(el);
  const styles: Record<string, string> = {};
  for (const name of helpers.styleProperties) {
    const value = computed.getPropertyValue(name);
    if (
      !value ||
      /^(none|normal|auto|0px|static|visible|1|rgba\(0, 0, 0, 0\)|0px none .*)$/.test(value)
    ) {
      continue;
    }
    styles[name] = value.length > 80 ? value.slice(0, 80) + '…' : value;
  }
  const component = ((): ElementDetails['component'] => {
    // Framework internals are plain JS properties, only visible from the page's own JS world.
    type Loose = Record<string, unknown> & { [key: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
      const node = el as unknown as Loose;
      const fiberKey = Object.keys(node).find(
        (k) => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'),
      );
      if (fiberKey) {
        for (let fiber = node[fiberKey]; fiber; fiber = fiber.return) {
          const type = fiber.type;
          if (!type || typeof type === 'string') continue;
          const name =
            type.displayName ||
            type.name ||
            (type.render && (type.render.displayName || type.render.name));
          if (!name) continue;
          let file: string | undefined = fiber._debugSource && fiber._debugSource.fileName;
          let line: number | undefined = fiber._debugSource && fiber._debugSource.lineNumber;
          const stack = fiber._debugStack && fiber._debugStack.stack;
          if (!file && typeof stack === 'string') {
            const frame =
              stack
                .split('\n')
                .slice(1)
                .find(
                  (l: string) =>
                    !/node_modules|react-dom|react-stack|jsx-dev-runtime|chunk-/.test(l),
                ) || '';
            const match = /\(?((?:https?|file|webpack[\w-]*):\/\/[^\s)]+?):(\d+):\d+\)?\s*$/.exec(
              frame,
            );
            if (match) {
              file = match[1];
              line = Number(match[2]);
            }
          }
          return { framework: 'react', name, file, line };
        }
      }
      const vue = node.__vueParentComponent;
      if (vue) {
        const type = vue.type || {};
        const file = type.__file;
        const name =
          type.name ||
          type.__name ||
          (file
            ? String(file)
                .split('/')
                .pop()!
                .replace(/\.vue$/, '')
            : 'Anonymous');
        return { framework: 'vue', name, file };
      }
      if (node.__vue__) {
        const options = node.__vue__.$options || {};
        return {
          framework: 'vue',
          name: options.name || options._componentTag || 'Anonymous',
          file: options.__file,
        };
      }
      for (let current: Loose | null = node; current; current = current.parentElement) {
        if (current.__svelte_meta) {
          const loc = current.__svelte_meta.loc || {};
          const name = loc.file
            ? String(loc.file)
                .split('/')
                .pop()!
                .replace(/\.svelte$/, '')
            : 'Component';
          return {
            framework: 'svelte',
            name,
            file: loc.file,
            line: typeof loc.line === 'number' ? loc.line + 1 : undefined,
          };
        }
      }
      const ng = (win as unknown as Loose).ng;
      if (ng && ng.getOwningComponent) {
        const instance = ng.getComponent(el) || ng.getOwningComponent(el);
        if (instance) return { framework: 'angular', name: instance.constructor.name };
      }
    } catch {
      // Framework internals vary between versions; details work without them.
    }
    return undefined;
  })();
  let pageUrl = win.location.href;
  let pageTitle = doc.title;
  try {
    pageUrl = win.top!.location.href;
    pageTitle = win.top!.document.title;
  } catch {
    // Cross-origin frame: keep the frame's own URL and title.
  }
  return {
    tag: el.tagName.toLowerCase(),
    id: el.id || undefined,
    classes: Array.from(el.classList || []),
    selector,
    xpath: helpers.buildXPath(el),
    text,
    html,
    attributes,
    rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    styles,
    component,
    pageUrl,
    pageTitle,
    viewport: { width: win.innerWidth, height: win.innerHeight },
    frameUrl: win !== win.top ? win.location.href : undefined,
    scroll: { x: win.scrollX, y: win.scrollY },
  };
}

/** The helpers `collectElementDetails` needs, for calling it directly. */
export const COLLECT_HELPERS: CollectHelpers = {
  buildSelector,
  buildXPath,
  styleProperties: STYLE_PROPERTIES,
};

/** Labels of the element and its ancestors, outermost first (the breadcrumb). */
export function elementAncestry(el: Element): string[] {
  const labels: string[] = [];
  for (let node: Element | null = el; node && labels.length < 8; node = node.parentElement) {
    const classes = Array.from(node.classList || [])
      .slice(0, 2)
      .map((c) => '.' + c)
      .join('');
    labels.unshift(node.tagName.toLowerCase() + (node.id ? '#' + node.id : '') + classes);
  }
  return labels;
}

const IMPLICIT_ROLES: Record<string, string> = {
  a: 'link',
  article: 'article',
  aside: 'complementary',
  button: 'button',
  dialog: 'dialog',
  footer: 'contentinfo',
  form: 'form',
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  h5: 'heading',
  h6: 'heading',
  header: 'banner',
  hr: 'separator',
  img: 'img',
  li: 'listitem',
  main: 'main',
  nav: 'navigation',
  ol: 'list',
  option: 'option',
  progress: 'progressbar',
  section: 'region',
  select: 'combobox',
  table: 'table',
  textarea: 'textbox',
  ul: 'list',
};

const INPUT_ROLES: Record<string, string> = {
  button: 'button',
  checkbox: 'checkbox',
  email: 'textbox',
  image: 'button',
  number: 'spinbutton',
  radio: 'radio',
  range: 'slider',
  reset: 'button',
  search: 'searchbox',
  submit: 'button',
  tel: 'textbox',
  text: 'textbox',
  url: 'textbox',
};

/** Roles whose accessible name comes from their text content. */
const NAME_FROM_CONTENT = new Set([
  'button',
  'link',
  'heading',
  'listitem',
  'option',
  'tab',
  'menuitem',
  'cell',
]);

/**
 * Role and accessible name, approximating the accessibility tree without DevTools access:
 * explicit ARIA first, then the usual implicit roles and naming rules.
 */
export function accessibleInfo(el: Element): { role?: string; name?: string } {
  const tag = el.tagName.toLowerCase();
  let role = el.getAttribute('role')?.split(/\s+/)[0] || undefined;
  if (!role) {
    if (tag === 'input') role = INPUT_ROLES[(el.getAttribute('type') || 'text').toLowerCase()];
    else if (tag === 'a') role = el.hasAttribute('href') ? 'link' : undefined;
    else if (tag === 'section') role = el.hasAttribute('aria-label') ? 'region' : undefined;
    else role = IMPLICIT_ROLES[tag];
  }
  const clean = (text: string | null | undefined) =>
    (text || '').replace(/\s+/g, ' ').trim().slice(0, 200) || undefined;
  const labelledBy = el.getAttribute('aria-labelledby');
  let name: string | undefined;
  if (labelledBy) {
    name = clean(
      labelledBy
        .split(/\s+/)
        .map((id) => el.ownerDocument.getElementById(id)?.textContent || '')
        .join(' '),
    );
  }
  name ??= clean(el.getAttribute('aria-label'));
  if (!name && (tag === 'img' || tag === 'area')) name = clean(el.getAttribute('alt'));
  if (!name && 'labels' in el) {
    const labels = (el as HTMLInputElement).labels;
    if (labels?.length) name = clean(Array.from(labels, (l) => l.textContent).join(' '));
  }
  if (!name && tag === 'input') {
    const input = el as HTMLInputElement;
    if (['button', 'submit', 'reset'].includes(input.type)) name = clean(input.value);
    name ??= clean(input.placeholder);
  }
  if (!name && role && NAME_FROM_CONTENT.has(role)) {
    name = clean((el as HTMLElement).innerText || el.textContent);
  }
  name ??= clean(el.getAttribute('title'));
  return { role: role || 'generic', name };
}

/** Parent element (stepping out of shadow roots), or null at the top. */
export function parentElementOf(el: Element): Element | null {
  const parent = el.parentElement || ((el.getRootNode() as ShadowRoot).host ?? null);
  return parent && parent.tagName !== 'HTML' ? parent : null;
}

/** First child element (stepping into an open shadow root), or null. */
export function firstChildElementOf(el: Element): Element | null {
  return el.firstElementChild || el.shadowRoot?.firstElementChild || null;
}
