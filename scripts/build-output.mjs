import { copyFile, cp, mkdir, rm } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);
const outputDirectory = new URL("../public/", import.meta.url);
const pages = ["index.html", "about.html", "contact.html", "legal.html"];
const assetFiles = [
  "10trialslogo.png",
  "Westfield AES Logo.png",
  "fonts.css",
  "site.css",
  "site.js",
  "tailwind.css",
  "westfield-aes-logo.jpeg",
];
const assetDirectories = ["fonts", "images"];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await mkdir(new URL("assets/", outputDirectory), { recursive: true });

await Promise.all(
  pages.map((page) => copyFile(new URL(page, projectRoot), new URL(page, outputDirectory))),
);
await Promise.all(
  assetFiles.map((file) => copyFile(
    new URL(`assets/${file}`, projectRoot),
    new URL(`assets/${file}`, outputDirectory),
  )),
);
await Promise.all(
  assetDirectories.map((directory) => cp(
    new URL(`assets/${directory}/`, projectRoot),
    new URL(`assets/${directory}/`, outputDirectory),
    { recursive: true },
  )),
);

console.log(`Packaged ${pages.length} pages and production assets in public/.`);
