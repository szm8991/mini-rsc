import { createServer } from "node:http";
import sanitizeFilename from "sanitize-filename";
import { renderJSXToHTML } from './compiler.js';
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

async function sendHTML(res, jsx) {
  const html = await renderJSXToHTML(jsx);
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}

createServer(async (req, res) => {
  try {
    if(req.url==='/favicon.ico') return
    const url = new URL(req.url, `http://${req.headers.host}`);
    await sendHTML(res, <Router url={url} />);
  } catch (err) {
    console.error(err);
    res.statusCode = err.statusCode ?? 500;
    res.end();
  }
}).listen(8080);