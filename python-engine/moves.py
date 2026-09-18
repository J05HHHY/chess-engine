"""Pseudo-legal and legal move generation, plus attack detection.

Mirrors src/engine/moves.ts in the TypeScript engine one directory up, but is
written independently rather than translated line-by-line -- see README.md.
No castling, en passant, or promotion yet (that's Weekend 5 in the plan).
"""

from dataclasses import dataclass
from typing import Optional

from board import Board, Color, Piece, Square

Offset = tuple[int, int]

KNIGHT_OFFSETS: list[Offset] = [
    (1, 2), (2, 1), (2, -1), (1, -2),
    (-1, -2), (-2, -1), (-2, 1), (-1, 2),
]
KING_OFFSETS: list[Offset] = [
    (1, 0), (1, 1), (0, 1), (-1, 1),
    (-1, 0), (-1, -1), (0, -1), (1, -1),
]
ROOK_DIRS: list[Offset] = [(1, 0), (-1, 0), (0, 1), (0, -1)]
BISHOP_DIRS: list[Offset] = [(1, 1), (1, -1), (-1, 1), (-1, -1)]
QUEEN_DIRS: list[Offset] = ROOK_DIRS + BISHOP_DIRS


@dataclass(frozen=True)
class Move:
    frm: Square
    to: Square


def in_bounds(rank: int, file: int) -> bool:
    return 0 <= rank < 8 and 0 <= file < 8


def _stepping_moves(board: Board, frm: Square, offsets: list[Offset]) -> list[Move]:
    piece = board[frm.rank][frm.file]
    assert piece is not None
    moves: list[Move] = []

    for dr, df in offsets:
        rank, file = frm.rank + dr, frm.file + df
        if not in_bounds(rank, file):
            continue

        target = board[rank][file]
        if target is None or target.color != piece.color:
            moves.append(Move(frm, Square(rank, file)))

    return moves


def _sliding_moves(board: Board, frm: Square, dirs: list[Offset]) -> list[Move]:
    piece = board[frm.rank][frm.file]
    assert piece is not None
    moves: list[Move] = []

    for dr, df in dirs:
        rank, file = frm.rank + dr, frm.file + df
        while in_bounds(rank, file):
            target = board[rank][file]
            if target is None:
                moves.append(Move(frm, Square(rank, file)))
            else:
                if target.color != piece.color:
                    moves.append(Move(frm, Square(rank, file)))
                break
            rank += dr
            file += df

    return moves


def _pawn_moves(board: Board, frm: Square) -> list[Move]:
    piece = board[frm.rank][frm.file]
    assert piece is not None
    moves: list[Move] = []
    direction = 1 if piece.color == "w" else -1
    start_rank = 1 if piece.color == "w" else 6
    one_rank = frm.rank + direction

    if in_bounds(one_rank, frm.file) and board[one_rank][frm.file] is None:
        moves.append(Move(frm, Square(one_rank, frm.file)))

        two_rank = frm.rank + direction * 2
        if frm.rank == start_rank and board[two_rank][frm.file] is None:
            moves.append(Move(frm, Square(two_rank, frm.file)))

    for df in (-1, 1):
        file = frm.file + df
        if not in_bounds(one_rank, file):
            continue

        target = board[one_rank][file]
        if target is not None and target.color != piece.color:
            moves.append(Move(frm, Square(one_rank, file)))

    return moves


def pseudo_legal_moves_from(board: Board, frm: Square) -> list[Move]:
    piece = board[frm.rank][frm.file]
    if piece is None:
        return []

    if piece.type == "n":
        return _stepping_moves(board, frm, KNIGHT_OFFSETS)
    if piece.type == "k":
        return _stepping_moves(board, frm, KING_OFFSETS)
    if piece.type == "r":
        return _sliding_moves(board, frm, ROOK_DIRS)
    if piece.type == "b":
        return _sliding_moves(board, frm, BISHOP_DIRS)
    if piece.type == "q":
        return _sliding_moves(board, frm, QUEEN_DIRS)
    if piece.type == "p":
        return _pawn_moves(board, frm)

    raise AssertionError(f"unhandled piece type: {piece.type}")


def pseudo_legal_moves(board: Board, color: Color) -> list[Move]:
    moves: list[Move] = []
    for rank in range(8):
        for file in range(8):
            piece = board[rank][file]
            if piece is not None and piece.color == color:
                moves.extend(pseudo_legal_moves_from(board, Square(rank, file)))
    return moves


def _matches_offset(frm: Square, target: Square, offsets: list[Offset]) -> bool:
    return any(frm.rank + dr == target.rank and frm.file + df == target.file for dr, df in offsets)


def _slide_reaches_target(board: Board, frm: Square, target: Square, dirs: list[Offset]) -> bool:
    for dr, df in dirs:
        rank, file = frm.rank + dr, frm.file + df
        while in_bounds(rank, file):
            if rank == target.rank and file == target.file:
                return True
            if board[rank][file] is not None:
                break
            rank += dr
            file += df
    return False


def _pawn_attacks_square(frm: Square, target: Square, color: Color) -> bool:
    direction = 1 if color == "w" else -1
    return target.rank == frm.rank + direction and abs(target.file - frm.file) == 1


def is_square_attacked(board: Board, target: Square, by_color: Color) -> bool:
    for rank in range(8):
        for file in range(8):
            piece = board[rank][file]
            if piece is None or piece.color != by_color:
                continue

            frm = Square(rank, file)
            if piece.type == "n" and _matches_offset(frm, target, KNIGHT_OFFSETS):
                return True
            if piece.type == "k" and _matches_offset(frm, target, KING_OFFSETS):
                return True
            if piece.type == "r" and _slide_reaches_target(board, frm, target, ROOK_DIRS):
                return True
            if piece.type == "b" and _slide_reaches_target(board, frm, target, BISHOP_DIRS):
                return True
            if piece.type == "q" and _slide_reaches_target(board, frm, target, QUEEN_DIRS):
                return True
            if piece.type == "p" and _pawn_attacks_square(frm, target, piece.color):
                return True

    return False


def find_king(board: Board, color: Color) -> Optional[Square]:
    for rank in range(8):
        for file in range(8):
            piece = board[rank][file]
            if piece is not None and piece.color == color and piece.type == "k":
                return Square(rank, file)
    return None


@dataclass(frozen=True)
class UndoInfo:
    move: Move
    captured: Optional[Piece]


def make_move(board: Board, move: Move) -> UndoInfo:
    piece = board[move.frm.rank][move.frm.file]
    captured = board[move.to.rank][move.to.file]

    board[move.to.rank][move.to.file] = piece
    board[move.frm.rank][move.frm.file] = None

    return UndoInfo(move, captured)


def unmake_move(board: Board, undo: UndoInfo) -> None:
    piece = board[undo.move.to.rank][undo.move.to.file]

    board[undo.move.frm.rank][undo.move.frm.file] = piece
    board[undo.move.to.rank][undo.move.to.file] = undo.captured


def legal_moves_from(board: Board, frm: Square) -> list[Move]:
    piece = board[frm.rank][frm.file]
    if piece is None:
        return []

    opponent: Color = "b" if piece.color == "w" else "w"
    legal: list[Move] = []

    for move in pseudo_legal_moves_from(board, frm):
        undo = make_move(board, move)
        king_square = find_king(board, piece.color)
        king_is_safe = king_square is None or not is_square_attacked(board, king_square, opponent)
        unmake_move(board, undo)

        if king_is_safe:
            legal.append(move)

    return legal


def legal_moves(board: Board, color: Color) -> list[Move]:
    moves: list[Move] = []
    for rank in range(8):
        for file in range(8):
            piece = board[rank][file]
            if piece is not None and piece.color == color:
                moves.extend(legal_moves_from(board, Square(rank, file)))
    return moves
