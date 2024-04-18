import NavBar from "@/app/admin/components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>

      <NavBar>
        {children}
      </NavBar>
    </>
  );
}
