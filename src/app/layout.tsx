import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "FixNow 24/7 | Premium Emergency Assistance, Mechanics & Home Repairs",
  description: "India's trusted 24/7 rapid assistance platform for verified mechanics, roadside towing, PESO-authorized fuel delivery and certified home appliance technicians.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen bg-[#FAF9F6] text-[#252B2B]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
