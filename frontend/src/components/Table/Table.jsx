import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

function createData(transaction, origin, value, date) {
  return { transaction, origin, value, date };
}

const rows = [
  createData("Panificadora Alpha", "Débito", "R$100,00", "10/10/2024"),
  createData("Transferência Vitor", "Conta-corrente", "R$200,00", "15/10/2024"),
  createData("Supermercado Beta", "Crédito", "R$350,00", "12/10/2024"),
  createData("Pagamento Energia", "Débito", "R$120,00", "05/10/2024"),
  createData("Depósito PIX", "Conta-salário", "R$2.000,00", "01/10/2024"),
  createData("Farmácia Central", "Débito", "R$80,00", "09/10/2024"),
  createData("Transferência João", "Conta-poupança", "R$500,00", "08/10/2024"),
];

export default function TransactionTable() {
  return (
    <TableContainer
      component={Paper}
      sx={{
        height: "440px",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "none",
      }}
    >
      <Table
        aria-label="transaction table"
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        <TableHead
          sx={{
            background: "#D9E1FF",
            "& .MuiTableCell-root": {
              color: "#000",
            },
          }}
        >
          <TableRow>
            <TableCell align="center">Transação</TableCell>
            <TableCell align="center">Origem</TableCell>
            <TableCell align="center">Valor</TableCell>
            <TableCell align="center">Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                height: "52px",
                backgroundColor:
                  index % 2 === 0 ? "rgba(0, 0, 0, 0.00)" : "#F6F6FF",
                boxShadow: "0px -1px 0px 0px rgba(255, 255, 255, 0.12) inset",
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell align="center">{row.transaction}</TableCell>
              <TableCell align="center">{row.origin}</TableCell>
              <TableCell align="center">{row.value}</TableCell>
              <TableCell align="center">{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
