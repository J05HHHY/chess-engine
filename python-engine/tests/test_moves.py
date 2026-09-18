from board import Board, Piece, Square
from moves import is_square_attacked, legal_moves_from


def empty_board() -> Board:
    return [[None] * 8 for _ in range(8)]


def place(board: Board, square: Square, piece: Piece) -> None:
    board[square.rank][square.file] = piece


def test_rook_attacks_along_open_file():
    board = empty_board()
    place(board, Square(0, 4), Piece("b", "r"))

    assert is_square_attacked(board, Square(7, 4), "b") is True


def test_rook_attack_blocked_by_intervening_piece():
    board = empty_board()
    place(board, Square(0, 4), Piece("b", "r"))
    place(board, Square(3, 4), Piece("w", "p"))

    assert is_square_attacked(board, Square(7, 4), "b") is False


def test_pawn_attacks_diagonally_forward_only():
    board = empty_board()
    place(board, Square(3, 3), Piece("w", "p"))

    assert is_square_attacked(board, Square(4, 4), "w") is True
    assert is_square_attacked(board, Square(4, 3), "w") is False


def test_pinned_rook_can_only_move_along_pin_line():
    board = empty_board()
    place(board, Square(0, 4), Piece("w", "k"))  # e1
    place(board, Square(1, 4), Piece("w", "r"))  # e2, pinned
    place(board, Square(7, 4), Piece("b", "r"))  # e8, pinning

    legal = legal_moves_from(board, Square(1, 4))

    assert len(legal) > 0
    assert all(move.to.file == 4 for move in legal)


def test_king_cannot_move_into_attacked_square():
    board = empty_board()
    place(board, Square(0, 4), Piece("w", "k"))  # e1
    place(board, Square(7, 3), Piece("b", "r"))  # d8, covers the d-file

    legal = legal_moves_from(board, Square(0, 4))

    assert not any(move.to.file == 3 for move in legal)  # d1 is attacked
    assert any(move.to.file == 5 for move in legal)  # f1 is safe


def test_check_ignoring_move_is_illegal():
    board = empty_board()
    place(board, Square(0, 4), Piece("w", "k"))  # e1, in check
    place(board, Square(7, 4), Piece("b", "r"))  # e8, giving check
    place(board, Square(0, 0), Piece("w", "r"))  # a1, can't reach the e-file

    assert legal_moves_from(board, Square(0, 0)) == []

    king_moves = legal_moves_from(board, Square(0, 4))
    assert len(king_moves) > 0
    assert all(move.to.file != 4 for move in king_moves)
