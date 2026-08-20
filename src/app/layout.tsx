import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import { getCurrentUser } from "@/lib/auth";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
export const dynamic = "force-dynamic";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IndoWikipedia",
  description: "A Wikipedia-style knowledge platform",
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const currentUser = await getCurrentUser();

  const user = currentUser
    ? {
        _id: currentUser._id.toString(),
        username: currentUser.username,
        displayName: currentUser.displayName,
        role: currentUser.role,
      }
    : null;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar user={user} />
        {children}
      </body>
    </html>
  );
}