"""CLI used by ../scripts/compare-engines.py to dump legal moves for a fixture
position as JSON, in a format directly comparable to the TS dumper's output.

Usage: python dump_legal_moves.py <fixture.json> <out.json>
"""

import json
import sys

from board import Board, Piece
from moves import Move, legal_moves


def load_board(path: str) -> Board:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    board: Board = []
    for row in data["board"]:
        board.append([None if cell is None else Piece(cell["color"], cell["type"]) for cell in row])
    return board


def sort_moves(moves: list[Move]) -> list[str]:
    return sorted(f"{m.frm.rank},{m.frm.file}->{m.to.rank},{m.to.file}" for m in moves)


def main() -> None:
    fixture_path, out_path = sys.argv[1], sys.argv[2]
    board = load_board(fixture_path)

    result = {
        "w": sort_moves(legal_moves(board, "w")),
        "b": sort_moves(legal_moves(board, "b")),
    }

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)


if __name__ == "__main__":
    main()
