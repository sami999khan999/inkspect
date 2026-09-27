// Page scripts for the element picker. They run with `this` bound to the element
// (`Runtime.callFunctionOn`), so they must be self-contained.
import { buildSelector, buildXPath } from '../shared/elementInfo';

/** Computed styles worth showing; values that are defaults are dropped. */
const STYLE_PROPERTIES = [
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

/**
 * Collects `ElementDetails` (except role and name, which come from the accessibility tree).
 * Argument: the maximum length of the HTML snippet.
 */
export const COLLECT_DETAILS_FUNCTION = `function (maxHtml) {
  const el = this;
  const doc = el.ownerDocument;
  const win = doc.defaultView || window;
  const buildSelector = ${buildSelector.toString()};
  const buildXPath = ${buildXPath.toString()};
  const root = el.getRootNode && el.getRootNode().querySelectorAll ? el.getRootNode() : doc;
  const escape = (value) => (win.CSS && win.CSS.escape ? win.CSS.escape(value) : value);
  let selector = buildSelector(el, (s) => root.querySelectorAll(s).length, escape);
  if (root !== doc && root.host) {
    const host = buildSelector(root.host, (s) => (root.host.getRootNode().querySelectorAll || doc.querySelectorAll.bind(doc))(s).length, escape);
    selector = host + ' >>> ' + selector;
  }
  const rect = el.getBoundingClientRect();
  const attributes = {};
  for (const attribute of Array.from(el.attributes || [])) attributes[attribute.name] = attribute.value.slice(0, 300);
  const text = (el.innerText || el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 200) || undefined;
  let html = el.outerHTML || '';
  if (html.length > maxHtml) {
    // Keep the element's own tag with its children collapsed.
    const shallow = el.cloneNode(false);
    if (el.children.length) shallow.innerHTML = '\\u2026';
    else shallow.textContent = (el.textContent || '').slice(0, 80) + '\\u2026';
    html = shallow.outerHTML.slice(0, maxHtml);
  }
  const computed = win.getComputedStyle(el);
  const styles = {};
  for (const name of ${JSON.stringify(STYLE_PROPERTIES)}) {
    const value = computed.getPropertyValue(name);
    if (!value || /^(none|normal|auto|0px|static|visible|1|rgba\\(0, 0, 0, 0\\)|0px none .*)$/.test(value)) continue;
    styles[name] = value.length > 80 ? value.slice(0, 80) + '\\u2026' : value;
  }
  const component = (() => {
    try {
      const fiberKey = Object.keys(el).find((k) => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
      if (fiberKey) {
        for (let fiber = el[fiberKey]; fiber; fiber = fiber.return) {
          const type = fiber.type;
          if (!type || typeof type === 'string') continue;
          const name = type.displayName || type.name || (type.render && (type.render.displayName || type.render.name));
          if (!name) continue;
          let file = fiber._debugSource && fiber._debugSource.fileName;
          let line = fiber._debugSource && fiber._debugSource.lineNumber;
          const stack = fiber._debugStack && fiber._debugStack.stack;
          if (!file && typeof stack === 'string') {
            const frame = stack.split('\\n').slice(1).find((l) => !/node_modules|react-dom|react-stack|jsx-dev-runtime|chunk-/.test(l)) || '';
            const match = /\\(?((?:https?|file|webpack[\\w-]*):\\/\\/[^\\s)]+?):(\\d+):\\d+\\)?\\s*$/.exec(frame);
            if (match) { file = match[1]; line = Number(match[2]); }
          }
          return { framework: 'react', name, file, line };
        }
      }
      const vue = el.__vueParentComponent;
      if (vue) {
        const type = vue.type || {};
        const file = type.__file;
        const name = type.name || type.__name || (file ? file.split('/').pop().replace(/\\.vue$/, '') : 'Anonymous');
        return { framework: 'vue', name, file };
      }
      if (el.__vue__) {
        const options = el.__vue__.$options || {};
        return { framework: 'vue', name: options.name || options._componentTag || 'Anonymous', file: options.__file };
      }
      for (let node = el; node; node = node.parentElement) {
        if (node.__svelte_meta) {
          const loc = node.__svelte_meta.loc || {};
          const name = loc.file ? loc.file.split('/').pop().replace(/\\.svelte$/, '') : 'Component';
          return { framework: 'svelte', name, file: loc.file, line: typeof loc.line === 'number' ? loc.line + 1 : undefined };
        }
      }
      const ng = win.ng;
      if (ng && ng.getOwningComponent) {
        const instance = ng.getComponent(el) || ng.getOwningComponent(el);
        if (instance) return { framework: 'angular', name: instance.constructor.name };
      }
    } catch {}
    return undefined;
  })();
  let pageUrl = win.location.href;
  let pageTitle = doc.title;
  try {
    pageUrl = win.top.location.href;
    pageTitle = win.top.document.title;
  } catch {}
  return {
    tag: el.tagName.toLowerCase(),
    id: el.id || undefined,
    classes: Array.from(el.classList || []),
    selector,
    xpath: buildXPath(el),
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
}`;

/** Labels of the element and its ancestors, outermost first, for the breadcrumb. */
export const ANCESTRY_FUNCTION = `function () {
  const labels = [];
  for (let el = this; el && el.nodeType === 1 && labels.length < 8; el = el.parentElement) {
    const classes = Array.from(el.classList || []).slice(0, 2).map((c) => '.' + c).join('');
    labels.unshift(el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + classes);
  }
  return labels;
}`;

export const PARENT_FUNCTION = `function () {
  const parent = this.parentElement || (this.getRootNode && this.getRootNode().host) || null;
  return parent && parent.tagName !== 'HTML' ? parent : null;
}`;

export const FIRST_CHILD_FUNCTION = `function () {
  return this.firstElementChild || (this.shadowRoot && this.shadowRoot.firstElementChild) || null;
}`;
