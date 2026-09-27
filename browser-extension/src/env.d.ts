/** Stylesheets are bundled as text and injected into the toolbar's shadow root. */
declare module '*.css' {
  const text: string;
  export default text;
}

declare const __BROWSER__: 'chrome' | 'firefox';
declare const __TEST__: boolean;
