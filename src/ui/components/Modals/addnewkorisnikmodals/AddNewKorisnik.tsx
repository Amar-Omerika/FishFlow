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

interface AddKorisnikModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
}

const AddNewKorisnikModal: React.FC<AddKorisnikModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [korisnikInfo, setKorisnikInfo] = useState({
    imePrezime: "",
    jmbg: "",
    adresaStanovanja: "",
    sekcijaID: "",
  });

  const [errors, setErrors] = useState({
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
    setKorisnikInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      [name]: "",
    }));
  };

  const handleChangeSection = (event: any) => {
    setKorisnikInfo((prevState) => ({
      ...prevState,
      sekcijaID: event.target.value as string,
    }));
  };

  const handleCreate = async () => {
    try {
      const { imePrezime, jmbg, adresaStanovanja, sekcijaID } = korisnikInfo;
      await window.electron.addKorisnici({
        ImePrezime: imePrezime,
        JMBG: jmbg,
        AdresaStanovanja: adresaStanovanja,
        SekcijaID: parseInt(sekcijaID),
      });
      toast.success("Korisnik uspijesno dodan");
      onCreate();
      onClose();
    } catch (error) {
      toast.error("Greska pri dodavanju korisnika");
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
                  Dodaj Korisnika
                </Typography>
                <Box component="form" sx={{ display: "grid", gap: 2 }}>
                  <TextField
                    label="Ime i Prezime"
                    name="imePrezime"
                    value={korisnikInfo.imePrezime}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="JMBG"
                    name="jmbg"
                    value={korisnikInfo.jmbg}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Adresa Stanovanja"
                    name="adresaStanovanja"
                    value={korisnikInfo.adresaStanovanja}
                    onChange={handleChange}
                    fullWidth
                  />
                  <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel id="section-label">Sekcija</InputLabel>
                    <Select
                      labelId="section-label"
                      id="section-select"
                      value={korisnikInfo.sekcijaID}
                      onChange={handleChangeSection as any}
                      label="Sekcija"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {sekcije.map((sekcija) => (
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
    </AnimatePresence>,
    document.getElementById("modal-root")!
  );
};

export default AddNewKorisnikModal;
