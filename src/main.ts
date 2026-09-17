import "./style.css";
import { createInitialBoard } from "./engine/board";
import { renderBoardGrid } from "./ui/render";

const app = document.querySelector<HTMLDivElement>("#app")!;
renderBoardGrid(app, createInitialBoard());
