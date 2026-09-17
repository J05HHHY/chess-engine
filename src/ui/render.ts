const FILES = 8;
const RANKS = 8;

export function renderBoardGrid(container: HTMLElement): void {
  const board = document.createElement("div");
  board.className = "board";

  for (let rank = 0; rank < RANKS; rank++) {
    for (let file = 0; file < FILES; file++) {
      const square = document.createElement("div");
      const isLight = (file + rank) % 2 === 0;
      square.className = `square ${isLight ? "light" : "dark"}`;
      board.appendChild(square);
    }
  }

  container.appendChild(board);
}
