"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  BarChart3,
  Cpu,
  Settings,
} from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

const items = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tickets", href: "/tickets", icon: Ticket },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Model Monitor", href: "/model", icon: Cpu },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 px-4 text-gray-200">
      <div className="py-6">
        <div className="mb-8 px-2">
          <Image
            src="/SupportFlow.svg"
            alt="Company Logo"
            width={160}
            height={40}
            priority
          />
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition",
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
