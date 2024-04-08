import NavBar from "@/app/user/components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar>{children}</NavBar>
    </>
  );
}
