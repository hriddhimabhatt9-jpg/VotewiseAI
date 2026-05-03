import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ClientProvider } from "@/components/providers/ClientProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "VoteWise AI+ | Your Intelligent Voting Assistant",
  description: "Empowering citizens with AI-driven voter education, election insights, and civic participation tools for Indian elections.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: ["voter education", "Indian elections", "AI assistant", "voter registration", "election information"],
  openGraph: {
    title: "VoteWise AI+ | Your Intelligent Voting Assistant",
    description: "Empowering citizens with AI-driven voter education, election insights, and civic participation tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientProvider>
          <div className="flex flex-col min-h-screen relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none" aria-hidden="true">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-900/20 blur-[120px] animate-float"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 dark:bg-indigo-900/20 blur-[120px] animate-float-delayed"></div>
            </div>
            
            <Navbar />
            <main id="main-content" className="flex-grow pt-16" role="main">
              {children}
            </main>
            <Footer />
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}
