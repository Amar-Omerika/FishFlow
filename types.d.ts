type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageUsage: number;
};

type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
};
type NewKorisnikData = {
  ImePrezime: string;
  JMBG: string;
  AdresaStanovanja: string;
  SekcijaID: number;
};
type NewKorisnikDataUpdate = {
  KorisnikID: number;
  ImePrezime: string;
  JMBG: string;
  AdresaStanovanja: string;
  SekcijaID: number;
};

type KorisnikGodinaData = {
  Godina: number;
  KorisnikID: number;
  BrojRegistra: string;
  KontaktTelefon: string;
  IznosKM: number;
  Status: string;
  Napomena: string;
  Prijava: string;
};

type View = "CPU" | "RAM" | "STORAGE";

type FrameWindowAction = "CLOSE" | "MAXIMIZE" | "MINIMIZE";

type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
  fetchAllKorisnici: any;
  fetchSekcije: any;
  addKorisnici: any;
  deleteKorisnik: any;
  updateKorisnik: any;
  fetchAllKorisnikGodine: any;
  addKorisnikGodine: any;
  changeView: View;
  sendFrameAction: FrameWindowAction;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeStatistics: (
      callback: (statistics: Statistics) => void
    ) => UnsubscribeFunction;
    getStaticData: () => Promise<StaticData>;
    fetchAllKorisnici: () => Promise<any>;
    fetchSekcije: () => Promise<any>;
    addKorisnici: (korisnik: NewKorisnikData) => void;
    deleteKorisnik: (KorisnikID: number) => Promise<number>;
    updateKorisnik: (korisnik: NewKorisnikDataUpdate) => Promise<number>;
    fetchAllKorisnikGodine: () => Promise<any>;
    addKorisnikGodine: (korisnikGodine: KorisnikGodinaData) => void;
    subscribeChangeView: (
      callback: (view: View) => void
    ) => UnsubscribeFunction;
    sendFrameAction: (payload: FrameWindowAction) => void;
  };
}
