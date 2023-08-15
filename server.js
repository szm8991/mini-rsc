import { readFile } from 'fs/promises';
import { createServer } from 'node:http';
import sanitizeFilename from 'sanitize-filename';
import { renderJSXToClientJSX, renderJSXToHTML } from './compiler.js';
import { BlogIndexPage, BlogLayout, BlogPostPage } from './components.js';
function Router({ url }) {
  let page;
  if (url.pathname === '/') {
    page = <BlogIndexPage />;
  } else {
    const postSlug = sanitizeFilename(url.pathname.slice(1));
    page = <BlogPostPage postSlug={postSlug} />;
  }
  return <BlogLayout>{page}</BlogLayout>;
}

function stringifyJSX(key, value) {
  if (value === Symbol.for('react.element')) {
    return '$RE';
  } else if (typeof value === 'string' && value.startsWith('$')) {
    return '$' + value;
  } else {
    return value;
  }
}

async function sendJSX(res, jsx) {
  const clientJSX = await renderJSXToClientJSX(jsx);
  const clientJSXString = JSON.stringify(clientJSX, stringifyJSX);
  res.setHeader('Content-Type', 'application/json');
  res.end(clientJSXString);
}

async function sendScript(res, filename) {
  const content = await readFile(filename, 'utf8');
  res.setHeader('Content-Type', 'text/javascript');
  res.end(content);
}

async function sendHTML(res, jsx) {
  let html = await renderJSXToHTML(jsx);
  const clientJSX = await renderJSXToClientJSX(jsx);
  const clientJSXString = JSON.stringify(clientJSX, stringifyJSX);
  html += `<script>window.__INITIAL_CLIENT_JSX_STRING__ = `;
  html += JSON.stringify(clientJSXString).replace(/</g, '\\u003c');
  html += `</script>`;
  html += `
    <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@canary",
          "react-dom/client": "https://esm.sh/react-dom@canary/client"
        }
      }
    </script>
    <script type="module" src="/client.js"></script>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.end(html);
}

createServer(async (req, res) => {
  try {
    if (req.url === '/favicon.ico') return;
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === '/client.js') {
      await sendScript(res, './client.js');
    } else if (url.searchParams.has('jsx')) {
      url.searchParams.delete('jsx');
      console.log('send jsx');
      await sendJSX(res, <Router url={url} />);
    } else {
      await sendHTML(res, <Router url={url} />);
    }
  } catch (err) {
    console.error(err);
    res.statusCode = err.statusCode ?? 500;
    res.end();
  }
}).listen(8080);
