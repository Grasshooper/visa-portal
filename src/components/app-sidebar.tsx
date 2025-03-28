import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Folder,
  Calendar as CalendarIcon,
  MessageSquare,
  BarChart3,
  Settings,
  Users,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const mainMenuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "Cases",
      icon: Folder,
      href: "/cases",
    },
    {
      title: "Documents",
      icon: FileText,
      href: "/documents",
    },
    {
      title: "Calendar",
      icon: CalendarIcon,
      href: "/calendar",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/messages",
      badge: 3,
    },
    {
      title: "Reports",
      icon: BarChart3,
      href: "/reports",
    },
  ];

  const otherMenuItems = [
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
    {
      title: "Users",
      icon: Users,
      href: "/users",
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      href: "/help",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2 px-4 py-2 h-16">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-base"
        >
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            IM
          </div>
          <span className="font-medium">visa4U</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={isActive(item.href)}
                    className={cn(
                      "transition-all duration-200 justify-start gap-3 h-10",
                      isActive(item.href) && "font-medium"
                    )}
                  >
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                          {item.badge}
                        </div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel>Other</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={isActive(item.href)}
                    className={cn(
                      "transition-all duration-200 justify-start gap-3 h-10",
                      isActive(item.href) && "font-medium"
                    )}
                  >
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/40">
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          asChild
        >
          <Link to="/">
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
