import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trooka - Conectando Você às Melhores Ofertas",
  description: "Descubra as melhores ofertas e oportunidades na sua região. O Trooka conecta consumidores e lojistas de forma rápida e inteligente.",
  keywords: ["ofertas", "descontos", "compras", "lojistas", "trooka", "promoções", "marketplace"],
  openGraph: {
    title: "Trooka - Conectando Você às Melhores Ofertas",
    description: "Descubra as melhores ofertas e oportunidades na sua região.",
    url: "https://trooka.vercel.app",
    siteName: "Trooka",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trooka - Conectando Você às Melhores Ofertas",
    description: "Descubra as melhores ofertas e oportunidades na sua região.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-black text-[#f5f5f7] min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
