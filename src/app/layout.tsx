import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/footer";
import { Separator } from "@/components/ui/separator";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "AskAnon",
    description: "Your anonymous Q&A platform",
    icons: {
        icon: '/favicon.ico', // Path to your favicon in the public folder
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <AuthProvider>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased font-mono`}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Toaster />
                        <SidebarProvider defaultOpen={false}>
                            <AppSidebar/>
                            <main className="w-full">
                                <Navbar />
                                {children}
                                <Separator/>
                                <Footer/>
                            </main>
                        </SidebarProvider>
                    </ThemeProvider>
                </body>
            </AuthProvider>
        </html>
    );
}
