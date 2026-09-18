import type { Board, Color, Piece, Square } from "./board";

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

function matchesOffset(from: Square, target: Square, offsets: Offset[]): boolean {
  return offsets.some(([dr, df]) => from.rank + dr === target.rank && from.file + df === target.file);
}

function slideReachesTarget(board: Board, from: Square, target: Square, dirs: Offset[]): boolean {
  for (const [dr, df] of dirs) {
    let rank = from.rank + dr;
    let file = from.file + df;

    while (inBounds(rank, file)) {
      if (rank === target.rank && file === target.file) return true;
      if (board[rank][file]) break;
      rank += dr;
      file += df;
    }
  }

  return false;
}

function pawnAttacksSquare(from: Square, target: Square, color: Color): boolean {
  const dir = color === "w" ? 1 : -1;
  return target.rank === from.rank + dir && Math.abs(target.file - from.file) === 1;
}

export function isSquareAttacked(board: Board, target: Square, byColor: Color): boolean {
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (!piece || piece.color !== byColor) continue;

      const from: Square = { rank, file };
      switch (piece.type) {
        case "n":
          if (matchesOffset(from, target, KNIGHT_OFFSETS)) return true;
          break;
        case "k":
          if (matchesOffset(from, target, KING_OFFSETS)) return true;
          break;
        case "r":
          if (slideReachesTarget(board, from, target, ROOK_DIRS)) return true;
          break;
        case "b":
          if (slideReachesTarget(board, from, target, BISHOP_DIRS)) return true;
          break;
        case "q":
          if (slideReachesTarget(board, from, target, QUEEN_DIRS)) return true;
          break;
        case "p":
          if (pawnAttacksSquare(from, target, piece.color)) return true;
          break;
      }
    }
  }

  return false;
}

export function findKing(board: Board, color: Color): Square | null {
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (piece && piece.color === color && piece.type === "k") {
        return { rank, file };
      }
    }
  }

  return null;
}

export interface UndoInfo {
  move: Move;
  captured: Piece | null;
}

// Mutates board in place; pair every call with unmakeMove once done inspecting the result.
export function makeMove(board: Board, move: Move): UndoInfo {
  const piece = board[move.from.rank][move.from.file];
  const captured = board[move.to.rank][move.to.file];

  board[move.to.rank][move.to.file] = piece;
  board[move.from.rank][move.from.file] = null;

  return { move, captured };
}

export function unmakeMove(board: Board, undo: UndoInfo): void {
  const piece = board[undo.move.to.rank][undo.move.to.file];

  board[undo.move.from.rank][undo.move.from.file] = piece;
  board[undo.move.to.rank][undo.move.to.file] = undo.captured;
}

export function legalMovesFrom(board: Board, from: Square): Move[] {
  const piece = board[from.rank][from.file];
  if (!piece) return [];

  const opponent: Color = piece.color === "w" ? "b" : "w";

  return pseudoLegalMovesFrom(board, from).filter((move) => {
    const undo = makeMove(board, move);
    const kingSquare = findKing(board, piece.color);
    const kingIsSafe = kingSquare === null || !isSquareAttacked(board, kingSquare, opponent);
    unmakeMove(board, undo);
    return kingIsSafe;
  });
}

export function legalMoves(board: Board, color: Color): Move[] {
  const moves: Move[] = [];

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (piece && piece.color === color) {
        moves.push(...legalMovesFrom(board, { rank, file }));
      }
    }
  }

  return moves;
}
