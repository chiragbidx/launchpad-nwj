"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Book,
  Users,
  Briefcase,
  Activity,
  LayoutGrid,
  Settings,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    label: "CRM",
    href: "/dashboard/crm",
    icon: Book,
    children: [
      {
        label: "Contacts",
        href: "/dashboard/crm/contacts",
        icon: Users,
      },
      {
        label: "Companies",
        href: "/dashboard/crm/companies",
        icon: Briefcase,
      },
      {
        label: "Activities",
        href: "/dashboard/crm/activities",
        icon: Activity,
      },
    ],
  },
  {
    label: "Team",
    href: "/dashboard/team",
    icon: UserCircle,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="lg:hidden p-2 focus:outline-none"
          aria-label="Open menu"
        >
          <Menu className="w-7 h-7" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 bg-background border-r">
        <nav className="flex flex-col gap-1 p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 mb-8 text-xl font-bold tracking-tight text-primary"
            aria-label="LeadFlow Home"
          >
            <span className="rounded-lg bg-primary/10 p-2 text-primary">
              <LayoutGrid className="w-7 h-7" />
            </span>
            LeadFlow
          </Link>
          <ul className="flex flex-col gap-2">
            {navItems.map((item) =>
              item.children ? (
                <li key={item.label}>
                  <span className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground uppercase tracking-wide text-xs">
                    {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                    {item.label}
                  </span>
                  <ul className="ml-4 flex flex-col gap-1">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg font-medium hover:bg-accent transition-colors",
                            pathname.startsWith(child.href)
                              ? "bg-accent text-primary"
                              : "text-muted-foreground"
                          )}
                          aria-current={
                            pathname.startsWith(child.href)
                              ? "page"
                              : undefined
                          }
                          onClick={() => setOpen(false)}
                        >
                          {child.icon && <child.icon className="w-4 h-4" />}
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg font-medium hover:bg-accent transition-colors",
                      pathname === item.href
                        ? "bg-accent text-primary"
                        : "text-muted-foreground"
                    )}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}