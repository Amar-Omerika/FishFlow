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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import { styled } from "@mui/system";
import { COLORS } from "../ui/constants/constants";

const StyledContainer = styled(Container)({
  padding: "5px",
});

const Home = () => {
  const [section, setSection] = useState<string>("");
  const [imePrezime, setImePrezime] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<Dayjs | null>(dayjs());

  const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
    setSection(event.target.value as string);
    console.log(section);
  };
  const handleYearChange = (newValue: Dayjs | null) => {
    setSelectedYear(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledContainer>
        <div
          style={{ display: "flex", justifyContent: "end", marginTop: "10px" }}
        >
          <Button style={{ backgroundColor: COLORS.primary, color: "#fff" }}>
            Dodaj Korisnika
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
            renderInput={(params: Dayjs | null) => <TextField {...params} />}
          />
          <Button style={{ backgroundColor: COLORS.primary, color: "#fff" }}>
            Pretrazi
          </Button>
        </Container>
      </StyledContainer>
    </LocalizationProvider>
  );
};

export default Home;
