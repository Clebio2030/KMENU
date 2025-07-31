import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      // default: "#232129",
      // paper: "#312e38",
    },
    primary: {
      main: "rgba(57, 86, 255, 1)",
    },
    secondary: {
      main: "#999591",
    },
    error: {
      main: "#ff002e",
    },
    text: {
      // primary: "rgb(255, 255, 255)",
      secondary: "#3e3b47",
    },
    customColors: {
      black: "rgba(0, 3, 58, 1)", // black
      blueTable: "rgba(217, 225, 255, 1)",
      blueTable2: "rgba(255, 255, 255, 1)",
    },
  },
});

export default theme;
