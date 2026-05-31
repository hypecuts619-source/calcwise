import fs from "fs";

let content = fs.readFileSync("src/pages/CalculatorDetail.tsx", "utf8");

const startStr = "const INPUT_MAP: Record<string, CalculationInput[]> = {";
const startIdx = content.indexOf(startStr);

if (startIdx === -1) {
  process.exit(1);
}

// Find exact end of the INPUT_MAP object using a brace counter
let bracketCount = 0;
let started = false;
let endCharIdx = -1;

for (let i = startIdx; i < content.length; i++) {
  if (content[i] === "{") {
    bracketCount++;
    started = true;
  } else if (content[i] === "}") {
    bracketCount--;
    if (started && bracketCount === 0) {
      endCharIdx = i;
      break;
    }
  }
}

const before = content.slice(0, startIdx + startStr.length);
const inside = content.slice(startIdx + startStr.length, endCharIdx);
const after = content.slice(endCharIdx);

// Now parse `inside` using a regex to grab top-level key blocks.
// The format is typically: `'key': [...],` or `key: [...]`
// Since we strictly used `'key': [`, we can split on `'\n  '` or similar, but regex is better.
const blockRegex = /'([^']+)'\s*:\s*\[([\s\S]*?)\]/g;
let match;
const blocks = new Map();

// If we put new elements at the top, they are encountered FIRST.
// So we only set the block if it hasn't been set.
while ((match = blockRegex.exec(inside)) !== null) {
  if (!blocks.has(match[1])) {
    // Reconstruct the block
    blocks.set(match[1], `  '${match[1]}': [${match[2]}]`);
  }
}

const joinedBlocks = Array.from(blocks.values()).join(",\n") + "\n";

const newContent = before + "\n" + joinedBlocks + after;

fs.writeFileSync("src/pages/CalculatorDetail.tsx", newContent);
console.log("DEDUPED");
