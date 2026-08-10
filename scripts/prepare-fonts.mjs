import { copyFile, mkdir } from "node:fs/promises";

const fonts = [
  ["@fontsource-variable/mona-sans/files/mona-sans-latin-wght-normal.woff2", "mona-sans-variable.woff2"],
  ["@fontsource-variable/geist/files/geist-latin-wght-normal.woff2", "geist-sans-variable.woff2"],
  ["@fontsource-variable/martian-mono/files/martian-mono-latin-wght-normal.woff2", "martian-mono-variable.woff2"],
];
const outputDirectory = new URL("../assets/fonts/", import.meta.url);

await mkdir(outputDirectory, { recursive: true });
for (const [source, output] of fonts) {
  await copyFile(new URL(`../node_modules/${source}`, import.meta.url), new URL(output, outputDirectory));
}

console.log(`Prepared ${fonts.length} local variable fonts.`);
