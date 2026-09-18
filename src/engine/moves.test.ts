import { describe, expect, test } from "vitest";
import type { Board, Piece, Square } from "./board";
import { isSquareAttacked, legalMovesFrom } from "./moves";

function emptyBoard(): Board {
  return Array.from({ length: 8 }, () => Array<Piece | null>(8).fill(null));
}

function place(board: Board, square: Square, piece: Piece): void {
  board[square.rank][square.file] = piece;
}

describe("isSquareAttacked", () => {
  test("rook attacks along an open file", () => {
    const board = emptyBoard();
    place(board, { rank: 0, file: 4 }, { color: "b", type: "r" });

    expect(isSquareAttacked(board, { rank: 7, file: 4 }, "b")).toBe(true);
  });

  test("rook attack is blocked by an intervening piece", () => {
    const board = emptyBoard();
    place(board, { rank: 0, file: 4 }, { color: "b", type: "r" });
    place(board, { rank: 3, file: 4 }, { color: "w", type: "p" });

    expect(isSquareAttacked(board, { rank: 7, file: 4 }, "b")).toBe(false);
  });

  test("pawn attacks diagonally forward only, not straight ahead", () => {
    const board = emptyBoard();
    place(board, { rank: 3, file: 3 }, { color: "w", type: "p" });

    expect(isSquareAttacked(board, { rank: 4, file: 4 }, "w")).toBe(true);
    expect(isSquareAttacked(board, { rank: 4, file: 3 }, "w")).toBe(false);
  });
});

describe("legalMovesFrom", () => {
  test("a pinned rook can only move along the pin line", () => {
    const board = emptyBoard();
    place(board, { rank: 0, file: 4 }, { color: "w", type: "k" }); // e1
    place(board, { rank: 1, file: 4 }, { color: "w", type: "r" }); // e2, pinned
    place(board, { rank: 7, file: 4 }, { color: "b", type: "r" }); // e8, pinning

    const legal = legalMovesFrom(board, { rank: 1, file: 4 });

    expect(legal.length).toBeGreaterThan(0);
    expect(legal.every((move) => move.to.file === 4)).toBe(true);
  });

  test("the king cannot move into an attacked square", () => {
    const board = emptyBoard();
    place(board, { rank: 0, file: 4 }, { color: "w", type: "k" }); // e1
    place(board, { rank: 7, file: 3 }, { color: "b", type: "r" }); // d8, covers the d-file

    const legal = legalMovesFrom(board, { rank: 0, file: 4 });

    expect(legal.some((move) => move.to.file === 3)).toBe(false); // d1 is attacked
    expect(legal.some((move) => move.to.file === 5)).toBe(true); // f1 is safe
  });

  test("in check, a move that ignores the check is illegal", () => {
    const board = emptyBoard();
    place(board, { rank: 0, file: 4 }, { color: "w", type: "k" }); // e1, in check
    place(board, { rank: 7, file: 4 }, { color: "b", type: "r" }); // e8, giving check
    place(board, { rank: 0, file: 0 }, { color: "w", type: "r" }); // a1, can't reach the e-file

    expect(legalMovesFrom(board, { rank: 0, file: 0 })).toEqual([]);

    const kingMoves = legalMovesFrom(board, { rank: 0, file: 4 });
    expect(kingMoves.length).toBeGreaterThan(0);
    expect(kingMoves.every((move) => move.to.file !== 4)).toBe(true);
  });
});
