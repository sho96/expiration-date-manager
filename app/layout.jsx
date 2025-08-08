import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeToggle from "@/components/theme-toggle";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Expiration Tracker",
  description: "Never let anything go to waste!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute={"class"} defaultTheme="system" disableTransitionOnChange enableSystem>
          <Toaster position="bottom-right" />
          <SidebarProvider>
            <AppSidebar />
            <main>
              <SidebarTrigger size={5} className={"p-5"}/>
              {children}
            </main>
            <SidebarRail />
          </SidebarProvider>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
