import type React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "pretix-widget": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { event?: string; items?: string },
        HTMLElement
      >;
      "pretix-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { event?: string; items?: string },
        HTMLElement
      >;
    }
  }
}

export {};
