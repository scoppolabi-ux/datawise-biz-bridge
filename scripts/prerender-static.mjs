// Renders every public route to static HTML for GitHub Pages hosting.
// Runs after `vite build`: uses the built SSR bundle once, offline, then the
// published artifact (dist/client) is pure static files with no server runtime.
import { mkdir, writeFile, copyFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const OUT = join(ROOT, "dist", "client");
const ORIGIN = "https://www.datawisepartners.it";
const ROUTES = ["/", "/about", "/services", "/come-lavoriamo", "/contact", "/privacy", "/cookies"];

const { default: server } = await import(pathToFileURL(join(ROOT, "dist", "server", "server.js")).href);

async function render(path, expectStatus) {
  const res = await server.fetch(new Request(ORIGIN + path, { headers: { accept: "text/html" } }), {}, {});
  if (res.status !== expectStatus) throw new Error(`Prerender ${path}: expected ${expectStatus}, got ${res.status}`);
  const html = await res.text();
  if (!html.includes("<html")) throw new Error(`Prerender ${path}: response is not HTML`);
  return html;
}

async function write(file, html) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
  console.log(`[prerender-static] ${file.replace(ROOT + "/", "")}`);
}

for (const route of ROUTES) {
  const html = await render(route, 200);
  if (route === "/") {
    await write(join(OUT, "index.html"), html);
  } else {
    const name = route.slice(1);
    // /about resolves to about.html on GitHub Pages without a redirect;
    // about/index.html serves /about/ as well.
    await write(join(OUT, `${name}.html`), html);
    await write(join(OUT, name, "index.html"), html);
  }
}

await write(join(OUT, "404.html"), await render("/__dwp-not-found__", 404));

for (const file of ["CNAME"]) {
  const src = join(ROOT, "public", file);
  await access(src);
  await copyFile(src, join(OUT, file)).catch(() => {});
}
await access(join(OUT, "CNAME"));
console.log(`[prerender-static] ${ROUTES.length} routes + 404 written to dist/client`);
