import { createRoot } from "react-dom/client";
import Universe from "../src/Universe";
const root = createRoot(document.getElementById("app")!);
function render() {
  const route = location.hash.slice(1);
  const mode =
    route === "/demo/" ? "demo" : route === "/docs/" ? "docs" : "home";
  root.render(<Universe key={mode} mode={mode} />);
  scrollTo(0, 0);
}
window.addEventListener("hashchange", render);
render();
