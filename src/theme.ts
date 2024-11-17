import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundSize: "40px 40px",
          backgroundColor: "#efefef",
          backgroundImage: `linear-gradient(to right, #ababab 1px,transparent 1px),
          linear-gradient(to bottom, #ababab 1px, transparent 1px)`,
        },
      },
    },
  },

  palette: {
    mode: "light",
    primary: {
      main: "#5fd06b",
    },
    secondary: {
      main: "#01c5dc",
    },
    success: {
      main: "#008aff",
    },
    background: {
      default: "#fdfdfd",
    },
  },
});

export default theme;
