"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Book, Users, Briefcase, Activity, LayoutGrid, Settings, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b bg-background">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary" aria-label="LeadFlow Home">
          <LayoutGrid className="w-7 h-7" />
          LeadFlow
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </nav>
  );
}