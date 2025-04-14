import { app, BrowserWindow } from "electron";
import path from "path";
import { ipcMainHandle, isDev } from "./util.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import { getStaticData, pollResources } from "./resoruceManager.js";
import {
  fetchAllKorisnici,
  addKorisnici,
  deleteKorisnik,
  fetchSekcije,
  updateKorisnik,
  fetchAllKorisnikGodine,
  addKorisnikGodine,
  deleteKorisnikGodine,
  updateKorisnikGodine,
  fetchAllKorisniciWithoutFilters,
  initDatabase,
  findSekcijaByAddress,
  countKorisniciBySekcija,
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
    mainWindow.loadFile(getUIPath());
  }
  pollResources(mainWindow);

  ipcMainHandle("getStaticData", () => {
    return getStaticData();
  });

  ipcMainHandle("fetchAllKorisnici", async (event, filters, limit, offset) => {
    const result = await fetchAllKorisnici(filters, limit, offset);
    return result;
  });
  ipcMainHandle("fetchAllKorisniciWithoutFilters", async () => {
    return await fetchAllKorisniciWithoutFilters();
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

  ipcMainHandle(
    "fetchAllKorisnikGodine",
    async (event, filters, limit, offset) => {
      return await fetchAllKorisnikGodine(filters, limit, offset);
    }
  );

  ipcMainHandle("addKorisnikGodine", async (event, korisnikGodine) => {
    const {
      Godina,
      KorisnikID,
      BrojRegistra,
      KontaktTelefon,
      IznosKM,
      Status,
      Napomena,
      Prijava,
    } = korisnikGodine;
    return await addKorisnikGodine(
      Godina,
      KorisnikID,
      BrojRegistra,
      KontaktTelefon,
      IznosKM,
      Status,
      Napomena,
      Prijava
    );
  });
  ipcMainHandle("deleteKorisnikGodine", async (event, KorisnikGodineID) => {
    return await deleteKorisnikGodine(KorisnikGodineID);
  });
  ipcMainHandle("updateKorisnikGodine", async (event, korisnikGodine) => {
    const {
      KorisnikGodineID,
      Godina,
      KorisnikID,
      BrojRegistra,
      KontaktTelefon,
      IznosKM,
      Status,
      Napomena,
      Prijava,
    } = korisnikGodine;
    return await updateKorisnikGodine(
      KorisnikGodineID,
      Godina,
      KorisnikID,
      BrojRegistra,
      KontaktTelefon,
      IznosKM,
      Status,
      Napomena,
      Prijava
    );
  });
});

ipcMainHandle("findSekcijaByAddress", async (event, address) => {
  return await findSekcijaByAddress(address);
});

// Add this with your other IPC handlers
ipcMainHandle("countKorisniciBySekcija", async (event, SekcijaID) => {
  return await countKorisniciBySekcija(SekcijaID);
});
