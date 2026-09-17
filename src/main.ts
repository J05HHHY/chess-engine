import "./style.css";
import { renderBoardGrid } from "./ui/render";

const app = document.querySelector<HTMLDivElement>("#app")!;
renderBoardGrid(app);
