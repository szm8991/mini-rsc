import { escapeHtml } from './escape.js';
export function renderJSXToHTML(jsx) {
    if (typeof jsx === "string" || typeof jsx === "number") {
      return escapeHtml(jsx);
    } else if (jsx == null || typeof jsx === "boolean") {
      return "";
    } else if (Array.isArray(jsx)) {
      return jsx.map((child) => renderJSXToHTML(child)).join("");
    } else if (typeof jsx === "object") {
      if (jsx.$$typeof === Symbol.for("react.element")) {
        if (typeof jsx.type === "string") {
          let html = "<" + jsx.type;
          for (const propName in jsx.props) {
            if (jsx.props.hasOwnProperty(propName) && propName !== "children") {
              html += " ";
              html += propName;
              html += "=";
              html += escapeHtml(jsx.props[propName]);
            }
          }
          html += ">";
          html += renderJSXToHTML(jsx.props.children);
          html += "</" + jsx.type + ">";
          return html;
        } else if (typeof jsx.type === "function") {
          const Component = jsx.type;
          const props = jsx.props;
          const returnedJsx = Component(props);
          return renderJSXToHTML(returnedJsx);
        } else throw new Error("Not implemented.");
      } else throw new Error("Cannot render an object.");
    } else throw new Error("Not implemented.");
  }