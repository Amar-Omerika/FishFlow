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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import { styled } from "@mui/system";
import { COLORS } from "../ui/constants/constants";
import CustomTable from "./components/Table";
import AddKorisnikModal from "./components/Modals/korisnikmodals/AddKorisnikModal";
import DeleteModal from "./components/DeleteModal";
import { ToastContainer } from "react-toastify";
import EditKorisnikGodine from "./components/Modals/korisnikmodals/EditKorisnikModal";

const StyledContainer = styled(Container)({
  padding: "5px",
});

const Home = () => {
  const [data, setData] = useState<any[]>([]);
  const [section, setSection] = useState<string>("");
  const [imePrezime, setImePrezime] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<Dayjs | null>(dayjs());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddKorisnikGodinaModal, setShowAddKorisnikGodinaModal] =
    useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedKorisnikGodine, setSelectedKorisnikGodine] =
    useState<any>(null);

  const fetchKorisnikGodine = async () => {
    const data = await window.electron.fetchAllKorisnikGodine();
    setData(data);
  };

  useEffect(() => {
    fetchKorisnikGodine();
  }, []);

  const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
    setSection(event.target.value as string);
  };
  const handleYearChange = (newValue: Dayjs | null) => {
    setSelectedYear(newValue);
  };
  const handleAddKorisnikModal = () => {
    setShowAddModal(true);
  };
  const handleAddKorisnikGodinaModal = () => {
    setShowAddKorisnikGodinaModal(true);
  };
  const handleModalClose = () => {
    setShowAddModal(false);
    setShowAddKorisnikGodinaModal(false);
    setShowEditModal(false);
    fetchKorisnikGodine();
  };

  const handleEditModalOpen = (korisnikGodine: any) => {
    setSelectedKorisnikGodine(korisnikGodine);
    setShowEditModal(true);
  };

  const handleDeleteModalOpen = (korisnikGodine: any) => {
    setSelectedKorisnikGodine(korisnikGodine);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (selectedKorisnikGodine) {
      await window.electron.deleteKorisnikGodine(
        selectedKorisnikGodine.KorisnikGodineID
      );
      fetchKorisnikGodine();
      setShowDeleteModal(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledContainer>
        <div
          style={{ display: "flex", justifyContent: "end", marginTop: "10px" }}
        >
          <Button
            style={{
              backgroundColor: COLORS.primary,
              color: "#fff",
              marginLeft: "10px",
            }}
            onClick={handleAddKorisnikGodinaModal}
          >
            Dodaj Korisnik Godina
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
              <MenuItem value={10}>Stari - Grad</MenuItem>
              <MenuItem value={20}>Fejiceva</MenuItem>
              <MenuItem value={30}>Spanski Logor</MenuItem>
            </Select>
          </FormControl>
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
      <AddKorisnikModal
        isOpen={showAddKorisnikGodinaModal}
        onClose={handleModalClose}
        onCreate={fetchKorisnikGodine}
      />
      <EditKorisnikGodine
        isOpen={showEditModal}
        onClose={handleModalClose}
        korisnikGodine={selectedKorisnikGodine}
      />
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleDeleteModalClose}
        onDelete={handleDelete}
        title="Obrisi Korisnik Godina"
        content="Da li ste sigurni da zelite obrisati ovoga korisnika godine?"
      />
      <ToastContainer />
    </LocalizationProvider>
  );
};

export default Home;
