import type { Color, PieceType } from "../engine/board";

// Hand-drawn, minimalist flat icons (viewBox 0 0 45 45), original shapes
// inspired by a flat two-tone piece style, not traced from any existing set.
const PIECE_SHAPES: Record<PieceType, string> = {
  p: `
    <circle cx="22.5" cy="11" r="6"/>
    <path d="M22.5 17c-3.5 0-6 2.6-6 6 0 2 1 3.7 2.5 4.8-2.7 1.6-4.5 4.6-4.5 8 0 1 .2 2 .6 2.9-.9.5-1.6 1.5-1.6 2.6 0 1.7 1.4 3.1 3.1 3.1h11.8c1.7 0 3.1-1.4 3.1-3.1 0-1.1-.7-2.1-1.6-2.6.4-.9.6-1.9.6-2.9 0-3.4-1.8-6.4-4.5-8 1.5-1.1 2.5-2.8 2.5-4.8 0-3.4-2.5-6-6-6z"/>
    <path d="M12.5 39h20l1.5 4h-23z"/>
  `,
  r: `
    <rect x="9" y="9" width="5" height="6"/>
    <rect x="16" y="9" width="5" height="6"/>
    <rect x="24" y="9" width="5" height="6"/>
    <rect x="31" y="9" width="5" height="6"/>
    <rect x="9" y="15" width="27" height="4"/>
    <path d="M13 19h19l2 11-3 3v5h-17v-5l-3-3z"/>
    <path d="M11 39h23l1.5 4h-26z"/>
  `,
  n: `
    <path d="M13 39 C12 36 12 33 12 31 C9 30 6 29 5 26 C6 23 9 22 11 21 C11 17 12 13 14 10 C15 8 17 6 18 5 C18 3 20 2 21 3 C22 4 22 5 21 6 C23 7 25 7 27 8 C31 9 34 14 33 20 C33 26 34 32 31 39 Z"/>
    <circle class="piece-eye" cx="15" cy="17" r="1.1"/>
    <path d="M11 39h22l1.5 4h-25z"/>
  `,
  b: `
    <rect x="21" y="2" width="3" height="4" rx="1"/>
    <rect x="19.5" y="3.5" width="6" height="2.2" rx="1"/>
    <circle cx="22.5" cy="10.5" r="3"/>
    <path d="M22.5 14c-4.3 3-7.5 7.4-7.5 12.7 0 2.6 1 4.8 2.6 6.4-1.1.6-1.8 1.7-1.8 3 0 1.5 1.2 2.7 2.7 2.7h8c1.5 0 2.7-1.2 2.7-2.7 0-1.3-.7-2.4-1.8-3 1.6-1.6 2.6-3.8 2.6-6.4 0-5.3-3.2-9.7-7.5-12.7z"/>
    <path class="piece-line" d="M17.5 32.5c1.6.9 3.3 1.4 5 1.4s3.4-.5 5-1.4"/>
    <path d="M14.5 39h16l1.5 4h-19z"/>
  `,
  q: `
    <circle cx="22.5" cy="5.5" r="2.2"/>
    <circle cx="11.5" cy="9.5" r="2"/>
    <circle cx="33.5" cy="9.5" r="2"/>
    <circle cx="17" cy="7" r="1.8"/>
    <circle cx="28" cy="7" r="1.8"/>
    <path d="M11.5 9.5l1.8 10h18.4l1.8-10-6.2 4.3-4.8-7.3-4.8 7.3z"/>
    <path d="M14 20c-1.7 2.2-2.3 4.6-1.2 7.7.6 1.7 1.7 2.9 1.7 4.5 0 1.1-.5 2.1-1.2 2.8h18.4c-.7-.7-1.2-1.7-1.2-2.8 0-1.6 1.1-2.8 1.7-4.5 1.1-3.1.5-5.5-1.2-7.7z"/>
    <path d="M12.5 34.5h20l1.5 4h-23z"/>
  `,
  k: `
    <rect x="21" y="2" width="3" height="7" rx="1"/>
    <rect x="18.5" y="4.5" width="8" height="3" rx="1"/>
    <path d="M22.5 11c-3.5 0-6.2 2.6-6.2 6 0 2 1 3.7 2.5 4.7-2.9 1.5-4.8 4.4-4.8 7.7 0 1 .2 2 .6 2.9-.9.5-1.6 1.5-1.6 2.6 0 1.7 1.4 3.1 3.1 3.1h11.8c1.7 0 3.1-1.4 3.1-3.1 0-1.1-.6-2.1-1.6-2.6.4-.9.6-1.9.6-2.9 0-3.3-1.9-6.2-4.8-7.7 1.5-1 2.5-2.7 2.5-4.7 0-3.4-2.7-6-6.2-6z"/>
    <path d="M12.5 39h20l1.5 4h-23z"/>
  `,
};

export function pieceIconMarkup(type: PieceType, color: Color): string {
  return `<svg viewBox="0 0 45 45" class="piece piece-${color}">${PIECE_SHAPES[type]}</svg>`;
}
