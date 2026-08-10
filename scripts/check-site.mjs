import { access, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const pages = ["index.html", "about.html", "contact.html", "legal.html"];
const failures = [];
const currentYear = new Date().getFullYear();
const siteCss = await readFile("assets/site.css", "utf8");
const siteJs = await readFile("assets/site.js", "utf8");
const expectedHeroVariant = {
  "about.html": "page-hero--about",
  "contact.html": "page-hero--contact",
  "legal.html": "page-hero--compact",
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

  const headers = html.match(/<header class="site-navbar\b[\s\S]*?<\/header>/g) || [];
  const footers = html.match(/<footer class="site-footer\b[\s\S]*?<\/footer>/g) || [];
  if (headers.length !== 0) failures.push(`${page}: removed navbar remains`);
  if (footers.length !== 1) failures.push(`${page}: expected one shared footer, found ${footers.length}`);
  if (html.includes("site-navbar") || html.includes("mobile-navigation")) failures.push(`${page}: navbar or mobile navigation markup remains`);
  if (/>\s*Westfield AES\s*</.test(footers[0] || "")) failures.push(`${page}: brand text remains in shared footer`);
  if (html.includes("site-loader") || html.includes("data-entry-state") || html.includes("waes-entry-seen")) failures.push(`${page}: removed entry loader remains`);
  if (!html.includes('rel="icon" type="image/png" href="./assets/Westfield AES Logo.png"')) failures.push(`${page}: new logo is not the favicon`);
  if (!html.includes('href="./assets/fonts.css"')) failures.push(`${page}: local typography stylesheet is missing`);
  if (html.includes("family=Inter") || html.includes("JetBrains+Mono")) failures.push(`${page}: legacy web fonts remain`);
  if (!html.includes('class="site-footer__logo" src="./assets/westfield-aes-logo.jpeg"')) failures.push(`${page}: footer lockup is not using the JPEG logo`);
  if (!html.includes(`© ${currentYear} Westfield AES Technologies.`)) failures.push(`${page}: footer year is not current`);
  if ((html.match(/class="site-footer__link"/g) || []).length !== 4) failures.push(`${page}: footer navigation is incomplete`);
  if (page === "index.html") {
    if ((html.match(/<section class="home-hero"/g) || []).length !== 1) failures.push(`${page}: expected one viewport-aware home hero`);
    if (!html.includes("home-hero__layout") || !html.includes("home-hero__copy")) failures.push(`${page}: brand-first hero structure is missing`);
    if (!html.includes("Westfield AES technologies") || !html.includes("Africa-rooted product and engineering company")) failures.push(`${page}: hero does not establish the company`);
    if (!html.includes('class="home-hero__logo" src="./assets/Westfield AES Logo.png"')) failures.push(`${page}: animated hero logo is missing`);
    if ((html.match(/data-home-section=/g) || []).length !== 3) failures.push(`${page}: expected three scroll-animated content sections`);
    if ((html.match(/\bhome-sector-card\b/g) || []).length !== 5) failures.push(`${page}: capability card motion sequence is incomplete`);
    if ((html.match(/class="home-product-card\b/g) || []).length !== 3) failures.push(`${page}: product card motion sequence is incomplete`);
    const globalSection = html.match(/<section class="[^"]*home-global\b[\s\S]*?<\/section>/)?.[0] || "";
    if (!globalSection.includes("Have a problem worth solving?") || !globalSection.includes('href="./contact.html"')) failures.push(`${page}: closing invitation is not part of the global section`);
    if (html.includes("home-cta")) failures.push(`${page}: removed standalone CTA section remains`);
    if (html.includes("min-h-[921px]")) failures.push(`${page}: legacy fixed hero height remains`);
    for (const route of ["./about.html", "./contact.html"]) {
      if (!html.includes(`href="${route}"`)) failures.push(`${page}: missing homepage route CTA for ${route}`);
    }
  }
  if (expectedHeroVariant[page]) {
    if ((html.match(/<section class="page-hero\b/g) || []).length !== 1) failures.push(`${page}: expected one shared page hero`);
    if (!html.includes(expectedHeroVariant[page])) failures.push(`${page}: incorrect page hero variant`);
    for (const element of ["page-hero__title", "page-hero__lead"]) {
      if (!html.includes(element)) failures.push(`${page}: shared page hero is missing ${element}`);
    }
    if (html.includes("page-hero__eyebrow")) failures.push(`${page}: removed page hero eyebrow remains`);
  }

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
  failures.push("homepage scroll motion is missing viewport or reduced-motion handling");
}
if (!siteJs.includes('classList.toggle("is-visible"') || siteJs.includes("observer.unobserve(entry.target)")) {
  failures.push("homepage section motion is not configured to reverse and replay");
}

const assetNames = [
  "home-education.jpg", "home-agriculture.jpg", "home-climate.jpg", "home-management.jpg",
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

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${pages.length} pages and ${assetNames.length} local design assets.`);
}
