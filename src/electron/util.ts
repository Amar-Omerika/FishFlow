import { ipcMain, WebContents, WebFrameMain } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from "url";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

interface EventPayloadMapping {
  [key: string]: any;
}
export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: any,
  handler: () => EventPayloadMapping[Key]
) {
  ipcMain.handle(key, (event: any) => {
    validateEventFrame(event.senderFrame);
    return handler();
  });
}
export function ipcMainOn<Key extends keyof EventPayloadMapping>(
  key: any,
  handler: (payload: EventPayloadMapping[Key]) => void
) {
  ipcMain.on(key, (event: any, payload) => {
    validateEventFrame(event.senderFrame);
    return handler(payload);
  });
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: any,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain) {
  if (isDev() && new URL(frame.url).host === "localhost:5123") {
    return;
  }
  if (frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error("Malicious event");
  }
}
