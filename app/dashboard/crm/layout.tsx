import { cn } from "@/lib/utils";
import Link from "next/link";

const tabs = [
  {
    label: "Contacts",
    href: "/dashboard/crm/contacts",
  },
  {
    label: "Companies",
    href: "/dashboard/crm/companies",
  },
  {
    label: "Activities",
    href: "/dashboard/crm/activities",
  },
];

export default function CRMLinkedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav className="mb-8 flex gap-4 border-b pb-2">
        {tabs.map((tab) => (
          <Link
            className={cn(
              "text-md px-4 py-2 rounded-t-md font-semibold hover:bg-accent transition",
              // @ts-expect-error - only used in /dashboard/crm routes, so window.location available
              window.location && window.location.pathname.startsWith(tab.href)
                ? "bg-muted text-primary"
                : "text-muted-foreground"
            )}
            key={tab.href}
            href={tab.href}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <div>{children}</div>
    </div>
  );
}