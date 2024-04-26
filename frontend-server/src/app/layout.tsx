import type { Metadata } from "next";
import Snackbar, { SnackProvider } from "@/components/Snackbar";
import ThemeProvider from '@/app/ThemeProvider';
import StoreProvider from "@/app/StoreProvider";
import UserProvider from "@/app/UserProvider"

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export const metadata: Metadata = {
  title: "CRM",
  description: "Ticket CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        style={{
          height: "100%",
          width: "100%",
          margin: 0,
          top: 0,
          position: "absolute",
          backgroundColor: "#fbfbfb"
        }}
      >
        <StoreProvider>
          <UserProvider>
            <ThemeProvider>
              <Snackbar>
                <SnackProvider />
                {children}
              </Snackbar>
            </ThemeProvider>
          </UserProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
