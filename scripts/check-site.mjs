import { access, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const pages = ["index.html", "about.html", "contact.html", "legal.html"];
const failures = [];
const currentYear = new Date().getFullYear();
const siteCss = await readFile("assets/site.css", "utf8");
const siteJs = await readFile("assets/site.js", "utf8");
const expectedHero = {
  "about.html": "about-intro",
  "contact.html": "contact-hero",
  "legal.html": "legal-hero",
};
let sharedFooter = null;

if (siteCss.includes("site-loader") || siteJs.includes("site-loader")) failures.push("removed entry loader remains in shared assets");

for (const page of pages) {
  const html = await readFile(page, "utf8");
  const required = ["<title>", "<main", "</html>"];
  for (const marker of required) {
    if (!html.includes(marker)) failures.push(`${page}: missing ${marker}`);
  }

  if (html.includes("{{DATA:")) failures.push(`${page}: unresolved Stitch placeholder`);
  if (html.includes("lh3.googleusercontent.com")) failures.push(`${page}: remote Stitch image remains`);
  if (html.includes('href="#"')) failures.push(`${page}: unresolved placeholder link`);

  const headers = html.match(/<header class="site-header\b[\s\S]*?<\/header>/g) || [];
  const footers = html.match(/<footer class="site-footer\b[\s\S]*?<\/footer>/g) || [];
  if (headers.length !== 1) failures.push(`${page}: expected one shared header, found ${headers.length}`);
  if (footers.length !== 1) failures.push(`${page}: expected one shared footer, found ${footers.length}`);
  if (html.includes("site-loader") || html.includes("data-entry-state") || html.includes("waes-entry-seen")) failures.push(`${page}: removed entry loader remains`);
  if (!html.includes('rel="icon" type="image/png" href="./assets/Westfield AES Logo.png"')) failures.push(`${page}: new logo is not the favicon`);
  if (!html.includes('href="./assets/fonts.css"')) failures.push(`${page}: local typography stylesheet is missing`);
  if (html.includes("fonts.googleapis.com") || html.includes("fonts.gstatic.com")) failures.push(`${page}: remote font dependency remains`);
  if (!html.includes('class="site-footer__logo" src="./assets/westfield-aes-logo.jpeg"')) failures.push(`${page}: footer lockup is not using the JPEG logo`);
  if (!html.includes(`© ${currentYear} WAES`)) failures.push(`${page}: footer year is not current`);
  if ((html.match(/class="site-footer__link"/g) || []).length !== 4) failures.push(`${page}: footer navigation is incomplete`);
  if (!html.includes('data-menu-toggle') || !html.includes('data-mobile-menu')) failures.push(`${page}: responsive navigation is incomplete`);
  if (page === "index.html") {
    if ((html.match(/<section class="hero"/g) || []).length !== 1) failures.push(`${page}: expected one editorial home hero`);
    if (!html.includes("hero__title") || !html.includes("data-hero-signal")) failures.push(`${page}: hero composition is incomplete`);
    if ((html.match(/<article class="cap-card\b/g) || []).length !== 4) failures.push(`${page}: capability field is incomplete`);
    if ((html.match(/<article class="product\b/g) || []).length !== 3) failures.push(`${page}: product field is incomplete`);
    if (!html.includes('href="https://10trials.vercel.app"')) failures.push(`${page}: 10Trials project route is missing`);
    if (!html.includes("<h3>Atlas</h3>") || !html.includes('src="./assets/atlaslogo.png"')) failures.push(`${page}: Atlas product is incomplete`);
    if (!html.includes('href="https://atlas57.vercel.app/"')) failures.push(`${page}: Atlas project route is missing`);
    if (html.includes("TerraCrop")) failures.push(`${page}: replaced TerraCrop content remains`);
    if (!html.includes('class="origin"') || !html.includes("Built in Africa")) failures.push(`${page}: origin story is incomplete`);
    if (html.indexOf('id="products"') > html.indexOf('id="capabilities"')) failures.push(`${page}: products should appear before capability claims`);
    for (const removedCopy of ["Africa / Global", "Applied intelligence / 001", "WAES / SIGNAL 01", "Est. for difficult problems"]) {
      if (html.includes(removedCopy)) failures.push(`${page}: removed interface copy remains: ${removedCopy}`);
    }
    for (const route of ["./about.html", "./contact.html"]) {
      if (!html.includes(`href="${route}"`)) failures.push(`${page}: missing homepage route CTA for ${route}`);
    }
  }
  if (expectedHero[page] && !html.includes(expectedHero[page])) {
    failures.push(`${page}: redesigned page introduction is missing ${expectedHero[page]}`);
  }

  if (page === "about.html" && (!html.includes("about-manifesto__grid") || !html.includes("method__list"))) failures.push(`${page}: studio narrative is incomplete`);
  if (page === "contact.html" && (!html.includes("data-contact-form") || !html.includes('id="message"'))) failures.push(`${page}: project brief form is incomplete`);
  if (page === "legal.html" && (!html.includes('id="privacy"') || !html.includes('id="terms"'))) failures.push(`${page}: legal documents are incomplete`);

  if (footers[0]) {
    sharedFooter ??= footers[0];
    if (footers[0] !== sharedFooter) failures.push(`${page}: footer structure differs from the shared component`);
  }

  const localReferences = [...html.matchAll(/(?:href|src)="(\.\/[^"#?]+)[^\"]*"/g)].map((match) => match[1]);
  const backgroundReferences = [...html.matchAll(/url\('(\.\/[^']+)'\)/g)].map((match) => match[1]);
  for (const reference of new Set([...localReferences, ...backgroundReferences])) {
    try {
      await access(resolve(reference));
    } catch {
      failures.push(`${page}: missing referenced file ${reference}`);
    }
  }
}

if (!siteJs.includes("IntersectionObserver") || !siteJs.includes("prefers-reduced-motion: reduce")) {
  failures.push("site motion is missing viewport or reduced-motion handling");
}
if (!siteJs.includes('classList.add("is-visible"') || !siteJs.includes("observer.unobserve(entry.target)")) {
  failures.push("site reveal motion is not configured as a one-shot entrance");
}
if (!siteJs.includes("prepareProductCards") || !siteJs.includes('addEventListener("pageshow"')) {
  failures.push("product cards do not reset restored link focus");
}
if (!siteCss.includes("@media (hover: none)") || !siteCss.includes("@media (prefers-reduced-motion: reduce)")) failures.push("responsive interaction fallbacks are missing");

const assetNames = [
  "home-education.jpg", "home-climate.jpg", "home-management.jpg",
  "home-public.jpg", "home-africa.jpg",
  "about-team.jpg",
  "contact-map.jpg",
];

const fontNames = ["mona-sans-variable.woff2", "geist-sans-variable.woff2", "martian-mono-variable.woff2"];

for (const asset of assetNames) {
  const details = await stat(resolve("assets/images", asset));
  if (details.size < 1000) failures.push(`${asset}: downloaded file is unexpectedly small`);
}

for (const font of fontNames) {
  const details = await stat(resolve("assets/fonts", font));
  if (details.size < 10000) failures.push(`${font}: local font file is unexpectedly small`);
}

const atlasLogo = await stat(resolve("assets/atlaslogo.png"));
if (atlasLogo.size < 1000) failures.push("atlaslogo.png: product logo is unexpectedly small");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${pages.length} pages and ${assetNames.length} local design assets.`);
}
