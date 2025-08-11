"use client";

import {
  BarChart,
  BarChart2,
  Barcode,
  Blocks,
  BottleWine,
  Calendar,
  Calendar1,
  CalendarX,
  ChartColumn,
  ChefHat,
  CircleUser,
  Cookie,
  CookingPot,
  History,
  Home,
  Inbox,
  LayoutDashboard,
  PackagePlus,
  ScanSearch,
  Search,
  Settings,
  Shapes,
  ShoppingBasket,
  Users,
  WalletMinimal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const sideBarContents = [
  {
    title: "Manage",
    items: [
      {
        title: "Scan",
        icon: ScanSearch,
      },
      {
        title: "Manual Registration",
        icon: ShoppingBasket,
      },
      {
        title: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "History",
        icon: ChartColumn,
      },
    ],
  },
  {
    title: "Utility",
    items: [
      {
        title: "AI Chef",
        icon: ChefHat,
      },
    ],
  },
  {
    title: "Data",
    items: [
      {
        title: "Product Types",
        icon: Shapes,
      },
      {
        title: "Products",
        icon: Blocks,
      },
      {
        title: "Barcodes",
        icon: Barcode,
      },
      {
        title: "Items",
        icon: BottleWine,
      },
      {
        title: "Leftovers",
        icon: Cookie,
      },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <Sidebar
      className="overflow-x-hidden top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      side="left"
      variant="floating"
      collapsible="icon"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/manage/dashboard">
                <Image
                  src="/icon.png"
                  width={24}
                  height={24}
                  className="rounded-full"
                  alt="Logo"
                />
                <span>Expiration Tracker</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* <Link href="/" className="text-md flex items-center justify-center gap-2 min-w-fit">
          <Image
            src="/icon.png"
            width={25}
            height={25}
            className="rounded-full"
            alt="Logo"
          />
          { state == "expanded" && "Expiration Tracker"}
        </Link> */}
      </SidebarHeader>
      <SidebarContent>
        {sideBarContents.map(({ title, items }) => (
          <SidebarGroup key={title}>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={`/${title.toLowerCase()}/${item.title
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        {/* logout */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/api/logout">
                <CircleUser />
                <span>Logout</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
