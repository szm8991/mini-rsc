import { readFile, readdir } from "fs/promises";
export async function Post({ slug }) {
  let content;
  try {
    content = await readFile('./posts/' + slug + '.txt', 'utf8');
  } catch (err) {
    throwNotFound(err);
  }
  return (
    <section>
      <h2>
        <a href={'/' + slug}>{slug}</a>
      </h2>
      <article>{content}</article>
    </section>
  );
}

export async function BlogIndexPage() {
  const postFiles = await readdir('./posts');
  const postSlugs = postFiles.map(file => file.slice(0, file.lastIndexOf('.')));
  return (
    <section>
      <h1>Welcome to my blog</h1>
      <div>
        {postSlugs.map(slug => (
          <Post key={slug} slug={slug} />
        ))}
      </div>
    </section>
  );
}

export function BlogPostPage({ postSlug }) {
  return <Post slug={postSlug} />;
}

export function BlogLayout({ children }) {
  const author = 'Jae Doe';
  return (
    <html>
      <head>
        <title>My blog</title>
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <hr />
          <input />
          <hr />
        </nav>
        <main>{children}</main>
        <Footer author={author} />
      </body>
    </html>
  );
}

export function Footer({ author }) {
  return (
    <footer>
      <hr />
      <p>
        <i>
          (c) {author} {new Date().getFullYear()}
        </i>
      </p>
    </footer>
  );
}

function throwNotFound(cause) {
    const notFound = new Error('Not found.', { cause });
    notFound.statusCode = 404;
    throw notFound;
  }