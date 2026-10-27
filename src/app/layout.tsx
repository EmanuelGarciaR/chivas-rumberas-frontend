import type { Metadata } from "next";
import type { ReactNode } from 'react'
import { Space_Grotesk, Libre_Baskerville } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

const libreBaskerville = Libre_Baskerville({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-libre-baskerville',
})

export const metadata: Metadata = {
  title: "Chivas Rumberas La 80",
  description: "Reserva tu chiva rumbera para cualquier evento",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${libreBaskerville.variable} h-full antialiased scroll-smooth`}
    >
      <body className="flex min-h-full flex-col bg-primary font-primary text-txt-primary">
        {children}
      </body>
    </html>
  );
}
