import { app, BrowserWindow } from "electron";
import path from "path";
import { ipcMainHandle, isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { getStaticData, pollResources } from "./resoruceManager.js";
import {
  fetchAllKorisnici,
  addKorisnici,
  deleteKorisnik,
  fetchSekcije,
  updateKorisnik,
  fetchAllKorisnikGodine,
  initDatabase,
} from "./database.js";

app.on("ready", async () => {
  const db = await initDatabase();
  let mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"));
  }

  pollResources(mainWindow);

  ipcMainHandle("getStaticData", () => {
    return getStaticData();
  });

  ipcMainHandle("fetchAllKorisnici", async () => {
    return await fetchAllKorisnici();
  });

  ipcMainHandle("fetchSekcije", async () => {
    return await fetchSekcije();
  });

  ipcMainHandle("addKorisnici", async (event, korisnik) => {
    const { ImePrezime, JMBG, AdresaStanovanja, SekcijaID } = korisnik;
    return await addKorisnici(ImePrezime, JMBG, AdresaStanovanja, SekcijaID);
  });

  ipcMainHandle("deleteKorisnik", async (event, KorisnikID) => {
    return await deleteKorisnik(KorisnikID);
  });

  ipcMainHandle("updateKorisnik", async (event, korisnik) => {
    const { KorisnikID, ImePrezime, JMBG, AdresaStanovanja, SekcijaID } =
      korisnik;
    return await updateKorisnik(
      KorisnikID,
      ImePrezime,
      JMBG,
      AdresaStanovanja,
      SekcijaID
    );
  });

  ipcMainHandle("fetchAllKorisnikGodine", async () => {
    return await fetchAllKorisnikGodine();
  });
});
