import React, { useState, useEffect, useRef } from "react";
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

  const [_, setErrors] = useState({
    imePrezime: "",
    jmbg: "",
    adresaStanovanja: "",
    sekcijaID: "",
  });
  const addressDebounceRef = useRef<any | null>(null);
  const [sekcije, setSekcije] = useState<any[]>([]);

  useEffect(() => {
    const fetchSekcije = async () => {
      const data = await window.electron.fetchSekcije();
      setSekcije(data);
    };
    fetchSekcije();
  }, []);

  if (!isOpen) return null;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKorisnikInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      [name]: "",
    }));

    // If address field changes, debounce the section lookup
    if (name === "adresaStanovanja" && value) {
      // Clear any existing timeout
      if (addressDebounceRef.current) {
        clearTimeout(addressDebounceRef.current);
      }

      // Set a new timeout (300ms delay before searching)
      addressDebounceRef.current = setTimeout(async () => {
        try {
          const matchedSekcijaID = await window.electron.findSekcijaByAddress(
            value
          );
          if (matchedSekcijaID) {
            setKorisnikInfo((prevState) => ({
              ...prevState,
              sekcijaID: matchedSekcijaID.toString(),
            }));
          }
        } catch (error) {
          console.error("Error finding section for address:", error);
        }
      }, 300); // 300ms debounce delay
    }
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
      setKorisnikInfo({
        imePrezime: "",
        jmbg: "",
        adresaStanovanja: "",
        sekcijaID: "",
      });
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
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 2,
                  width: "50vw",
                  height: "50vh",
                  overflow: "auto",
                }}
              >
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
                    type="number"
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
                    multiline
                    maxRows={3}
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
