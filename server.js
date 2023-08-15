import { createServer } from "node:http";
import { renderJSXToHTML } from './compiler.js';
import { BlogLayout } from './components.js';
import { matchRoute } from './route.js';
function sendHTML(res, jsx) {
  const html = renderJSXToHTML(jsx);
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const page = await matchRoute(url);
    sendHTML(res, <BlogLayout>{page}</BlogLayout>);
  } catch (err) {
    console.error(err);
    res.statusCode = err.statusCode ?? 500;
    res.end();
  }
}).listen(8080);