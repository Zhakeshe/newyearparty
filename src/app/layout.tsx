import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ weight: ["600", "700"], subsets: ["latin"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: "JOO High School – NY Party 2026",
  description: "Premium QR ticketing for JOO HIGH SCHOOL NEW YEAR PARTY 2026",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="bg-background text-slate-100">
        <Providers>
          <div className="min-h-screen bg-gradient-radial">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
