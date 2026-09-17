import type { Color, PieceType } from "../engine/board";

import wK from "../assets/pieces/w-k.png";
import wQ from "../assets/pieces/w-q.png";
import wR from "../assets/pieces/w-r.png";
import wB from "../assets/pieces/w-b.png";
import wN from "../assets/pieces/w-n.png";
import wP from "../assets/pieces/w-p.png";
import bK from "../assets/pieces/b-k.png";
import bQ from "../assets/pieces/b-q.png";
import bR from "../assets/pieces/b-r.png";
import bB from "../assets/pieces/b-b.png";
import bN from "../assets/pieces/b-n.png";
import bP from "../assets/pieces/b-p.png";

const PIECE_IMAGES: Record<Color, Record<PieceType, string>> = {
  w: { k: wK, q: wQ, r: wR, b: wB, n: wN, p: wP },
  b: { k: bK, q: bQ, r: bR, b: bB, n: bN, p: bP },
};

const PIECE_NAMES: Record<PieceType, string> = {
  k: "King",
  q: "Queen",
  r: "Rook",
  b: "Bishop",
  n: "Knight",
  p: "Pawn",
};

export function pieceImageSrc(type: PieceType, color: Color): string {
  return PIECE_IMAGES[color][type];
}

export function pieceAltText(type: PieceType, color: Color): string {
  return `${color === "w" ? "White" : "Black"} ${PIECE_NAMES[type]}`;
}
