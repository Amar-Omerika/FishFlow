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

interface EditNewKorisnikModalProps {
  isOpen: boolean;
  onClose: () => void;
  korisnik: any;
}

const EditNewKorisnikModal: React.FC<EditNewKorisnikModalProps> = ({
  isOpen,
  onClose,
  korisnik,
}) => {
  const [korisnikInfo, setKorisnikInfo] = useState(korisnik);

  useEffect(() => {
    if (korisnik) {
      setKorisnikInfo(korisnik);
    }
  }, [korisnik]);

  const [_, setErrors] = useState({
    imePrezime: "",
    jmbg: "",
    adresaStanovanja: "",
    sekcijaID: "",
  });

  const [sekcije, setSekcije] = useState<any[]>([]);

  useEffect(() => {
    const fetchSekcije = async () => {
      const data = await window.electron.fetchSekcije();
      setSekcije(data);
    };
    fetchSekcije();
  }, []);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKorisnikInfo((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      [name]: "",
    }));
  };

  const handleChangeSection = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const selectedValue = event.target.value as string;
    setKorisnikInfo((prevState: any) => ({
      ...prevState,
      SekcijaID: selectedValue,
    }));
  };

  const handleUpdate = async () => {
    try {
      const { KorisnikID, ImePrezime, JMBG, AdresaStanovanja, SekcijaID } =
        korisnikInfo;
      await window.electron.updateKorisnik({
        KorisnikID,
        ImePrezime,
        JMBG,
        AdresaStanovanja,
        SekcijaID: parseInt(SekcijaID),
      });
      toast.success("Korisnik uspijesno azuriran");
      onClose();
    } catch (error) {
      toast.error("Greska pri azuriranju korisnika");
    }
  };

  return ReactDOM.createPortal(
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
                  Uredi Korisnika
                </Typography>
                <Box component="form" sx={{ display: "grid", gap: 2 }}>
                  <TextField
                    label="Ime i Prezime"
                    name="ImePrezime"
                    value={korisnikInfo?.ImePrezime || ""}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="JMBG"
                    name="JMBG"
                    type="number"
                    value={korisnikInfo?.JMBG || ""}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Adresa Stanovanja"
                    name="AdresaStanovanja"
                    value={korisnikInfo?.AdresaStanovanja || ""}
                    onChange={handleChange}
                    fullWidth
                  />
                  <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel id="section-label">Sekcija</InputLabel>
                    <Select
                      labelId="section-label"
                      id="section-select"
                      value={korisnikInfo?.SekcijaID || ""}
                      onChange={handleChangeSection as any}
                      label="Sekcija"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {sekcije &&
                        sekcije.map((sekcija) => (
                          <MenuItem
                            key={sekcija.SekcijaID}
                            value={sekcija.SekcijaID}
                          >
                            {sekcija.NazivSekcije}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

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
    </AnimatePresence>,
    document.getElementById("modal-root")!
  );
};

export default EditNewKorisnikModal;
