import { createTheme, PaletteColor } from "@mui/material/styles";

import { palette } from "./palette";
import { typography } from "./typography";

// declare module "@mui/material/styles/createPalette" {
//   interface Palette {
//     neutral: PaletteColor;
//   }

//   interface PaletteOptions {
//     neutral: PaletteColor;
//   }
// }

const theme = createTheme({
  //  @ts-ignore
  palette: palette(),
  shape: {
    borderRadius: 12,
  },

  //  @ts-ignore
  typography: { ...typography },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "8px 18px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
