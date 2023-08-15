import { readFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { escapeHtml } from "./escape.js";

createServer(async (req, res) => {
  const author = "Jae Doe";
  const postContent = await readFile("./posts/hello-world.txt", "utf8");
  sendHTML(
    res,
    `<html>
      <head>
        <title>My blog</title>
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <hr />
        </nav>
        <article>
          ${escapeHtml(postContent)}
        </article>
        <footer>
          <hr>
          <p><i>(c) ${escapeHtml(author)}, ${new Date().getFullYear()}</i></p>
        </footer>
      </body>
    </html>`
  );
}).listen(8080);

function sendHTML(res:ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
}, html:string) {
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}
