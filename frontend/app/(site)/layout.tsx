import type { Metadata } from "next";
import { Sono } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const sono = Sono({
  variable: "--font-sono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduSense",
  description: "The modern way to analyse and understand your students performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sono.variable} antialiased bg-background text-primary`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
