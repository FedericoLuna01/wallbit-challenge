import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import Image from "next/image";
import Link from "next/link";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Wallbit x Goncy - Challenge",
  description: "Desafío técnico para Wallbit y Goncy. Carrito de compras.",
};

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className}  antialiased grid grid-rows-[auto,1fr,auto] min-h-screen dark`}
      >
        <Toaster />
        <header className="border-b border-b-border py-4">
          <div
            className="max-w-5xl mx-auto px-4 flex items-center justify-between"
          >
            <Link
              href="/"
            >
              <Image src="/wallbit-logo.svg" alt="Wallbit Logo" width={200} height={100} />
            </Link>
            <Image src="/tuki.png" alt="Tuki" width={50} height={20} className="invert" />
          </div>
        </header>
        {children}
        <footer className="border-t border-t-border py-4 text-center">
          Con 🖤 {" "}
          <a
            className="underline text-primary"
            href="https://github.com/FedericoLuna01"
            target="_blank"
          >
            Fede
          </a>.
        </footer>
      </body>
    </html>
  );
}
