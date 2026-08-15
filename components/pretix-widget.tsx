import { createElement } from "react";

export function PretixWidget({ eventUrl }: { eventUrl: string }) {
  return createElement("div", {
    className: "pretix-widget-compat",
    event: eventUrl,
  });
}
