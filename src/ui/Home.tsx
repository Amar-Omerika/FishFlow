import React, { ChangeEvent, useState } from "react";
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

const StyledContainer = styled(Container)({
  padding: "5px",
});

const Home = () => {
  const [section, setSection] = useState<string>("");

  const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
    setSection(event.target.value as string);
  };
  return (
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
          marginTop: "10px",
        }}
      >
        <TextField id="outlined-basic" label="Ime Prezime" variant="outlined" />
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel id="section-label">Sekcija</InputLabel>
          <Select
            labelId="section-label"
            id="section-select"
            value={section}
            onChange={() => handleChange}
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
      </Container>
    </StyledContainer>
  );
};

export default Home;
