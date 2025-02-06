import { ChangeEvent, useEffect, useState } from "react";
import {
  Container,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import { styled } from "@mui/system";
import { COLORS } from "../ui/constants/constants";
import CustomTable from "./components/Table";
import { ToastContainer } from "react-toastify";
import AddNewKorisnikModal from "./components/Modals/addnewkorisnikmodals/AddNewKorisnik";

import DeleteModal from "./components/DeleteModal";
import EditNewKorisnikModal from "./components/Modals/addnewkorisnikmodals/EditNewKorisnikModal";

const StyledContainer = styled(Container)({
  padding: "5px",
});

const Users = () => {
  const [data, setData] = useState<any[]>([]);
  const [section, setSection] = useState<string>("");
  const [imePrezime, setImePrezime] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedKorisnik, setSelectedKorisnik] = useState<any>(null);
  const [sekcije, setSekcije] = useState<any[]>([]);

  const fetchKorisnici = async () => {
    const data = await window.electron.fetchAllKorisnici();
    setData(data);
  };

  useEffect(() => {
    fetchKorisnici();
  }, []);

  useEffect(() => {
    const fetchSekcije = async () => {
      const data = await window.electron.fetchSekcije();
      setSekcije(data);
    };
    fetchSekcije();
  }, []);

  const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
    setSection(event.target.value as string);
  };

  const handleAddKorisnikModal = () => {
    setShowAddModal(true);
  };

  const handleEditModalOpen = (korisnik: any) => {
    setSelectedKorisnik(korisnik);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    fetchKorisnici();
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    fetchKorisnici();
  };

  const handleDelete = async () => {
    if (selectedKorisnik) {
      await window.electron.deleteKorisnik(selectedKorisnik.KorisnikID);
      fetchKorisnici();
      setShowDeleteModal(false);
    }
  };

  const handleDeleteModalOpen = (korisnik: any) => {
    setSelectedKorisnik(korisnik);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <StyledContainer>
        <div
          style={{ display: "flex", justifyContent: "end", marginTop: "10px" }}
        >
          <Button
            style={{ backgroundColor: COLORS.primary, color: "#fff" }}
            onClick={handleAddKorisnikModal}
          >
            Dodaj Novog Korisnika
          </Button>
        </div>
        <Container
          maxWidth="xl"
          disableGutters
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Ime Prezime"
            variant="outlined"
            onChange={(e) => setImePrezime(e.target.value)}
          />
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel id="section-label">Sekcija</InputLabel>
            <Select
              labelId="section-label"
              id="section-select"
              value={section}
              onChange={handleChange as any}
              label="Sekcija"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {sekcije.map((sekcija) => (
                <MenuItem key={sekcija.SekcijaID} value={sekcija.SekcijaID}>
                  {sekcija.NazivSekcije}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button style={{ backgroundColor: COLORS.primary, color: "#fff" }}>
            Pretrazi
          </Button>
        </Container>
        <div style={{ height: 20 }} />
        <CustomTable
          rows={data}
          onEdit={handleEditModalOpen}
          onDelete={handleDeleteModalOpen}
        />
      </StyledContainer>
      <AddNewKorisnikModal
        isOpen={showAddModal}
        onClose={handleModalClose}
        onCreate={handleAddKorisnikModal}
      />
      <EditNewKorisnikModal
        isOpen={showEditModal}
        onClose={handleEditModalClose}
        korisnik={selectedKorisnik}
      />
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleDeleteModalClose}
        onDelete={handleDelete}
        title="Obrisi Korisnika"
        content="Da li ste sigurni da zelite obrisati ovoga korisnika?"
      />
      <ToastContainer />
    </>
  );
};

export default Users;
