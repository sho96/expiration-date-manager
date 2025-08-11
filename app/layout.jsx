import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeToggle from "@/components/theme-toggle";

import { Geist, Geist_Mono, DotGothic16 } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dotGothic = DotGothic16({
  variable: "--font-dot-gothic",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
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
        className={`${geistSans.variable} ${geistMono.variable} ${dotGothic.variable} antialiased`}
      >
        <ThemeProvider
          attribute={"class"}
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <Toaster position="bottom-right" />
          <SidebarProvider defaultOpen={false} className="flex flex-col">
            <SiteHeader />
            <div className="flex flex-1">
              <AppSidebar />
              <main className="min-h-screen w-full max-w-4xl">{children}</main>
            </div>
          </SidebarProvider>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
