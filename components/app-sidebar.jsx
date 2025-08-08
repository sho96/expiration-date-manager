import {
  Barcode,
  Blocks,
  Calendar,
  Calendar1,
  CalendarX,
  CircleUser,
  Cookie,
  CookingPot,
  Home,
  Inbox,
  LayoutDashboard,
  ScanSearch,
  Search,
  Settings,
  Shapes,
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
} from "@/components/ui/sidebar";
import Image from "next/image";

const sideBarContents = [
  {
    title: "Manage",
    items: [
      {
        title: "Scan",
        icon: ScanSearch,
      },
      {
        title: "Dashboard",
        icon: LayoutDashboard,
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
        icon: Cookie,
      },
      {
        title: "Leftovers",
        icon: CookingPot,
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="offcanvas">
      <SidebarHeader>
        <a href="/">
          <Image
            src="/icon.png"
            width={40}
            height={40}
            className="rounded-full"
            alt="Logo"
          />
        </a>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
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
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
