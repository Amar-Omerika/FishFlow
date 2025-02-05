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
