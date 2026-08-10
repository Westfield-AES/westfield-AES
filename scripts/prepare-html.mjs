import { readFile, writeFile } from "node:fs/promises";

const pages = [
  { file: "index.html", active: "home" },
  { file: "about.html", active: "about" },
  { file: "contact.html", active: "contact" },
  { file: "legal.html", active: "legal" },
];
const fetchScript = await readFile(new URL("./fetch-assets.sh", import.meta.url), "utf8");
const assets = [...fetchScript.matchAll(/^fetch ([^ ]+) '([^']+)'$/gm)].map(([, name, url]) => ({ name, url }));

function sharedFooter() {
  const year = new Date().getFullYear();
  return `
<!-- Shared Site Footer -->
<footer class="site-footer bg-surface-container-lowest w-full py-16 md:py-20 border-t border-white/5 text-on-surface">
  <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
    <div class="md:col-span-5">
      <a class="site-footer__brand font-headline-md text-headline-md font-bold text-on-surface tracking-tight" href="./index.html" aria-label="Westfield AES home">
        <img class="site-footer__logo" src="./assets/westfield-aes-logo.jpeg" alt="Westfield AES Technologies">
      </a>
      <p class="text-on-surface-variant mt-4 max-w-sm">Built from Africa, Designed for the world.</p>
      <p class="text-on-surface-variant text-sm mt-8">© ${year} Westfield AES Technologies.</p>
    </div>
    <nav class="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-x-8 gap-y-5 md:justify-end md:content-start font-label-sm text-label-sm uppercase tracking-widest" aria-label="Footer navigation">
      <a class="site-footer__link" href="./about.html">About</a>
      <a class="site-footer__link" href="./contact.html">Contact</a>
      <a class="site-footer__link" href="./legal.html#privacy">Privacy Policy</a>
      <a class="site-footer__link" href="./legal.html#terms">Terms of Service</a>
    </nav>
  </div>
</footer>`;
}

function replaceSharedChrome(html, active) {
  const bodyStart = html.indexOf("<body");
  const bodyContentStart = html.indexOf(">", bodyStart) + 1;
  const mainStart = html.indexOf("<main", bodyContentStart);

  if (bodyStart < 0 || bodyContentStart <= bodyStart || mainStart < 0) throw new Error(`Unable to locate page shell in ${active}`);
  html = `${html.slice(0, bodyContentStart)}\n${html.slice(mainStart)}`;

  const footerStart = html.indexOf("<footer", html.indexOf("<main"));
  const footerEnd = html.indexOf("</footer>", footerStart);
  if (footerStart < 0 || footerEnd < 0) throw new Error(`Unable to locate footer in ${active}`);
  return `${html.slice(0, footerStart)}${sharedFooter()}\n${html.slice(footerEnd + "</footer>".length)}`;
}

function routeForLabel(label) {
  const text = label.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  if (text === "westfield aes") return "./index.html";
  if (text === "about") return "./about.html";
  if (text === "contact" || text.includes("talk to us") || text.includes("join the vision")) return "./contact.html";
  if (text.includes("request beta") || text.includes("access platform")) return "./contact.html";
  if (text.includes("architecture")) return "./contact.html";
  if (text.includes("view product") || text.includes("explore platform")) return "./contact.html";
  if (text === "privacy policy") return "./legal.html#privacy";
  if (text === "terms of service") return "./legal.html#terms";
  return null;
}

for (const { file, active } of pages) {
  let html = await readFile(file, "utf8");
  html = html.replace(/\s*<!-- (?:Shared Site Header|Shared Site Footer|Site Entry Loader) -->/g, "");
  html = html.replace(/<script src="https:\/\/cdn\.tailwindcss\.com[^\"]*"><\/script>\s*/g, "");
  html = html.replace(/<script[^>]*>\s*tailwind\.config\s*=[\s\S]*?<\/script>\s*/g, "");
  html = html.replace(/<link[^>]+href="https:\/\/fonts\.googleapis\.com\/css2\?family=[^"]+"[^>]*>\s*/g, "");
  html = html.replace(/<!-- Local typography -->[\s\S]*?<!-- \/Local typography -->\s*/g, "");
  for (const { name, url } of assets) html = html.replaceAll(url, `./assets/images/${name}`);
  html = html.replace(/<img([^>]*?)data-alt="([^"]+)"([^>]*?)>/g, '<img$1alt="$2"$3>');
  html = html.replace(/<div([^>]*?)data-alt="([^"]+)"([^>]*?)>/g, '<div$1role="img" aria-label="$2"$3>');
  html = html.replace(/<span class="material-symbols-outlined/g, '<span aria-hidden="true" class="material-symbols-outlined');

  const favicon = '<link rel="icon" type="image/png" href="./assets/Westfield AES Logo.png">';
  if (/<link rel="icon"[^>]*>/i.test(html)) html = html.replace(/<link rel="icon"[^>]*>/i, favicon);
  else html = html.replace("</head>", `${favicon}\n</head>`);

  html = html.replace(/<script data-entry-state="westfield-aes">[\s\S]*?<\/script>\s*/g, "");

  html = html.replace(/href="#"([^>]*)>([\s\S]*?)<\/a>/g, (match, attributes, inner) => {
    const route = routeForLabel(inner);
    return route ? `href="${route}"${attributes}>${inner}</a>` : match;
  });

  if (!html.includes('href="./assets/site.css"')) {
    html = html.replace("</head>", [
      '<link rel="stylesheet" href="./assets/site.css">',
      "</head>",
    ].join("\n"));
  }
  if (!html.includes('href="./assets/tailwind.css"')) {
    html = html.replace(
      '<link rel="stylesheet" href="./assets/site.css">',
      '<link rel="stylesheet" href="./assets/tailwind.css">\n<link rel="stylesheet" href="./assets/site.css">',
    );
  }
  const typographyHead = `<!-- Local typography -->
<link rel="preload" href="./assets/fonts/mona-sans-variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="./assets/fonts/geist-sans-variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="./assets/fonts/martian-mono-variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="./assets/fonts.css">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
<!-- /Local typography -->`;
  html = html.replace("</head>", `${typographyHead}\n</head>`);
  if (!html.includes('src="./assets/site.js"')) {
    html = html.replace("</body>", '<script src="./assets/site.js"></script>\n</body>');
  }
  html = replaceSharedChrome(html, active);
  await writeFile(file, html);
}

console.log(`Prepared ${pages.length} pages with local assets and shared behavior.`);
