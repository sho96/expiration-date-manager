"use client";

import { SidebarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/theme-toggle";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-2">
        <Button
          className=""
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon size={24} />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-md flex flex-1 items-center gap-2">
          <Link href="/" className="flex items-center">
            <Image
              src="/icon.png"
              width={25}
              height={25}
              className="rounded-full"
              alt="Logo"
            />
          </Link>
          Expiration Tracker
        </h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
