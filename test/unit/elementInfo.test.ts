import { describe, expect, it } from 'vitest';
import {
  buildSelector,
  buildXPath,
  formatDetails,
  type ElementDetails,
  type SelectorElement,
} from '../../src/shared/elementInfo';

/** A tiny DOM stand-in with a selector engine good enough for the selectors we generate. */
class FakeElement implements SelectorElement {
  parentElement: FakeElement | null = null;
  children: FakeElement[] = [];
  classList: string[];
  constructor(
    public tagName: string,
    public id = '',
    classes: string[] = [],
    private attributes: Record<string, string> = {},
  ) {
    this.classList = classes;
  }
  getAttribute(name: string) {
    return this.attributes[name] ?? null;
  }
  append(...children: FakeElement[]) {
    for (const child of children) {
      child.parentElement = this;
      this.children.push(child);
    }
    return this;
  }
  *all(): Generator<FakeElement> {
    yield this;
    for (const child of this.children) yield* child.all();
  }
}

function matchesStep(el: FakeElement, step: string): boolean {
  const nth = /:nth-of-type\((\d+)\)$/.exec(step);
  let rest = nth ? step.slice(0, nth.index) : step;
  if (nth) {
    const siblings = el.parentElement?.children.filter((c) => c.tagName === el.tagName) ?? [el];
    if (siblings.indexOf(el) + 1 !== Number(nth[1])) return false;
  }
  const attribute = /\[([\w-]+)="([^"]*)"\]$/.exec(rest);
  if (attribute) {
    if (el.getAttribute(attribute[1]!) !== attribute[2]) return false;
    rest = rest.slice(0, attribute.index);
  }
  const [head, ...classes] = rest.split('.');
  const [tag, id] = head!.split('#');
  if (tag && tag.toUpperCase() !== el.tagName) return false;
  if (id !== undefined && el.id !== id) return false;
  return classes.every((cls) => el.classList.includes(cls));
}

function matches(el: FakeElement, selector: string): boolean {
  // Only the ' > ' (child) and ' ' (descendant) combinators are needed.
  const tokens = selector.replace(/\s*>\s*/g, ' > ').split(' ');
  let node: FakeElement | null = el;
  let index = tokens.length - 1;
  if (!matchesStep(el, tokens[index]!)) return false;
  index--;
  while (index >= 0) {
    const combinator = tokens[index] === '>' ? '>' : ' ';
    if (combinator === '>') index--;
    const step = tokens[index]!;
    if (combinator === '>') {
      node = node!.parentElement;
      if (!node || !matchesStep(node, step)) return false;
    } else {
      node = node!.parentElement;
      while (node && !matchesStep(node, step)) node = node.parentElement;
      if (!node) return false;
    }
    index--;
  }
  return true;
}

function page() {
  const html = new FakeElement('HTML');
  const body = new FakeElement('BODY');
  const form = new FakeElement('FORM', 'login');
  const save = new FakeElement('BUTTON', '', ['btn', 'primary']);
  const cancel = new FakeElement('BUTTON', '', ['btn']);
  const list = new FakeElement('UL', '', ['items']);
  const items = [1, 2, 3].map(() => new FakeElement('LI', '', ['item', 'css-1x2y3z']));
  const tested = new FakeElement('INPUT', '', [], { 'data-testid': 'email' });
  form.append(save, cancel, tested);
  list.append(...items);
  body.append(form, list);
  html.append(body);
  const count = (selector: string) => [...html.all()].filter((el) => matches(el, selector)).length;
  return { html, form, save, cancel, items, tested, count };
}

const escape = (value: string) => value;

describe('buildSelector', () => {
  it('uses unique ids, test ids and classes', () => {
    const { form, tested, save, count } = page();
    expect(buildSelector(form, count, escape)).toBe('#login');
    expect(buildSelector(tested, count, escape)).toBe('input[data-testid="email"]');
    expect(buildSelector(save, count, escape)).toBe('button.btn.primary');
  });

  it('falls back to a path with nth-of-type', () => {
    const { cancel, items, count } = page();
    const selector = buildSelector(cancel, count, escape);
    expect(count(selector)).toBe(1);
    expect(matches(cancel, selector)).toBe(true);
    const second = buildSelector(items[1]!, count, escape);
    expect(second).toContain('nth-of-type(2)');
    expect(count(second)).toBe(1);
  });

  it('ignores generated class names', () => {
    const { items, count } = page();
    expect(buildSelector(items[0]!, count, escape)).not.toContain('css-');
  });
});

describe('buildXPath', () => {
  it('indexes repeated siblings', () => {
    const { items, form } = page();
    expect(buildXPath(items[2]!)).toBe('/html/body/ul/li[3]');
    expect(buildXPath(form)).toBe('/html/body/form');
  });
});

describe('formatDetails', () => {
  const details: ElementDetails = {
    tag: 'button',
    classes: ['btn-primary'],
    selector: 'form#login > button.btn-primary',
    xpath: '/html/body/main/form/button',
    text: 'Sign in',
    html: '<button class="btn-primary" type="submit">Sign in</button>',
    attributes: { class: 'btn-primary', type: 'submit' },
    rect: { x: 320, y: 480, width: 120, height: 40 },
    styles: { display: 'flex', color: '#fff' },
    role: 'button',
    name: 'Sign in',
    component: {
      framework: 'react',
      name: 'LoginButton',
      file: 'src/components/LoginButton.tsx',
      line: 12,
    },
    pageUrl: 'http://localhost:3000/login',
    pageTitle: 'Login',
    viewport: { width: 1440, height: 900 },
  };

  it('formats Markdown for AI chats', () => {
    expect(formatDetails([details], 'markdown')).toBe(
      [
        '### Element: `button.btn-primary`',
        '- Page: http://localhost:3000/login (1440×900)',
        '- Selector: `form#login > button.btn-primary`',
        '- XPath: `/html/body/main/form/button`',
        '- Role/name: button "Sign in"',
        '- Component: `<LoginButton>` (src/components/LoginButton.tsx:12) [react]',
        '- Box: 120×40 at (320, 480)',
        '- Text: "Sign in"',
        '- Styles: display:flex; color:#fff',
        '- Attributes: type="submit"',
        '```html',
        '<button class="btn-primary" type="submit">Sign in</button>',
        '```',
      ].join('\n'),
    );
  });

  it('numbers several elements and honours the field list', () => {
    const text = formatDetails([details, { ...details, tag: 'a', classes: [] }], 'markdown', [
      'selector',
    ]);
    expect(text).toContain('### 1. Element: `button.btn-primary`');
    expect(text).toContain('### 2. Element: `a`');
    expect(text).not.toContain('XPath');
  });

  it('formats JSON, selectors and HTML', () => {
    expect(JSON.parse(formatDetails([details], 'json')).component.name).toBe('LoginButton');
    expect(formatDetails([details, details], 'selector')).toBe(
      'form#login > button.btn-primary\nform#login > button.btn-primary',
    );
    expect(formatDetails([details], 'html')).toBe(details.html);
  });
});
