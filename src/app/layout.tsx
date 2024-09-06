// import type { Metadata } from "next";
import "../styles/globals.css";
import { bungee, montserrat } from "./fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bungee.className} antialiased flex flex-col min-h-screen overflow-hidden`}
      >
        <main className="flex-grow flex flex-col">
          <header className="bg-green-900 text-white p-4">
            <span className="text-center">
              <h1 className="text-4xl mb-2">PokeApi</h1>
              <p className="text-sm">by Laura Musso</p>
            </span>
          </header>
          <div className="flex-1">{children}</div>
        </main>
      </body>
    </html>
  );
}
