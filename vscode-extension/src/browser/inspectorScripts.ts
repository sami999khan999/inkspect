// Page scripts for the element picker. They run with `this` bound to the element
// (`Runtime.callFunctionOn`), so they must be self-contained.
import { collectElementDetails, STYLE_PROPERTIES } from '@inkspect/shared/collect';
import { buildSelector, buildXPath } from '@inkspect/shared/elementInfo';

/**
 * Collects `ElementDetails` (except role and name, which come from the accessibility tree).
 * Argument: the maximum length of the HTML snippet. The collector itself is shared with the
 * browser extension; here it is sent as source text, so its helpers are inlined too.
 */
export const COLLECT_DETAILS_FUNCTION = `function (maxHtml) {
  const helpers = {
    buildSelector: ${buildSelector.toString()},
    buildXPath: ${buildXPath.toString()},
    styleProperties: ${JSON.stringify(STYLE_PROPERTIES)},
  };
  return (${collectElementDetails.toString()})(this, maxHtml, helpers);
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
