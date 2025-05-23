const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStatistics: (callback: any) =>
    ipcOn("statistics", (stats) => {
      callback(stats);
    }),
  subscribeChangeView: (callback: any) =>
    ipcOn("changeView", (view) => {
      callback(view);
    }),
  getStaticData: () => ipcInvoke("getStaticData"),
  fetchAllKorisnici: (filters: any, limit: number, offset: number) =>
    ipcInvoke("fetchAllKorisnici", filters, limit, offset),
  fetchAllKorisniciWithoutFilters: () =>
    ipcInvoke("fetchAllKorisniciWithoutFilters"),
  addKorisnici: (korisnik: any) => ipcInvoke("addKorisnici", korisnik),
  deleteKorisnik: (KorisnikID: number) =>
    ipcInvoke("deleteKorisnik", KorisnikID),
  updateKorisnik: (korisnik: any) => ipcInvoke("updateKorisnik", korisnik),
  fetchSekcije: () => ipcInvoke("fetchSekcije"),
  fetchAllKorisnikGodine: (filters: any, limit: number, offset: number) =>
    ipcInvoke("fetchAllKorisnikGodine", filters, limit, offset),
  addKorisnikGodine: (korisnikGodine: any) =>
    ipcInvoke("addKorisnikGodine", korisnikGodine),
  deleteKorisnikGodine: (KorisnikGodineID: number) =>
    ipcInvoke("deleteKorisnikGodine", KorisnikGodineID),
  updateKorisnikGodine: (korisnikGodine: any) =>
    ipcInvoke("updateKorisnikGodine", korisnikGodine),
  sendFrameAction: (payload: any) => ipcSend("sendFrameAction", payload),
  findSekcijaByAddress: (address: string) =>
    ipcInvoke("findSekcijaByAddress", address),
  // Add this to the electron object
  countKorisniciBySekcija: (SekcijaID: number | string) =>
    ipcInvoke("countKorisniciBySekcija", SekcijaID),
} satisfies Window["electron"]);

//ipcInvoke: This method sends an asynchronous message from the renderer process to
// the main process and expects a response. It returns a promise that resolves with the
//  result from the main process. It's useful when you need to perform an action and wait
//  for a result

function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key,
  ...args: any[]
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key, ...args);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

//ipcSend: This method sends an asynchronous message from the renderer process
//to the main process. It does not expect a response. It's useful for fire-and-forget
//scenarios where you don't need to wait for a result.
function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  electron.ipcRenderer.send(key, payload);
}
