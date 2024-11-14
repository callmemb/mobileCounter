import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// A custom theme for this app
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#5fd06b',
    },
    secondary: {
      main: '#01c5dc',
    },
    success: {
      main: '#008aff',
    },
    background: {
      default: '#fdfdfd',
    },
  
  },
});


export default theme;
