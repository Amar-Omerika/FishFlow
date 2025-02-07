import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CustomTable({
  rows = [],
  onEdit,
  onDelete,
}: {
  rows?: Record<string, any>[];
  onEdit: (row: Record<string, any>) => void;
  onDelete: (row: Record<string, any>) => void;
}) {
  const excludedKeys = ["SekcijaID", "KorisnikID", "KorisnikGodineID"];

  const allKeys = Array.from(new Set(rows.flatMap(Object.keys))).filter(
    (key) => !excludedKeys.includes(key)
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {allKeys.map((key) => (
              <StyledTableCell
                key={key}
                align="center"
                style={{ whiteSpace: "nowrap" }}
              >
                {key}
              </StyledTableCell>
            ))}
            <StyledTableCell
              key="actions"
              align="center"
              style={{
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              Uredi / Obrisi
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <StyledTableRow key={rowIndex}>
              {allKeys.map((key) => (
                <StyledTableCell
                  style={{ whiteSpace: "nowrap", textAlign: "center" }}
                  key={key}
                >
                  {row[key] && row[key].length > 20
                    ? `${row[key].slice(0, 20)}...`
                    : row[key] || "-"}
                </StyledTableCell>
              ))}
              <StyledTableCell
                key="actions"
                style={{ whiteSpace: "nowrap", textAlign: "center" }}
              >
                <IconButton aria-label="edit" onClick={() => onEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => onDelete(row)}>
                  <DeleteIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
