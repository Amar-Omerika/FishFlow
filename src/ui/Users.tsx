import { ChangeEvent, useState } from "react";
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
import TableHeadData from "./placeholderData";
import { ToastContainer } from "react-toastify";
import AddNewKorisnikModal from "./components/Modals/addnewkorisnikmodals/AddNewKorisnik";

const StyledContainer = styled(Container)({
  padding: "5px",
});

const Users = () => {
  const [section, setSection] = useState<string>("");
  const [imePrezime, setImePrezime] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
    setSection(event.target.value as string);
  };

  const handleAddKorisnikModal = () => {
    setShowAddModal(true);
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
              <MenuItem value={10}>Stari - Grad</MenuItem>
              <MenuItem value={20}>Fejiceva</MenuItem>
              <MenuItem value={30}>Spanski Logor</MenuItem>
            </Select>
          </FormControl>
          <Button style={{ backgroundColor: COLORS.primary, color: "#fff" }}>
            Pretrazi
          </Button>
        </Container>
        <div style={{ height: 20 }} />
        <CustomTable headerData={TableHeadData} />
      </StyledContainer>
      <AddNewKorisnikModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreate={handleAddKorisnikModal}
      />
      <ToastContainer />
    </>
  );
};

export default Users;
