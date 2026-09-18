"""Runs the TS and Python engines against the same fixture positions and
checks that legal_moves() output matches exactly, move-for-move.

This is the functional-equivalence check between the two engines -- it does
not check either engine against chess rules by itself (that's what each
engine's own test suite, vitest / pytest, is for).

Usage: python scripts/compare-engines.py
"""

import json
import subprocess
import sys
import tempfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
FIXTURES_DIR = REPO_ROOT / "test-positions"
TS_DUMPER = REPO_ROOT / "scripts" / "dump-legal-moves.ts"
PY_DUMPER = REPO_ROOT / "python-engine" / "dump_legal_moves.py"

NPX = "npx.cmd" if sys.platform == "win32" else "npx"


def run_ts_dumper(fixture: Path, out_path: Path) -> None:
    subprocess.run(
        [NPX, "tsx", str(TS_DUMPER), str(fixture), str(out_path)],
        cwd=REPO_ROOT,
        check=True,
    )


def run_py_dumper(fixture: Path, out_path: Path) -> None:
    subprocess.run(
        [sys.executable, str(PY_DUMPER), str(fixture), str(out_path)],
        cwd=PY_DUMPER.parent,
        check=True,
    )


def main() -> int:
    fixtures = sorted(FIXTURES_DIR.glob("*.json"))
    if not fixtures:
        print(f"no fixtures found in {FIXTURES_DIR}")
        return 1

    all_passed = True

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)

        for fixture in fixtures:
            ts_out = tmp_path / f"{fixture.stem}.ts.json"
            py_out = tmp_path / f"{fixture.stem}.py.json"

            run_ts_dumper(fixture, ts_out)
            run_py_dumper(fixture, py_out)

            ts_result = json.loads(ts_out.read_text(encoding="utf-8"))
            py_result = json.loads(py_out.read_text(encoding="utf-8"))

            if ts_result == py_result:
                print(f"PASS  {fixture.name}")
                continue

            all_passed = False
            print(f"FAIL  {fixture.name}")
            for color in ("w", "b"):
                ts_moves, py_moves = set(ts_result[color]), set(py_result[color])
                only_ts = ts_moves - py_moves
                only_py = py_moves - ts_moves
                if only_ts:
                    print(f"  {color}: only in TS     -> {sorted(only_ts)}")
                if only_py:
                    print(f"  {color}: only in Python -> {sorted(only_py)}")

    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())
