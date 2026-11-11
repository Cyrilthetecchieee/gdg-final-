/**
 * Regenerates every brand asset that has the city name baked into geometry,
 * so a city rename is: edit CITY below, run this once, commit the outputs.
 *
 *   node scripts/build-city-brand-assets.mjs        (needs network: font downloads)
 *
 * Outputs
 *  1. public/fonts/google-sans-bold.typeface.json
 *     three.js typeface used by the hero's extruded WebGL title. It is a
 *     SUBSET (only the glyphs in TITLE_CHARS) because the hero loads it on the
 *     critical path; a full Latin face is ~10x the bytes. Any character in
 *     siteConfig.shortName that is not in TITLE_CHARS renders as nothing.
 *  2. public/fonts/noto-sans-tamil-city.typeface.json
 *     The Tamil city name, shaped with fontkit and stored as ONE PUA glyph
 *     (U+E000). TextGeometry cannot compose Tamil vowel signs from loose
 *     Unicode, so the whole word is pre-shaped. Shown on the back of the hero's
 *     city line after a click-flip.
 *  3. public/brand-assets/devfest-logo-wo-brackets-dark.svg
 *     The DevFest lockup used by BracketsField (extruded 3D settle) and the
 *     footer. Its pill text is outlined paths, not <text>, so the city name is
 *     re-drawn here: the old pill-text paths are removed and new outlines are
 *     sized to the same height, baseline and centre.
 *
 * Fonts: Google Sans and Noto Sans Tamil, both SIL Open Font License.
 */
import { Buffer } from "node:buffer";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const fontkit = require("fontkit");

// ── Edit these for a different city ────────────────────────────────────────
const CITY = "Madurai";
const CITY_TAMIL = "மதுரை";
/** Every glyph the hero title can use. Must cover siteConfig.shortName. */
const TITLE_CHARS = `DevFest ${CITY} 2026`;
/** Weight of the outlined city name inside the lockup pill. */
const PILL_WEIGHT = 500;
// ───────────────────────────────────────────────────────────────────────────

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const RESOLUTION = 1000;
const PUA = "\uE000";
const TAMIL_FONT_URL =
  "https://fonts.gstatic.com/s/notosanstamil/v31/ieVc2YdFI3GCY6SyQy1KfStzYKZgzN1z4LKDbeZce-0429tBManUktuex7shpL0R.ttf";

/** Resolve a static TTF for a Google Fonts family/weight via the CSS2 API.
 *  Node's default fetch UA is served truetype URLs, which fontkit reads. */
async function googleFontTtf(family, weight) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`)
  ).text();
  const url = css.match(/url\((https:[^)]+)\)/)?.[1];
  if (!url) throw new Error(`No font URL for ${family} ${weight}:\n${css.slice(0, 300)}`);
  return download(url);
}

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status} ${url}`);
  return fontkit.create(Buffer.from(await res.arrayBuffer()));
}

const r2 = (n) => Math.round(n * 100) / 100;

/** fontkit path -> three.js typeface outline tokens (see FontLoader.createPath). */
function typefaceOutline(path, dx, dy, scale) {
  const out = [];
  const X = (x) => r2((x + dx) * scale);
  const Y = (y) => r2((y + dy) * scale);
  for (const { command, args: a } of path.commands) {
    switch (command) {
      case "moveTo":
        out.push("m", X(a[0]), Y(a[1]));
        break;
      case "lineTo":
        out.push("l", X(a[0]), Y(a[1]));
        break;
      case "quadraticCurveTo": // typeface q: dest, then control
        out.push("q", X(a[2]), Y(a[3]), X(a[0]), Y(a[1]));
        break;
      case "bezierCurveTo":
        out.push("b", X(a[4]), Y(a[5]), X(a[0]), Y(a[1]), X(a[2]), Y(a[3]));
        break;
      case "closePath":
        out.push("z");
        break;
      default:
        throw new Error(`Unhandled path command: ${command}`);
    }
  }
  return out;
}

function typefaceMeta(font, scale, familyName, bbox) {
  return {
    familyName,
    ascender: Math.round(font.ascent * scale),
    descender: Math.round(font.descent * scale),
    underlinePosition: Math.round(font.underlinePosition * scale),
    underlineThickness: Math.round(font.underlineThickness * scale),
    boundingBox: bbox,
    resolution: RESOLUTION,
    original_font_information: { fullName: { en: font.fullName }, copyright: { en: font.copyright } },
  };
}

// 1. Latin title subset ──────────────────────────────────────────────────────
async function buildTitleTypeface() {
  const font = await googleFontTtf("Google Sans", 700);
  // facetype.js's scale, which the original face was built with. The hero's
  // line gap and fit maths are tuned to glyphs at this size, so keep it rather
  // than the "cleaner" RESOLUTION / unitsPerEm (that renders ~1.39x smaller).
  const scale = 100000 / (font.unitsPerEm * 72);
  const glyphs = {};
  const box = { xMin: Infinity, xMax: -Infinity, yMin: Infinity, yMax: -Infinity };
  for (const ch of new Set(TITLE_CHARS)) {
    const g = font.glyphForCodePoint(ch.codePointAt(0));
    const b = g.path.bbox;
    const empty = !g.path.commands.length;
    glyphs[ch] = {
      ha: Math.round(g.advanceWidth * scale),
      x_min: empty ? 0 : Math.round(b.minX * scale),
      x_max: empty ? 0 : Math.round(b.maxX * scale),
      o: empty ? "" : `${typefaceOutline(g.path, 0, 0, scale).join(" ")} `,
    };
    if (!empty) {
      box.xMin = Math.min(box.xMin, Math.round(b.minX * scale));
      box.xMax = Math.max(box.xMax, Math.round(b.maxX * scale));
      box.yMin = Math.min(box.yMin, Math.round(b.minY * scale));
      box.yMax = Math.max(box.yMax, Math.round(b.maxY * scale));
    }
  }
  const out = join(root, "public/fonts/google-sans-bold.typeface.json");
  await writeFile(out, JSON.stringify({ glyphs, ...typefaceMeta(font, scale, "Google Sans Bold", box) }));
  console.log(`title typeface: ${Object.keys(glyphs).sort().join("")} -> ${out}`);
}

// 2. Tamil city name as one shaped PUA glyph ────────────────────────────────
async function buildTamilTypeface() {
  const font = await download(TAMIL_FONT_URL);
  const run = font.layout(CITY_TAMIL);
  const scale = RESOLUTION / font.unitsPerEm;
  const outline = [];
  const box = { xMin: Infinity, xMax: -Infinity, yMin: Infinity, yMax: -Infinity };
  let penX = 0;
  let penY = 0;
  run.glyphs.forEach((glyph, i) => {
    const pos = run.positions[i];
    const dx = penX + pos.xOffset;
    const dy = penY + pos.yOffset;
    const b = glyph.path.bbox;
    if (glyph.path.commands.length) {
      box.xMin = Math.min(box.xMin, Math.round((b.minX + dx) * scale));
      box.xMax = Math.max(box.xMax, Math.round((b.maxX + dx) * scale));
      box.yMin = Math.min(box.yMin, Math.round((b.minY + dy) * scale));
      box.yMax = Math.max(box.yMax, Math.round((b.maxY + dy) * scale));
      outline.push(...typefaceOutline(glyph.path, dx, dy, scale));
    }
    penX += pos.xAdvance;
    penY += pos.yAdvance;
  });
  const glyphs = { [PUA]: { ha: Math.round(penX * scale), x_min: box.xMin, x_max: box.xMax, o: `${outline.join(" ")} ` } };
  const out = join(root, "public/fonts/noto-sans-tamil-city.typeface.json");
  await writeFile(
    out,
    JSON.stringify({ glyphs, ...typefaceMeta(font, scale, `Noto Sans Tamil Bold (${CITY_TAMIL})`, box) }),
  );
  console.log(`tamil typeface: ${run.glyphs.length} shaped glyphs -> ${out}`);
}

// 3. Lockup pill text ───────────────────────────────────────────────────────

/** Bounding box of an SVG path `d` (endpoints + control points: a safe
 *  over-estimate, which is all the sizing needs). Handles every command
 *  these exported SVGs use, absolute and relative. */
function pathBBox(d) {
  const toks = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g);
  let i = 0;
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let cmd = "";
  const b = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  const add = (x, y) => {
    b.minX = Math.min(b.minX, x);
    b.maxX = Math.max(b.maxX, x);
    b.minY = Math.min(b.minY, y);
    b.maxY = Math.max(b.maxY, y);
  };
  const num = () => parseFloat(toks[i++]);
  while (i < toks.length) {
    if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++];
    const rel = cmd === cmd.toLowerCase();
    const ox = rel ? cx : 0;
    const oy = rel ? cy : 0;
    switch (cmd.toUpperCase()) {
      case "M":
      case "L":
      case "T": {
        cx = ox + num();
        cy = oy + num();
        if (cmd.toUpperCase() === "M") {
          sx = cx;
          sy = cy;
          cmd = rel ? "l" : "L";
        }
        add(cx, cy);
        break;
      }
      case "H":
        cx = ox + num();
        add(cx, cy);
        break;
      case "V":
        cy = oy + num();
        add(cx, cy);
        break;
      case "C":
        for (let k = 0; k < 3; k++) {
          const x = ox + num();
          const y = oy + num();
          add(x, y);
          if (k === 2) [cx, cy] = [x, y];
        }
        break;
      case "S":
      case "Q":
        for (let k = 0; k < 2; k++) {
          const x = ox + num();
          const y = oy + num();
          add(x, y);
          if (k === 1) [cx, cy] = [x, y];
        }
        break;
      case "A":
        i += 5;
        cx = ox + num();
        cy = oy + num();
        add(cx, cy);
        break;
      case "Z":
        cx = sx;
        cy = sy;
        break;
      default:
        throw new Error(`Unhandled SVG command ${cmd}`);
    }
  }
  return b;
}

async function buildLockup() {
  const file = join(root, "public/brand-assets/devfest-logo-wo-brackets-dark.svg");
  let svg = await readFile(file, "utf8");
  const paths = [...svg.matchAll(/<path\b[^>]*\/>/g)].map((m) => m[0]);
  // The pill is the first path whose top edge is in the lower half of the
  // viewBox (y > 300); every path after it in that band is pill text. The
  // DevFest wordmark sits entirely above y = 300.
  const lower = paths.filter((p) => pathBBox(p.match(/\sd="([^"]+)"/)[1]).minY > 300);
  const [pill, ...text] = lower;
  if (!pill || !text.length) throw new Error("Could not locate the pill and its text in the lockup SVG");
  const tb = text
    .map((p) => pathBBox(p.match(/\sd="([^"]+)"/)[1]))
    .reduce((a, b) => ({
      minX: Math.min(a.minX, b.minX),
      minY: Math.min(a.minY, b.minY),
      maxX: Math.max(a.maxX, b.maxX),
      maxY: Math.max(a.maxY, b.maxY),
    }));
  const fill = text[0].match(/fill="([^"]+)"/)?.[1] ?? "#1E1E1E";

  const font = await googleFontTtf("Google Sans", PILL_WEIGHT);
  const run = font.layout(CITY);
  // Lay the word out in font units (y up), then fit its ink box to the old
  // word's ink box height and anchor to the old baseline (bottom) and centre.
  const parts = [];
  let penX = 0;
  const ink = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  run.glyphs.forEach((g, i) => {
    const b = g.path.bbox;
    if (g.path.commands.length) {
      ink.minX = Math.min(ink.minX, b.minX + penX);
      ink.maxX = Math.max(ink.maxX, b.maxX + penX);
      ink.minY = Math.min(ink.minY, b.minY);
      ink.maxY = Math.max(ink.maxY, b.maxY);
      parts.push({ path: g.path, dx: penX });
    }
    penX += run.positions[i].xAdvance;
  });
  const s = (tb.maxY - tb.minY) / (ink.maxY - ink.minY);
  const cxOld = (tb.minX + tb.maxX) / 2;
  const cxNew = ((ink.minX + ink.maxX) / 2) * s;
  const tx = cxOld - cxNew;
  const ty = tb.maxY + ink.minY * s; // baseline: font y=ink.minY lands on old bottom
  const P = (x, y, dx) => `${r2((x + dx) * s + tx)} ${r2(ty - y * s)}`;
  const newPaths = parts.map(({ path, dx }) => {
    let d = "";
    for (const { command, args: a } of path.commands) {
      if (command === "moveTo") d += `M${P(a[0], a[1], dx)}`;
      else if (command === "lineTo") d += `L${P(a[0], a[1], dx)}`;
      else if (command === "quadraticCurveTo") d += `Q${P(a[0], a[1], dx)} ${P(a[2], a[3], dx)}`;
      else if (command === "bezierCurveTo") d += `C${P(a[0], a[1], dx)} ${P(a[2], a[3], dx)} ${P(a[4], a[5], dx)}`;
      else if (command === "closePath") d += "Z";
    }
    return `<path d="${d}" fill="${fill}"/>`;
  });

  for (const p of text) svg = svg.replace(p, "");
  svg = svg.replace(pill, `${pill}\n${newPaths.join("\n")}`);
  // Keep the header comment truthful about which word the pill carries.
  svg = svg.replace(/its black '[^']+' text/, `its black '${CITY}' text`);
  await writeFile(file, svg.replace(/\n{3,}/g, "\n\n"));
  console.log(
    `lockup: replaced ${text.length} pill-text paths with ${newPaths.length} (${CITY}), ` +
      `box x ${r2(tb.minX)}-${r2(tb.maxX)} y ${r2(tb.minY)}-${r2(tb.maxY)}, scale ${r2(s * 1000) / 1000}`,
  );
}

const only = process.argv[2];
if (!only || only === "title") await buildTitleTypeface();
if (!only || only === "tamil") await buildTamilTypeface();
if (!only || only === "lockup") await buildLockup();
