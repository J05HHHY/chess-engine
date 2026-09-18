export type Color = "w" | "b";
export type PieceType = "p" | "n" | "b" | "r" | "q" | "k";

export interface Piece {
  color: Color;
  type: PieceType;
}

// board[rank][file], rank 0 = rank 1 (White's back rank), file 0 = file a
export type Board = (Piece | null)[][];

export interface Square {
  rank: number;
  file: number;
}

const BACK_RANK: PieceType[] = ["r", "n", "b", "q", "k", "b", "n", "r"];

export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: 8 }, () => Array<Piece | null>(8).fill(null));

  for (let file = 0; file < 8; file++) {
    board[0][file] = { color: "w", type: BACK_RANK[file] };
    board[1][file] = { color: "w", type: "p" };
    board[6][file] = { color: "b", type: "p" };
    board[7][file] = { color: "b", type: BACK_RANK[file] };
  }

  return board;
}
