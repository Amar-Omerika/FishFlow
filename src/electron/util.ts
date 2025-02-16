import {
  ipcMain,
  WebContents,
  WebFrameMain,
  IpcMainInvokeEvent,
} from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from "url";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

interface EventPayloadMapping {
  [key: string]: any;
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: Key | any,
  handler: (
    event: IpcMainInvokeEvent,
    ...args: any[]
  ) => EventPayloadMapping[Key]
) {
  ipcMain.handle(key, (event: IpcMainInvokeEvent, ...args: any[]) => {
    if (event.senderFrame) {
      validateEventFrame(event.senderFrame);
    }
    return handler(event, ...args);
  });
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
  key: Key | any,
  handler: (payload: EventPayloadMapping[Key]) => void
) {
  ipcMain.on(key, (event: any, payload) => {
    validateEventFrame(event.senderFrame);
    return handler(payload);
  });
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key | any,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain) {
  if (isDev() && new URL(frame.url).host === "localhost:5123") {
    return;
  }
  const expectedUrl = pathToFileURL(getUIPath()).toString();
  if (!frame.url.startsWith(expectedUrl)) {
    throw new Error("Malicious event");
  }
}
