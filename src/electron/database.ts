import path from "path";
import { app } from "electron";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Inicijalizacija SQLite baze
export async function initDatabase() {
  const db = await open({
    filename: path.join(app.getPath("home"), "database.sqlite"),
    driver: sqlite3.Database,
  });

  // Kreiranje tabela
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Sekcije (
      SekcijaID INTEGER PRIMARY KEY AUTOINCREMENT,
      NazivSekcije TEXT NOT NULL
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

export async function fetchAllKorisnici() {
  const db = await initDatabase();
  const korisnici = await db.all(`
    SELECT 
      Korisnici.*, 
      Sekcije.NazivSekcije 
    FROM 
      Korisnici 
    JOIN 
      Sekcije 
    ON 
      Korisnici.SekcijaID = Sekcije.SekcijaID
  `);
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

//korisnik godine data
export async function fetchAllKorisnikGodine() {
  const db = await initDatabase();
  const korisnikGodine = await db.all(`
    SELECT 
      KorisnikGodine.*, 
      Korisnici.ImePrezime, 
      Korisnici.JMBG, 
      Korisnici.AdresaStanovanja, 
      Sekcije.NazivSekcije 
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
  `);
  return korisnikGodine;
}
