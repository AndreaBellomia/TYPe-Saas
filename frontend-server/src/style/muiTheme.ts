import { createTheme, PaletteColor } from "@mui/material/styles";

import { palette } from "./palette"
import { typography } from "./typography"

// declare module "@mui/material/styles/createPalette" {
//   interface Palette {
//     neutral: PaletteColor;
//   }

//   interface PaletteOptions {
//     neutral: PaletteColor;
//   }
// }

const theme = createTheme({
  // palette: {
  //   mode: "light",
  //   primary: {
  //     light: "#7578ff",
  //     main: "#635bff",
  //     dark: "#4e36f5",
  //   },
  //   secondary: {
  //     light: "#555e68",
  //     main: "#32383e",
  //     dark: "#202427",
  //   },
  //   // success: {
  //   //   light: "#2ed3b8",
  //   //   main: "#15b79f",
  //   //   dark: "#0e9382",
  //   // },
  //   // info: {
  //   //   light: "#10bee8",
  //   //   main: "#04aad6",
  //   //   dark: "#0787b3",
  //   // },
  //   // warning: {
  //   //   light: "#ffbb1f",
  //   //   main: "#fb9c0c",
  //   //   dark: "#de7101",
  //   // },
  //   // error: {
  //   //   light: "#f97970",
  //   //   main: "#f04438",
  //   //   dark: "#de3024",
  //   // },
  //   // success: {
  //   //   light: "",
  //   //   main: "",
  //   //   dark: ""
  //   // },
  //   neutral: {
  //     light: "#b3b9c6",
  //     main: "#434a60",
  //     dark: "#121621",
  //     contrastText: "#fff"
  //   },
  //   background: {
  //     paper: "white",
  //     default: "#fbfcfe",
  //   },
  // },

  palette: palette(),
  shape: {
    borderRadius: 12,
  },

  typography: {...typography},

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
