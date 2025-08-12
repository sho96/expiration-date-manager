"use client";

import { ChevronRight, SidebarIcon } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage,  } from "@/components/ui/breadcrumb";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/theme-toggle";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  useEffect(() => {
    const path = window.location.pathname;
    const items = path.split("/").filter(Boolean);
    setBreadcrumbItems(items);
  }, []);

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
        {
          <Breadcrumb>
            <BreadcrumbList className="flex items-center gap-1.5">
              {breadcrumbItems.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <BreadcrumbItem className={"inline-flex items-center gap-1.5"}>
                    <BreadcrumbPage href={`/${item}`} className={"text-foreground font-normal"}>{item}</BreadcrumbPage>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className={"inline-flex items-center gap-1.5"}>
                    <ChevronRight />
                  </BreadcrumbSeparator>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        }
        <ThemeToggle />
      </div>
    </header>
  );
}
