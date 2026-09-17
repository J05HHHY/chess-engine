import type { Board } from "../engine/board";
import { pieceIconMarkup } from "./pieceIcons";

const FILES = 8;
const RANKS = 8;

export function renderBoardGrid(container: HTMLElement, board: Board): void {
  const boardEl = document.createElement("div");
  boardEl.className = "board";

  // Visual rows run top (rank 8) to bottom (rank 1), matching White's-side orientation.
  for (let visualRow = 0; visualRow < RANKS; visualRow++) {
    const rank = RANKS - 1 - visualRow;
    for (let file = 0; file < FILES; file++) {
      const square = document.createElement("div");
      const isDark = (file + rank) % 2 === 0;
      square.className = `square ${isDark ? "dark" : "light"}`;

      const piece = board[rank][file];
      if (piece) {
        square.innerHTML = pieceIconMarkup(piece.type, piece.color);
      }

      boardEl.appendChild(square);
    }
  }

  container.appendChild(boardEl);
}
