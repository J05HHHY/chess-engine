# Python engine (cross-check twin)

A second, independently-written implementation of the chess engine's rules
layer (board model + move generation), living alongside the TypeScript
engine in `../src/engine/`. It is **not** part of the deployed app --
GitHub Pages only serves the Vite/TS build.

## Why this exists

1. **Correctness oracle.** Two independently-reasoned implementations of
   the same rules that agree on non-trivial output (legal moves, and later
   perft counts) is stronger evidence of correctness than checking one
   implementation against reference numbers alone. See
   `../scripts/compare-engines.py`.
2. **Faster iteration on search/eval**, once move generation is settled --
   a place to prototype alpha-beta move ordering, evaluation weights, or
   self-play tuning experiments before porting proven *ideas* (not code)
   into the TS engine. Python is roughly an order of magnitude slower than
   JIT-compiled JS for this kind of workload, so performance numbers don't
   transfer -- only algorithmic decisions do.

## Structure

Mirrors `src/engine/` by filename and function name, but each function was
reasoned through independently rather than translated line-by-line.

- `board.py` -- `Piece`, `Square`, `Board`, `create_initial_board()`
- `moves.py` -- pseudo-legal + legal move generation, `is_square_attacked`,
  `make_move`/`unmake_move`
- `dump_legal_moves.py` -- CLI used by `../scripts/compare-engines.py` to
  dump legal moves for a fixture position as JSON, for diffing against the
  TS engine's output

## Running tests

    cd python-engine
    .venv\Scripts\python -m pytest      # Windows
    .venv/bin/python -m pytest          # macOS/Linux

## Running the cross-engine equivalence check

From the repo root (needs Node on PATH for the TS side):

    python scripts/compare-engines.py

This runs both engines against the fixture positions in `../test-positions/`
and fails if their legal-move output for either color differs for any
fixture.
