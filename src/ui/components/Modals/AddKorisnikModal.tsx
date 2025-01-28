// cSpell:words brojRegistra imePrezime adresaStanovanja kontaktTelefon sekcija jmbg iznos km napomena prijava uspijesno dodan dodavanju korisnika greska dodavanje korisnik korisniku korisnikom
import React, { useState } from "react";
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
} from "@mui/material";

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
  const [korisnikInfo, setKorisnikInfo] = useState({
    brojRegistra: "",
    imePrezime: "",
    iznosKM: "",
    adresaStanovanja: "",
    kontaktTelefon: "",
    jmbg: "",
    sekcija: "",
    status: "",
    napomena: "",
    prijava: "",
  });

  const [errors, setErrors] = useState({
    brojRegistra: "",
    imePrezime: "",
    iznosKM: "",
    adresaStanovanja: "",
    kontaktTelefon: "",
    jmbg: "",
    sekcija: "",
    status: "",
    napomena: "",
    prijava: "",
  });

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

  const handleCreate = async () => {
    try {
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
                    label="Broj Registra"
                    name="brojRegistra"
                    value={korisnikInfo.brojRegistra}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Ime Prezime"
                    name="imePrezime"
                    value={korisnikInfo.imePrezime}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Iznos KM"
                    name="iznosKM"
                    value={korisnikInfo.iznosKM}
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
                  <TextField
                    label="Kontakt Telefon"
                    name="kontaktTelefon"
                    value={korisnikInfo.kontaktTelefon}
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
                    label="Sekcija"
                    name="sekcija"
                    value={korisnikInfo.sekcija}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Status"
                    name="status"
                    value={korisnikInfo.status}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Napomena"
                    name="napomena"
                    value={korisnikInfo.napomena}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                  />
                  <TextField
                    label="Prijava"
                    name="prijava"
                    value={korisnikInfo.prijava}
                    onChange={handleChange}
                    fullWidth
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
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

export default AddKorisnikModal;
