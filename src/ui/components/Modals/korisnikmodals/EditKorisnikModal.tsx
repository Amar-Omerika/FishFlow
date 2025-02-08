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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface EditKorisnikModalProps {
  isOpen: boolean;
  onClose: () => void;
  korisnikGodine: any;
}

const EditKorisnikGodine: React.FC<EditKorisnikModalProps> = ({
  isOpen,
  onClose,
  korisnikGodine,
}) => {
  const [selectedYear, setSelectedYear] = useState<Dayjs | null>(dayjs());
  const [korisnikGodineInfo, setKorisnikGodineInfo] = useState(korisnikGodine);

  useEffect(() => {
    if (korisnikGodine) {
      setKorisnikGodineInfo(korisnikGodine);
      setSelectedYear(dayjs().year(korisnikGodine.Godina));
    }
  }, [korisnikGodine]);

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
      const data = await window.electron.fetchAllKorisnici();
      setKorisnici(data);
    };
    fetchKorisnici();
  }, []);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKorisnikGodineInfo((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      [name]: "",
    }));
  };

  const handleChangeKorisnik = (event: any) => {
    setKorisnikGodineInfo((prevState: any) => ({
      ...prevState,
      KorisnikID: event.target.value as string,
    }));
  };

  const handleUpdate = async () => {
    try {
      const {
        KorisnikGodineID,
        KorisnikID,
        BrojRegistra,
        KontaktTelefon,
        IznosKM,
        Status,
        Napomena,
        Prijava,
      } = korisnikGodineInfo;
      await window.electron.updateKorisnikGodine({
        KorisnikGodineID,
        Godina: selectedYear?.year() || 0,
        KorisnikID: parseInt(KorisnikID),
        BrojRegistra,
        KontaktTelefon,
        IznosKM: parseFloat(IznosKM),
        Status,
        Napomena,
        Prijava,
      });
      toast.success("Korisnik Godina uspijesno azuriran");
      onClose();
    } catch (error) {
      toast.error("Greska pri azuriranju korisnika godine");
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
                    Uredi Korisnik Godina
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
                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                      <InputLabel id="korisnik-label">Korisnik</InputLabel>
                      <Select
                        labelId="korisnik-label"
                        id="korisnik-select"
                        disabled
                        value={korisnikGodineInfo?.KorisnikID}
                        onChange={handleChangeKorisnik as any}
                        label="Korisnik"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {korisnici &&
                          korisnici.map((korisnik) => (
                            <MenuItem
                              key={korisnik?.KorisnikID}
                              value={korisnik?.KorisnikID}
                            >
                              {korisnik?.ImePrezime}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Broj Registra"
                      name="BrojRegistra"
                      multiline
                      value={korisnikGodineInfo?.BrojRegistra}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Kontakt Telefon"
                      name="KontaktTelefon"
                      value={korisnikGodineInfo?.KontaktTelefon}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Iznos KM"
                      name="IznosKM"
                      value={korisnikGodineInfo?.IznosKM}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Status"
                      name="Status"
                      value={korisnikGodineInfo?.Status}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Napomena"
                      name="Napomena"
                      value={korisnikGodineInfo?.Napomena}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={4}
                    />
                    <TextField
                      label="Prijava"
                      name="Prijava"
                      value={korisnikGodineInfo?.Prijava}
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
                      <Button variant="contained" onClick={handleUpdate}>
                        Azuriraj
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

export default EditKorisnikGodine;
