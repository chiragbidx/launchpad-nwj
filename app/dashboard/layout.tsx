import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { UserMenu } from "@/components/dashboard/user-menu";
import { getAuthSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session) {
    redirect("/auth#signin");
  }

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <div className="flex-1 flex flex-col bg-muted">
        <header className="flex items-center justify-between px-8 py-5 border-b bg-background">
          <div className="flex items-center gap-4">
            <MobileNav />
            <span className="text-2xl font-bold tracking-tight text-primary">
              LeadFlow Dashboard
            </span>
          </div>
          <UserMenu />
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}