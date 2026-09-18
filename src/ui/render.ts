import type { Board, Square } from "../engine/board";
import { pieceAltText, pieceImageSrc } from "./pieceImages";

const FILES = 8;
const RANKS = 8;

export interface RenderOptions {
  selected?: Square | null;
  highlights?: Square[];
  onSquareClick?: (square: Square) => void;
}

function squareKey(square: Square): string {
  return `${square.rank},${square.file}`;
}

export function renderBoardGrid(container: HTMLElement, board: Board, options: RenderOptions = {}): void {
  container.innerHTML = "";

  const boardEl = document.createElement("div");
  boardEl.className = "board";

  const highlightSet = new Set((options.highlights ?? []).map(squareKey));

  // Visual rows run top (rank 8) to bottom (rank 1), matching White's-side orientation.
  for (let visualRow = 0; visualRow < RANKS; visualRow++) {
    const rank = RANKS - 1 - visualRow;
    for (let file = 0; file < FILES; file++) {
      const square: Square = { rank, file };
      const isDark = (file + rank) % 2 === 0;
      const classes = ["square", isDark ? "dark" : "light"];

      if (options.selected && options.selected.rank === rank && options.selected.file === file) {
        classes.push("selected");
      }
      if (highlightSet.has(squareKey(square))) {
        classes.push("highlight");
      }

      const squareEl = document.createElement("div");
      squareEl.className = classes.join(" ");

      const piece = board[rank][file];
      if (piece) {
        const img = document.createElement("img");
        img.className = "piece";
        img.src = pieceImageSrc(piece.type, piece.color);
        img.alt = pieceAltText(piece.type, piece.color);
        squareEl.appendChild(img);
      }

      if (options.onSquareClick) {
        squareEl.addEventListener("click", () => options.onSquareClick!(square));
      }

      boardEl.appendChild(squareEl);
    }
  }

  container.appendChild(boardEl);
}
