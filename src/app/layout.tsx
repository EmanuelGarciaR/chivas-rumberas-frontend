import type { Metadata } from "next";
import { Space_Grotesk, Libre_Baskerville } from 'next/font/google'
import './globals.css'
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-primary',
})

const libreBaskerville = Libre_Baskerville({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-secondary',
})

export const metadata: Metadata = {
  title: "Chivas Rumberas La 80",
  description: "Reserva tu chiva rumbera para cualquier evento",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${libreBaskerville.variable} h-full antialiased scroll-smooth`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50 font-sans text-zinc-900">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
