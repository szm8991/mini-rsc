import { readFile, readdir } from 'node:fs/promises';
import sanitizeFilename from 'sanitize-filename';
import { BlogIndexPage, BlogPostPage } from './components.js';
function throwNotFound(cause) {
  const notFound = new Error('Not found.', { cause });
  notFound.statusCode = 404;
  throw notFound;
}

export async function matchRoute(url) {
  if (url.pathname === '/') {
    const postFiles = await readdir('./posts');
    const postSlugs = postFiles.map(file => file.slice(0, file.lastIndexOf('.')));
    const postContents = await Promise.all(
      postSlugs.map(postSlug => readFile('./posts/' + postSlug + '.txt', 'utf8'))
    );
    return <BlogIndexPage postSlugs={postSlugs} postContents={postContents} />;
  } else {
    const postSlug = sanitizeFilename(url.pathname.slice(1));
    try {
      const postContent = await readFile('./posts/' + postSlug + '.txt', 'utf8');
      return <BlogPostPage postSlug={postSlug} postContent={postContent} />;
    } catch (err) {
      throwNotFound(err);
    }
  }
}
