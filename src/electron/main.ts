import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util.js";

app.on("ready", () => {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    //set up dynamic path
    mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"));
  }
});
