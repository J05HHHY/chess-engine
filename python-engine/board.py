"""Board data model. rank 0 = rank 1 (White's back rank), file 0 = file a.

Mirrors src/engine/board.ts in the TypeScript engine one directory up, but is
written independently rather than translated line-by-line -- see README.md.
"""

from dataclasses import dataclass
from typing import Literal, Optional

Color = Literal["w", "b"]
PieceType = Literal["p", "n", "b", "r", "q", "k"]


@dataclass(frozen=True)
class Piece:
    color: Color
    type: PieceType


@dataclass(frozen=True)
class Square:
    rank: int
    file: int


Board = list[list[Optional[Piece]]]

_BACK_RANK: list[PieceType] = ["r", "n", "b", "q", "k", "b", "n", "r"]


def create_initial_board() -> Board:
    board: Board = [[None] * 8 for _ in range(8)]

    for file in range(8):
        board[0][file] = Piece("w", _BACK_RANK[file])
        board[1][file] = Piece("w", "p")
        board[6][file] = Piece("b", "p")
        board[7][file] = Piece("b", _BACK_RANK[file])

    return board
