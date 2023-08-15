export function BlogIndexPage({ postSlugs, postContents }) {
  return (
    <section>
      <h1>Welcome to my blog</h1>
      <div>
        {postSlugs.map((postSlug, index) => (
          <section key={postSlug}>
            <h2>
              <a href={'/' + postSlug}>{postSlug}</a>
            </h2>
            <article>{postContents[index]}</article>
          </section>
        ))}
      </div>
    </section>
  );
}

export function BlogPostPage({ postSlug, postContent }) {
  return (
    <section>
      <h2>
        <a href={'/' + postSlug}>{postSlug}</a>
      </h2>
      <article>{postContent}</article>
    </section>
  );
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
