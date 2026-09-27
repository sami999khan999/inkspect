import type { DrawTool } from '../annotations';

/** 16×16 stroke icons for the drawing tools (codicons has no pen, brush or eraser shapes). */
const PATHS: Record<DrawTool, string> = {
  select: 'M3 2l9 5-4 1-2 4z',
  pen: 'M11 2l3 3-8 8H3v-3zM9.5 3.5l3 3',
  pencil: 'M11.5 2.5l2 2L6 12l-3 1 1-3zM10 4l2 2',
  marker: 'M10 2l4 4-6 6H4v-4zM4 12l-2 2h4',
  brush:
    'M13.5 2.5c-2 1-5 4-6.5 6l1 1c2-1.5 5-4.5 6-6.5zM6.5 9.5c-2 0-3 1.5-3 3 0 .8-.5 1.2-1.5 1.5 3 .5 5.5-1 5.5-3.5',
  highlighter: 'M9 2l5 5-5 5-5-5zM4 7l-2 5 3-1M2 14h12',
  neon: 'M2 12c2-6 4 2 6-4s4 2 6-4M8 1v2M3 3l1.5 1.5M13 3l-1.5 1.5',
  line: 'M3 13L13 3',
  arrow: 'M3 13L13 3M7 3h6v6',
  doubleArrow: 'M3 13L13 3M7 3h6v6M9 13H3V7',
  rect: 'M2.5 3.5h11v9h-11z',
  ellipse: 'M8 3c3.3 0 6 2.2 6 5s-2.7 5-6 5-6-2.2-6-5 2.7-5 6-5z',
  blur: 'M2 2h4v4H2zM6 6h4v4H6zM10 2h4v4h-4zM2 10h4v4H2zM10 10h4v4h-4z',
  text: 'M3 3h10M8 3v10M6 13h4',
  callout: 'M8 2a5 5 0 110 10 5 5 0 010-10zM7 5.5l1.5-1v5M7 9.5h3',
  eraser: 'M9 2l5 5-6 6H4l-2-2zM6 5l5 5M4 13h10',
};

export function ToolIcon({ tool }: { tool: DrawTool }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[tool]} />
    </svg>
  );
}
