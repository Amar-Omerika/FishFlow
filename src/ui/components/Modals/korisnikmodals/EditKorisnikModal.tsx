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
  const [korisnici, setKorisnici] = useState<any[]>([]);

  useEffect(() => {
    if (korisnikGodine) {
      setKorisnikGodineInfo(korisnikGodine);
      setSelectedYear(dayjs().year(korisnikGodine.Godina));
    }
  }, [korisnikGodine]);

  useEffect(() => {
    const fetchKorisnici = async () => {
      const data = await window.electron.fetchAllKorisniciWithoutFilters();
      setKorisnici(data);
    };
    fetchKorisnici();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKorisnikGodineInfo((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await window.electron.updateKorisnikGodine({
        ...korisnikGodineInfo,
        Godina: selectedYear?.year() || 0,
      });
      toast.success("Korisnik Godina uspješno ažuriran");
      onClose();
    } catch (error) {
      toast.error("Greška pri ažuriranju korisnika godine");
    }
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
                style={{ width: "80vw", height: "80vh" }}
              >
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    width: "80vw",
                    height: "80vh",
                    overflow: "auto",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Uredi Korisnik Godina
                  </Typography>
                  <Box component="form" sx={{ display: "grid", gap: 2 }}>
                    <DatePicker
                      views={["year"]}
                      label="Odaberi Godinu"
                      value={selectedYear}
                      onChange={setSelectedYear}
                      slots={{ textField: TextField }}
                      slotProps={{
                        textField: {
                          variant: "outlined",
                        },
                      }}
                    />
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="korisnik-label">Korisnik</InputLabel>
                      <Select
                        labelId="korisnik-label"
                        id="korisnik-select"
                        disabled
                        value={korisnikGodineInfo?.KorisnikID}
                        label="Korisnik"
                      >
                        {korisnici.map((korisnik) => (
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
                      type="number"
                      value={korisnikGodineInfo?.BrojRegistra}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Kontakt Telefon"
                      name="KontaktTelefon"
                      type="number"
                      value={korisnikGodineInfo?.KontaktTelefon}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Iznos KM"
                      name="IznosKM"
                      type="number"
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
                      multiline
                      rows={3}
                    />
                    <TextField
                      label="Napomena"
                      name="Napomena"
                      value={korisnikGodineInfo?.Napomena}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={3}
                    />
                    <TextField
                      label="Prijava"
                      name="Prijava"
                      value={korisnikGodineInfo?.Prijava}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={3}
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
                        Ažuriraj
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
