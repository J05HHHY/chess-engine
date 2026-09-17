import type { Board, Piece } from "../engine/board";

const FILES = 8;
const RANKS = 8;

const PIECE_GLYPHS: Record<Piece["color"], Record<Piece["type"], string>> = {
  w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
  b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" },
};

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
        square.textContent = PIECE_GLYPHS[piece.color][piece.type];
      }

      boardEl.appendChild(square);
    }
  }

  container.appendChild(boardEl);
}
