import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC_ART_DIR = "C:/projects/GDG/DevFest-Madurai-Source/DevFest-Madurai/public/art";
const DEST_ART_DIR = "C:/projects/devfest-madurai-2026/public/art";
const PUBLIC_DIR = "C:/projects/devfest-madurai-2026/public";

const TARGET_W = 1773;
const TARGET_H = 1167;

async function main() {
  fs.mkdirSync(DEST_ART_DIR, { recursive: true });

  // 1. Copy all Madurai architectural art assets to public/art/
  const files = fs.readdirSync(SRC_ART_DIR).filter((f) => f.endsWith(".webp"));
  for (const file of files) {
    fs.copyFileSync(path.join(SRC_ART_DIR, file), path.join(DEST_ART_DIR, file));
  }
  console.log(`Copied ${files.length} Madurai architectural assets to public/art/`);

  // 2. Build public/venue.webp (1773x1167) from Madurai waterfront.webp
  const venueSrc = path.join(SRC_ART_DIR, "waterfront.webp");
  const venueDest = path.join(PUBLIC_DIR, "venue.webp");
  await sharp(venueSrc)
    .resize(TARGET_W, TARGET_H, { fit: "cover", position: "center" })
    .webp({ quality: 86 })
    .toFile(venueDest);
  console.log("Generated Madurai public/venue.webp (1773x1167)");

  // 3. Trace architectural contours of waterfront.webp into public/venue-lines.svg (viewBox 0 0 1773 1167)
  // Sample at 591x389 (exact 1/3 scale of 1773x1167) so Sobel edges are clean and fast
  const SCALE = 3;
  const W = TARGET_W / SCALE; // 591
  const H = TARGET_H / SCALE; // 389

  const { data } = await sharp(venueDest)
    .resize(W, H, { fit: "fill" })
    .greyscale()
    .blur(0.8)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Compute Sobel gradient magnitude
  const mag = new Float32Array(W * H);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const idx = y * W + x;
      const gx =
        -data[(y - 1) * W + (x - 1)] +
        data[(y - 1) * W + (x + 1)] -
        2 * data[y * W + (x - 1)] +
        2 * data[y * W + (x + 1)] -
        data[(y + 1) * W + (x - 1)] +
        data[(y + 1) * W + (x + 1)];
      const gy =
        -data[(y - 1) * W + (x - 1)] -
        2 * data[(y - 1) * W + x] -
        data[(y - 1) * W + (x + 1)] +
        data[(y + 1) * W + (x - 1)] +
        2 * data[(y + 1) * W + x] +
        data[(y + 1) * W + (x + 1)];
      mag[idx] = Math.hypot(gx, gy);
    }
  }

  // Non-maximum suppression + threshold to get crisp 1px architectural edges
  const EDGE_THRESHOLD = 95;
  const visited = new Uint8Array(W * H);
  const edge = new Uint8Array(W * H);
  for (let y = 2; y < H - 2; y++) {
    for (let x = 2; x < W - 2; x++) {
      const idx = y * W + x;
      const m = mag[idx];
      if (m < EDGE_THRESHOLD) continue;
      // Local maximum check along horizontal or vertical
      const isHorizMax = m >= mag[idx - 1] && m >= mag[idx + 1];
      const isVertMax = m >= mag[idx - W] && m >= mag[idx + W];
      if (isHorizMax || isVertMax) {
        edge[idx] = 1;
      }
    }
  }

  // Trace connected chains of edge pixels into polylines
  const dirs = [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ];

  const chains = [];
  for (let y = 2; y < H - 2; y++) {
    for (let x = 2; x < W - 2; x++) {
      const startIdx = y * W + x;
      if (!edge[startIdx] || visited[startIdx]) continue;
      const chain = [[x * SCALE, y * SCALE]];
      visited[startIdx] = 1;
      let cx = x;
      let cy = y;
      while (true) {
        let found = false;
        for (const [dx, dy] of dirs) {
          const nx = cx + dx;
          const ny = cy + dy;
          const nIdx = ny * W + nx;
          if (edge[nIdx] && !visited[nIdx]) {
            visited[nIdx] = 1;
            chain.push([nx * SCALE, ny * SCALE]);
            cx = nx;
            cy = ny;
            found = true;
            break;
          }
        }
        if (!found) break;
      }
      if (chain.length >= 8) {
        chains.push(chain);
      }
    }
  }

  // Simplify chains (keep every 2nd point) and group into 40 <path> elements sorted top-to-bottom / left-to-right
  chains.sort((a, b) => a[0][0] - b[0][0] || a[0][1] - b[0][1]);
  const NUM_PATHS = 40;
  const bucketSize = Math.max(1, Math.ceil(chains.length / NUM_PATHS));
  const pathElements = [];

  for (let b = 0; b < NUM_PATHS; b++) {
    const slice = chains.slice(b * bucketSize, (b + 1) * bucketSize);
    if (slice.length === 0) continue;
    let d = "";
    for (const chain of slice) {
      d += `M${chain[0][0]} ${chain[0][1]}`;
      for (let i = 2; i < chain.length; i += 2) {
        d += `L${chain[i][0]} ${chain[i][1]}`;
      }
      const last = chain[chain.length - 1];
      d += `L${last[0]} ${last[1]}`;
    }
    pathElements.push(`<path stroke="#000" d="${d}"/>`);
  }

  const svg = `<svg id="venueSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TARGET_W} ${TARGET_H}" preserveAspectRatio="xMidYMid meet">${pathElements.join("")}</svg>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, "venue-lines.svg"), svg);
  console.log(`Generated Madurai public/venue-lines.svg (${pathElements.length} paths, ${(svg.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
