import path from "path";
import { app } from "electron";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";

export async function initDatabase() {
  const dbPath = path.join(app.getPath("userData"), "database.sqlite");
  //here we create db file in app.getPath("userData") directory
  //C:\Users[korisnik]\AppData\Roaming[ime-aplikacije]\database.sqlite]

  //path.join(app.getPath("home"), "database.sqlite") would create db file in user home directory
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Sekcije (
      SekcijaID INTEGER PRIMARY KEY AUTOINCREMENT,
      NazivSekcije TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS SekcijeAdrese (
      AdresaID INTEGER PRIMARY KEY AUTOINCREMENT,
      SekcijaID INTEGER NOT NULL,
      Adresa TEXT NOT NULL,
      FOREIGN KEY (SekcijaID) REFERENCES Sekcije(SekcijaID)
    );

    CREATE TABLE IF NOT EXISTS Korisnici (
      KorisnikID INTEGER PRIMARY KEY AUTOINCREMENT,
      ImePrezime TEXT NOT NULL,
      JMBG TEXT NOT NULL,
      AdresaStanovanja TEXT NOT NULL,
      SekcijaID INTEGER NOT NULL,
      FOREIGN KEY (SekcijaID) REFERENCES Sekcije(SekcijaID)
    );

    CREATE TABLE IF NOT EXISTS KorisnikGodine (
      KorisnikGodineID INTEGER PRIMARY KEY AUTOINCREMENT,
      Godina INTEGER NOT NULL,
      KorisnikID INTEGER NOT NULL,
      BrojRegistra TEXT NOT NULL,
      KontaktTelefon TEXT NOT NULL,
      IznosKM REAL NOT NULL,
      Status TEXT NOT NULL,
      Napomena TEXT,
      Prijava TEXT,
      FOREIGN KEY (KorisnikID) REFERENCES Korisnici(KorisnikID)
    );
  `);

  return db;
}

export async function fetchAllKorisnici(
  filters: any = {},
  limit: number = 5,
  offset: number = 0
) {
  const db = await initDatabase();
  const { sekcija, imePrezime } = filters;

  let query = `
    SELECT 
      Korisnici.*, 
      Sekcije.NazivSekcije 
    FROM 
      Korisnici 
    JOIN 
      Sekcije 
    ON 
      Korisnici.SekcijaID = Sekcije.SekcijaID
    WHERE 1=1
  `;

  let countQuery = `
    SELECT 
      COUNT(*) as totalCount
    FROM 
      Korisnici 
    JOIN 
      Sekcije 
    ON 
      Korisnici.SekcijaID = Sekcije.SekcijaID
    WHERE 1=1
  `;

  const params: any[] = [];
  const countParams: any[] = [];

  if (sekcija) {
    query += ` AND Sekcije.SekcijaID = ?`;
    countQuery += ` AND Sekcije.SekcijaID = ?`;
    params.push(sekcija);
    countParams.push(sekcija);
  }

  if (imePrezime) {
    query += ` AND Korisnici.ImePrezime LIKE ?`;
    countQuery += ` AND Korisnici.ImePrezime LIKE ?`;
    params.push(`%${imePrezime}%`);
    countParams.push(`%${imePrezime}%`);
  }

  query += ` ORDER BY Korisnici.KorisnikID DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const korisnici = await db.all(query, params);
  const totalCountResult = await db.get(countQuery, countParams);
  const totalCount = totalCountResult.totalCount;

  return { korisnici, totalCount };
}
export async function fetchAllKorisniciWithoutFilters() {
  const db = await initDatabase();

  const query = `
    SELECT 
      Korisnici.*, 
      Sekcije.NazivSekcije 
    FROM 
      Korisnici 
    JOIN 
      Sekcije 
    ON 
      Korisnici.SekcijaID = Sekcije.SekcijaID
  `;

  const korisnici = await db.all(query);
  return korisnici;
}
export async function addKorisnici(
  ImePrezime: string,
  JMBG: string,
  AdresaStanovanja: string,
  SekcijaID: number
) {
  const db = await initDatabase();
  const result = await db.run(
    `INSERT INTO Korisnici (ImePrezime, JMBG, AdresaStanovanja, SekcijaID) VALUES (?, ?, ?, ?)`,
    [ImePrezime, JMBG, AdresaStanovanja, SekcijaID]
  );
  return result.lastID;
}

export async function deleteKorisnik(KorisnikID: number) {
  const db = await initDatabase();
  const result = await db.run(`DELETE FROM Korisnici WHERE KorisnikID = ?`, [
    KorisnikID,
  ]);
  return result.changes;
}

export async function updateKorisnik(
  KorisnikID: number,
  ImePrezime: string,
  JMBG: string,
  AdresaStanovanja: string,
  SekcijaID: number
) {
  const db = await initDatabase();
  const result = await db.run(
    `UPDATE Korisnici SET ImePrezime = ?, JMBG = ?, AdresaStanovanja = ?, SekcijaID = ? WHERE KorisnikID = ?`,
    [ImePrezime, JMBG, AdresaStanovanja, SekcijaID, KorisnikID]
  );
  return result.changes;
}

export async function fetchSekcije() {
  const db = await initDatabase();
  const sekcije = await db.all(`
    SELECT 
      SekcijaID, 
      NazivSekcije 
    FROM 
      Sekcije
  `);
  return sekcije;
}

export async function fetchAllKorisnikGodine(
  filters: any = {},
  limit: number = 5,
  offset: number = 0
) {
  const db = await initDatabase();
  const { sekcija, godina, imePrezime } = filters;

  let query = `
    SELECT 
      Korisnici.ImePrezime, 
      Korisnici.JMBG, 
      Korisnici.AdresaStanovanja, 
      Sekcije.NazivSekcije,
      KorisnikGodine.*
    FROM 
      KorisnikGodine 
    JOIN 
      Korisnici 
    ON 
      KorisnikGodine.KorisnikID = Korisnici.KorisnikID 
    JOIN 
      Sekcije 
    ON 
      Korisnici.SekcijaID = Sekcije.SekcijaID
    WHERE 1=1
  `;

  let countQuery = `
    SELECT 
      COUNT(*) as totalCount
    FROM 
      KorisnikGodine 
    JOIN 
      Korisnici 
    ON 
      KorisnikGodine.KorisnikID = Korisnici.KorisnikID 
    JOIN 
      Sekcije 
    ON 
      Korisnici.SekcijaID = Sekcije.SekcijaID
    WHERE 1=1
  `;

  const params: any[] = [];
  const countParams: any[] = [];

  if (sekcija) {
    query += ` AND Sekcije.NazivSekcije = ?`;
    countQuery += ` AND Sekcije.NazivSekcije = ?`;
    params.push(sekcija);
    countParams.push(sekcija);
  }

  if (godina) {
    query += ` AND KorisnikGodine.Godina = ?`;
    countQuery += ` AND KorisnikGodine.Godina = ?`;
    params.push(godina);
    countParams.push(godina);
  }

  if (imePrezime) {
    query += ` AND Korisnici.ImePrezime LIKE ?`;
    countQuery += ` AND Korisnici.ImePrezime LIKE ?`;
    params.push(`%${imePrezime}%`);
    countParams.push(`%${imePrezime}%`);
  }

  query += ` ORDER BY KorisnikGodine.KorisnikGodineID DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const korisnikGodine = await db.all(query, params);
  const totalCountResult = await db.get(countQuery, countParams);
  const totalCount = totalCountResult.totalCount;

  return { korisnikGodine, totalCount };
}

export async function addKorisnikGodine(
  Godina: number,
  KorisnikID: number,
  BrojRegistra: string,
  KontaktTelefon: string,
  IznosKM: number,
  Status: string,
  Napomena: string,
  Prijava: string
) {
  const db = await initDatabase();
  const result = await db.run(
    `INSERT INTO KorisnikGodine (Godina, KorisnikID, BrojRegistra, KontaktTelefon, IznosKM, Status, Napomena, Prijava) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      Godina,
      KorisnikID,
      BrojRegistra,
      KontaktTelefon,
      IznosKM,
      Status,
      Napomena,
      Prijava,
    ]
  );
  return result.lastID;
}
export async function deleteKorisnikGodine(KorisnikGodineID: number) {
  const db = await initDatabase();
  const result = await db.run(
    `DELETE FROM KorisnikGodine WHERE KorisnikGodineID = ?`,
    [KorisnikGodineID]
  );
  return result.changes;
}
export async function updateKorisnikGodine(
  KorisnikGodineID: number,
  Godina: number,
  KorisnikID: number,
  BrojRegistra: string,
  KontaktTelefon: string,
  IznosKM: number,
  Status: string,
  Napomena: string,
  Prijava: string
) {
  const db = await initDatabase();
  const result = await db.run(
    `UPDATE KorisnikGodine SET Godina = ?, KorisnikID = ?, BrojRegistra = ?, KontaktTelefon = ?, IznosKM = ?, Status = ?, Napomena = ?, Prijava = ? WHERE KorisnikGodineID = ?`,
    [
      Godina,
      KorisnikID,
      BrojRegistra,
      KontaktTelefon,
      IznosKM,
      Status,
      Napomena,
      Prijava,
      KorisnikGodineID,
    ]
  );
  return result.changes;
}

export async function findSekcijaByAddress(address: string) {
  const db = await initDatabase();

  // First try exact match
  let result = await db.get(
    `SELECT SekcijaID FROM SekcijeAdrese WHERE Adresa = ? LIMIT 1`,
    [address]
  );

  if (result) {
    return result.SekcijaID;
  }

  // If no exact match, try partial match (contains)
  result = await db.get(
    `SELECT SekcijaID FROM SekcijeAdrese WHERE ? LIKE '%' || Adresa || '%' LIMIT 1`,
    [address]
  );

  if (result) {
    return result.SekcijaID;
  }

  // If still no match, try if address contains any of the sekcija addresses
  result = await db.get(
    `SELECT SekcijaID FROM SekcijeAdrese WHERE Adresa LIKE ? LIMIT 1`,
    [`%${address}%`]
  );
  // console.log(result);

  return result ? result.SekcijaID : null;
}
