import type { Board, Color, Square } from "./board";

export interface Move {
  from: Square;
  to: Square;
}

type Offset = readonly [number, number];

const KNIGHT_OFFSETS: Offset[] = [
  [1, 2], [2, 1], [2, -1], [1, -2],
  [-1, -2], [-2, -1], [-2, 1], [-1, 2],
];

const KING_OFFSETS: Offset[] = [
  [1, 0], [1, 1], [0, 1], [-1, 1],
  [-1, 0], [-1, -1], [0, -1], [1, -1],
];

const ROOK_DIRS: Offset[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const BISHOP_DIRS: Offset[] = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const QUEEN_DIRS: Offset[] = [...ROOK_DIRS, ...BISHOP_DIRS];

function inBounds(rank: number, file: number): boolean {
  return rank >= 0 && rank < 8 && file >= 0 && file < 8;
}

// No check detection yet: pseudo-legal moves may leave the mover's own king in check.
function steppingMoves(board: Board, from: Square, offsets: Offset[]): Move[] {
  const piece = board[from.rank][from.file]!;
  const moves: Move[] = [];

  for (const [dr, df] of offsets) {
    const rank = from.rank + dr;
    const file = from.file + df;
    if (!inBounds(rank, file)) continue;

    const target = board[rank][file];
    if (!target || target.color !== piece.color) {
      moves.push({ from, to: { rank, file } });
    }
  }

  return moves;
}

function slidingMoves(board: Board, from: Square, dirs: Offset[]): Move[] {
  const piece = board[from.rank][from.file]!;
  const moves: Move[] = [];

  for (const [dr, df] of dirs) {
    let rank = from.rank + dr;
    let file = from.file + df;

    while (inBounds(rank, file)) {
      const target = board[rank][file];
      if (!target) {
        moves.push({ from, to: { rank, file } });
      } else {
        if (target.color !== piece.color) {
          moves.push({ from, to: { rank, file } });
        }
        break;
      }
      rank += dr;
      file += df;
    }
  }

  return moves;
}

// No en passant or promotion yet (weekend 5).
function pawnMoves(board: Board, from: Square): Move[] {
  const piece = board[from.rank][from.file]!;
  const moves: Move[] = [];
  const dir = piece.color === "w" ? 1 : -1;
  const startRank = piece.color === "w" ? 1 : 6;
  const oneRank = from.rank + dir;

  if (inBounds(oneRank, from.file) && !board[oneRank][from.file]) {
    moves.push({ from, to: { rank: oneRank, file: from.file } });

    const twoRank = from.rank + dir * 2;
    if (from.rank === startRank && !board[twoRank][from.file]) {
      moves.push({ from, to: { rank: twoRank, file: from.file } });
    }
  }

  for (const df of [-1, 1]) {
    const file = from.file + df;
    if (!inBounds(oneRank, file)) continue;

    const target = board[oneRank][file];
    if (target && target.color !== piece.color) {
      moves.push({ from, to: { rank: oneRank, file } });
    }
  }

  return moves;
}

export function pseudoLegalMovesFrom(board: Board, from: Square): Move[] {
  const piece = board[from.rank][from.file];
  if (!piece) return [];

  switch (piece.type) {
    case "n": return steppingMoves(board, from, KNIGHT_OFFSETS);
    case "k": return steppingMoves(board, from, KING_OFFSETS);
    case "r": return slidingMoves(board, from, ROOK_DIRS);
    case "b": return slidingMoves(board, from, BISHOP_DIRS);
    case "q": return slidingMoves(board, from, QUEEN_DIRS);
    case "p": return pawnMoves(board, from);
  }
}

export function pseudoLegalMoves(board: Board, color: Color): Move[] {
  const moves: Move[] = [];

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (piece && piece.color === color) {
        moves.push(...pseudoLegalMovesFrom(board, { rank, file }));
      }
    }
  }

  return moves;
}
