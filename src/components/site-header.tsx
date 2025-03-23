
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ChevronRight, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Immigration Services",
    href: "#services",
    description:
      "Comprehensive suite of services for all your immigration needs, from visa applications to permanent residency.",
  },
  {
    title: "Document Management",
    href: "#documents",
    description:
      "Secure storage and organization of all your important immigration documents in one centralized location.",
  },
  {
    title: "Case Tracking",
    href: "#tracking",
    description:
      "Real-time updates and transparent tracking of your immigration case status and progress.",
  },
  {
    title: "Legal Consultation",
    href: "#legal",
    description:
      "Expert legal advice and consultation from experienced immigration professionals.",
  },
]

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export function SiteHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/40 transition-all duration-200">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-semibold text-lg tracking-tight transition-colors hover:text-primary"
        >
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            IM
          </div>
          <span>ImmigrationManager</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about" className={navigationMenuTriggerStyle()}>
                  About
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contact" className={navigationMenuTriggerStyle()}>
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden md:flex" 
                  asChild
                >
                  <Link to="/dashboard">
                    Dashboard
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hidden md:flex" 
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden md:flex" 
                  asChild
                >
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  className="hidden md:flex" 
                  asChild
                >
                  <Link to="/register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="flex md:hidden">
          {user ? (
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Button 
              size="sm" 
              asChild
            >
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
