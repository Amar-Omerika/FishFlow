import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Paper,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface AddKorisnikModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
}

const AddKorisnikModal: React.FC<AddKorisnikModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [selectedYear, setSelectedYear] = useState<Dayjs | null>(dayjs());
  const [korisnikGodinaInfo, setKorisnikGodinaInfo] = useState({
    KorisnikID: "",
    BrojRegistra: "",
    KontaktTelefon: "",
    IznosKM: "",
    Status: "",
    Napomena: "",
    Prijava: "",
  });

  const [errors, setErrors] = useState({
    KorisnikID: "",
    BrojRegistra: "",
    KontaktTelefon: "",
    IznosKM: "",
    Status: "",
    Napomena: "",
    Prijava: "",
  });

  const [korisnici, setKorisnici] = useState<any[]>([]);

  useEffect(() => {
    const fetchKorisnici = async () => {
      const data = await window.electron.fetchAllKorisniciWithoutFilters();
      setKorisnici(data);
    };
    fetchKorisnici();
  }, []);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKorisnikGodinaInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      [name]: "",
    }));
  };

  const handleChangeKorisnik = (event: any) => {
    setKorisnikGodinaInfo((prevState) => ({
      ...prevState,
      KorisnikID: event.target.value as string,
    }));
  };

  const handleCreate = async () => {
    try {
      const {
        KorisnikID,
        BrojRegistra,
        KontaktTelefon,
        IznosKM,
        Status,
        Napomena,
        Prijava,
      } = korisnikGodinaInfo;
      await window.electron.addKorisnikGodine({
        Godina: selectedYear?.year() || 0,
        KorisnikID: parseInt(KorisnikID),
        BrojRegistra,
        KontaktTelefon,
        IznosKM: parseFloat(IznosKM),
        Status,
        Napomena,
        Prijava,
      });
      toast.success("Korisnik Godina uspijesno dodan");
      setKorisnikGodinaInfo({
        KorisnikID: "",
        BrojRegistra: "",
        KontaktTelefon: "",
        IznosKM: "",
        Status: "",
        Napomena: "",
        Prijava: "",
      });
      onCreate();
      onClose();
    } catch (error) {
      toast.error("Greska pri dodavanju korisnika godine");
    }
  };

  const handleYearChange = (newValue: Dayjs | null) => {
    setSelectedYear(newValue);
  };

  return ReactDOM.createPortal(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AnimatePresence>
        {isOpen && (
          <Modal open={isOpen} onClose={onClose}>
            <motion.div
              style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <Paper sx={{ p: 4, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Dodaj Korisnik Godina
                  </Typography>
                  <Box component="form" sx={{ display: "grid", gap: 2 }}>
                    <DatePicker
                      views={["year"]}
                      label="Odaberi Godinu"
                      value={selectedYear}
                      onChange={handleYearChange}
                      slots={{ textField: TextField }}
                      slotProps={{
                        textField: {
                          variant: "outlined",
                        },
                      }}
                    />
                    <Autocomplete
                      id="korisnik-select"
                      options={korisnici}
                      getOptionLabel={(option) => option.ImePrezime}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Korisnik"
                          variant="outlined"
                        />
                      )}
                      value={
                        korisnici.find(
                          (k) => k.KorisnikID === korisnikGodinaInfo.KorisnikID
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        setKorisnikGodinaInfo((prevState) => ({
                          ...prevState,
                          KorisnikID: newValue ? newValue.KorisnikID : "",
                        }));
                      }}
                      sx={{ minWidth: 200, maxHeight: 300, overflow: "auto" }}
                    />
                    <TextField
                      label="Broj Registra"
                      name="BrojRegistra"
                      type="number"
                      value={korisnikGodinaInfo.BrojRegistra}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Kontakt Telefon"
                      name="KontaktTelefon"
                      type="number"
                      value={korisnikGodinaInfo.KontaktTelefon}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Iznos KM"
                      name="IznosKM"
                      type="number"
                      value={korisnikGodinaInfo.IznosKM}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Status"
                      name="Status"
                      value={korisnikGodinaInfo.Status}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Napomena"
                      name="Napomena"
                      value={korisnikGodinaInfo.Napomena}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={4}
                    />
                    <TextField
                      label="Prijava"
                      name="Prijava"
                      value={korisnikGodinaInfo.Prijava}
                      onChange={handleChange}
                      fullWidth
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 2,
                      }}
                    >
                      <Button onClick={onClose} sx={{ mr: 2 }}>
                        Prekini
                      </Button>
                      <Button variant="contained" onClick={handleCreate}>
                        Dodaj
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </LocalizationProvider>,
    document.getElementById("modal-root")!
  );
};

export default AddKorisnikModal;
