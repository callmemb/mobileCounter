import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundPosition: "center",
          // backgroundSize: "40px 40px",
          backgroundColor: "#efefef",
          backgroundImage: `linear-gradient(to right top, #ddf,transparent)`,
          "*": {
            "&::-webkit-scrollbar": {
              width: ".3rem",
            },
            "&::-webkit-scrollbar-track": {
              background: "#dfefdf",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#8c8",
              borderRadius: "2px",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            background: "#ddd",
          },
        },
        outlined: {
          backgroundColor: "#fff",
          "&:hover": {
            backgroundColor: "#fff",
          },
        },
        text: {
          backgroundColor: "#fff",
          "&:hover": {
            backgroundColor: "#fff",
          },
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
