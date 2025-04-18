import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waterloo Interview Trainer",
  description: "AI Powered Platform for preparing for coop interviews",
  icons: {
    icon: [
      { url: "/waterloo_logo.png", type: "image/png" },
    ],
    shortcut: "/waterloo_logo.png",
    apple: "/waterloo_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.className} antialiased pattern`}
      >
        {children}
        <Toaster/>
        
      </body>
    </html>
  );
}
