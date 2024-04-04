"use client";
import { ThemeProvider } from '@mui/material/styles';

import theme from "@/style/muiTheme"

export default function CustomThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
