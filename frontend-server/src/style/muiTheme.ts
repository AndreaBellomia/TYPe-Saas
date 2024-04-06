import { createTheme, PaletteColor } from "@mui/material/styles";

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    neutral: PaletteColor;
  }

  interface PaletteOptions {
    neutral: PaletteColor;
  }
}

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#7578ff",
      main: "#635bff",
      dark: "#4e36f5",
    },
    secondary: {
      light: "#555e68",
      main: "#32383e",
      dark: "#202427",
    },
    success: {
      light: "#2ed3b8",
      main: "#15b79f",
      dark: "#0e9382",
    },
    info: {
      light: "#10bee8",
      main: "#04aad6",
      dark: "#0787b3",
    },
    warning: {
      light: "#ffbb1f",
      main: "#fb9c0c",
      dark: "#de7101",
    },
    error: {
      light: "#f97970",
      main: "#f04438",
      dark: "#de3024",
    },
    // success: {
    //   light: "",
    //   main: "",
    //   dark: ""
    // },
    neutral: {
      light: "#b3b9c6",
      main: "#434a60",
      dark: "#121621",
      contrastText: "#fff"
    },
    background: {
      paper: "white",
      default: "#fbfcfe",
    },
  },
  shape: {
    borderRadius: 6,
  },

  typography: {
    h1: {
      fontWeight: 600,
      fontSize: "3.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: "3rem",
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: "2.25rem",
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.2,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "1rem",
      lineHeight: 1.57,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: 1.57,
    },
    body1: {
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontWeight: 400,
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "8px 18px",
        },
      },
    },
  },
});

export default theme;
