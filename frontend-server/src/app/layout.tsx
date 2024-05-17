import type { Metadata, Viewport } from "next";
import Snackbar, { SnackProvider } from "@/components/Snackbar";
import ThemeProvider from "@/app/ThemeProvider";
import StoreProvider from "@/app/StoreProvider";
import SessionProvider from "@/app/SessionProvider";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/auth";

export const metadata: Metadata = {
  title: "TYPe",
  description: "",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="it">
      <body
        style={{
          height: "100%",
          width: "100%",
          margin: 0,
          top: 0,
          position: "absolute",
          backgroundColor: "#fbfbfb",
        }}
      >
        <StoreProvider>
          <SessionProvider session={session}>
            <ThemeProvider>
              <Snackbar>
                <SnackProvider />
                {children}
              </Snackbar>
            </ThemeProvider>
          </SessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
