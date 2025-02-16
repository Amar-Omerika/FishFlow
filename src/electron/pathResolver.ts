import path from "path";
import { app } from "electron";

export function getUIPath() {
  return path.join(app.getAppPath(), "dist-react", "index.html");
}

export function getPreloadPath() {
  return path.join(app.getAppPath(), "dist-electron", "preload.cjs");
}
