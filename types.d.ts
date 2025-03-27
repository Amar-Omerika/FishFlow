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
  fetchAllKorisniciWithoutFilters: any;
  fetchSekcije: any;
  addKorisnici: any;
  deleteKorisnik: any;
  updateKorisnik: any;
  fetchAllKorisnikGodine: any;
  addKorisnikGodine: any;
  deleteKorisnikGodine: any;
  updateKorisnikGodine: any;
  changeView: View;
  sendFrameAction: FrameWindowAction;
  fetchSekcijeAdrese: any;
  findSekcijaByAddress: number | null;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeStatistics: (
      callback: (statistics: Statistics) => void
    ) => UnsubscribeFunction;
    getStaticData: () => Promise<StaticData>;
    fetchAllKorisnici: (
      filter: any,
      limit: number,
      offset: number
    ) => Promise<any>;
    fetchAllKorisniciWithoutFilters: () => Promise<any>;
    fetchSekcije: () => Promise<any>;
    addKorisnici: (korisnik: NewKorisnikData) => void;
    deleteKorisnik: (KorisnikID: number) => Promise<number>;
    updateKorisnik: (korisnik: NewKorisnikDataUpdate) => Promise<number>;
    fetchAllKorisnikGodine: (
      filters: any,
      limit: number,
      offset: number
    ) => Promise<any>;
    addKorisnikGodine: (korisnikGodine: KorisnikGodinaData) => void;
    deleteKorisnikGodine: (KorisnikGodineID: number) => Promise<number>;
    updateKorisnikGodine: (korisnikGodine: any) => Promise<number>;
    fetchSekcijeAdrese: (sekcijaID?: number) => Promise<any>;
    findSekcijaByAddress: (address: string) => Promise<number | null>;
    subscribeChangeView: (
      callback: (view: View) => void
    ) => UnsubscribeFunction;
    sendFrameAction: (payload: FrameWindowAction) => void;
  };
}
