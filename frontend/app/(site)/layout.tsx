import type { Metadata } from "next";
import { Sono } from "next/font/google";
import "@/app/globals.css";

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
        {children}
      </body>
    </html>
  );
}
