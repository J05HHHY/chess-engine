import "./style.css";
import { createInitialBoard, type Square } from "./engine/board";
import { legalMovesFrom } from "./engine/moves";
import { renderBoardGrid } from "./ui/render";

const app = document.querySelector<HTMLDivElement>("#app")!;
const board = createInitialBoard();

let selected: Square | null = null;

function render(): void {
  const highlights = selected ? legalMovesFrom(board, selected).map((move) => move.to) : [];

  renderBoardGrid(app, board, {
    selected,
    highlights,
    onSquareClick: handleSquareClick,
  });
}

function handleSquareClick(square: Square): void {
  const isSameSquare = selected && selected.rank === square.rank && selected.file === square.file;
  const hasPiece = board[square.rank][square.file] !== null;

  selected = isSameSquare || !hasPiece ? null : square;
  render();
}

render();
