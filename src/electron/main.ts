import { app, BrowserWindow } from "electron";
import path from "path";
import { ipcMainHandle, isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { getStaticData, pollResources } from "./resoruceManager.js";

app.on("ready", () => {
  let mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      //this is the correct approach
      preload: getPreloadPath(),
      //this is not good in terms of security reasons, because we can access node.js from the browser window
      // nodeIntegration: true,
    },
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    //set up dynamic path
    mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"));
  }

  pollResources(mainWindow);

  ipcMainHandle("getStaticData", () => {
    return getStaticData();
  });
});
