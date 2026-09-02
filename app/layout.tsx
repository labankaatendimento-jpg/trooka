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
  description: "Descubra as melhores ofertas e oportunidades na sua região. Compre e venda iPhones com segurança.",
  keywords: ["ofertas", "descontos", "compras", "lojistas", "trooka", "promoções", "marketplace", "iphone"],
  openGraph: {
    title: "Trooka - Troca e Compra de iPhones",
    description: "Simule agora a troca do seu iPhone por um mais novo! Descubra ofertas incríveis e conecte-se com os melhores lojistas da região.",
    url: "https://trooka.vercel.app",
    siteName: "Trooka",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trooka - Troca e Compra de iPhones",
    description: "Simule a troca do seu iPhone e encontre lojistas perto de você.",
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
