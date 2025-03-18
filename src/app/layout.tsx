import CustomRainbowKitProvider from "./CustomRainbowKitProvider";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import type { Metadata } from "next";
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
    title: "ERC-20-Transfers-Dapps",
    description: "Dapps to transfer ERC-20 tokens.",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <html lang="en">
            <head>
                <title>{metadata.title as string}</title>
                <meta name="description" content={metadata.description as string} />
                <link rel="icon" href="/favicon.ico" sizes="any" type="image/ico" />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
                <CustomRainbowKitProvider>
                    <div className="flex flex-col flex-grow min-h-screen">
                        <Header />
                        <main className="flex flex-col flex-grow justify-center bg-gray-100 p-8">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </CustomRainbowKitProvider>
                <Toaster />
            </body>
        </html>
    );
}
