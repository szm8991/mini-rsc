import { escapeHtml } from './escape.js';
export async function renderJSXToHTML(jsx) {
  if (typeof jsx === 'string' || typeof jsx === 'number') {
    return escapeHtml(jsx);
  } else if (jsx == null || typeof jsx === 'boolean') {
    return '';
  } else if (Array.isArray(jsx)) {
    const childHtmls = await Promise.all(jsx.map(child => renderJSXToHTML(child)));
    return childHtmls.join('');
  } else if (typeof jsx === 'object') {
    if (jsx.$$typeof === Symbol.for('react.element')) {
      if (typeof jsx.type === 'string') {
        let html = '<' + jsx.type;
        for (const propName in jsx.props) {
          if (jsx.props.hasOwnProperty(propName) && propName !== 'children') {
            html += ' ';
            html += propName;
            html += '=';
            html += escapeHtml(jsx.props[propName]);
          }
        }
        html += '>';
        html += await renderJSXToHTML(jsx.props.children);
        html += '</' + jsx.type + '>';
        return html;
      } else if (typeof jsx.type === 'function') {
        const Component = jsx.type;
        const props = jsx.props;
        const returnedJsx = await Component(props);
        return renderJSXToHTML(returnedJsx);
      } else throw new Error('Not implemented.');
    } else throw new Error('Cannot render an object.');
  } else throw new Error('Not implemented.');
}

export async function renderJSXToClientJSX(jsx) {
  if (
    typeof jsx === 'string' ||
    typeof jsx === 'number' ||
    typeof jsx === 'boolean' ||
    jsx == null
  ) {
    return jsx;
  } else if (Array.isArray(jsx)) {
    return Promise.all(jsx.map(child => renderJSXToClientJSX(child)));
  } else if (jsx != null && typeof jsx === 'object') {
    if (jsx.$$typeof === Symbol.for('react.element')) {
      if (typeof jsx.type === 'string') {
        return {
          ...jsx,
          props: await renderJSXToClientJSX(jsx.props),
        };
      } else if (typeof jsx.type === 'function') {
        const Component = jsx.type;
        const props = jsx.props;
        const returnedJsx = await Component(props);
        return renderJSXToClientJSX(returnedJsx);
      } else throw new Error('Not implemented.');
    } else {
      return Object.fromEntries(
        await Promise.all(
          Object.entries(jsx).map(async ([propName, value]) => [
            propName,
            await renderJSXToClientJSX(value),
          ])
        )
      );
    }
  } else throw new Error('Not implemented');
}
