import type { Metadata } from "next";
import "../styles/globals.css";
import { bungee, montserrat } from "./fonts";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bungee.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
