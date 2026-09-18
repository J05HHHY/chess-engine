// Used by scripts/compare-engines.py to dump legal moves for a fixture
// position as JSON, in a format directly comparable to the Python engine's
// dumper output.
//
// Usage: npx tsx scripts/dump-legal-moves.ts <fixture.json> <out.json>

import { readFileSync, writeFileSync } from "node:fs";
import type { Board } from "../src/engine/board";
import { legalMoves, type Move } from "../src/engine/moves";

const [, , fixturePath, outPath] = process.argv;
if (!fixturePath || !outPath) {
  console.error("usage: dump-legal-moves.ts <fixture.json> <out.json>");
  process.exit(1);
}

function sortMoves(moves: Move[]): string[] {
  return moves
    .map((move: Move) => `${move.from.rank},${move.from.file}->${move.to.rank},${move.to.file}`)
    .sort();
}

const { board } = JSON.parse(readFileSync(fixturePath, "utf8")) as { board: Board };

const result: Record<"w" | "b", string[]> = {
  w: sortMoves(legalMoves(board, "w")),
  b: sortMoves(legalMoves(board, "b")),
};

writeFileSync(outPath, JSON.stringify(result, null, 2));
