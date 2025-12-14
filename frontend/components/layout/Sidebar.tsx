import Link from "next/link";
import {
  LayoutDashboard,
  Ticket,
  BarChart3,
  Cpu,
  Settings,
} from "lucide-react";
import Image from "next/image";
const items = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tickets", href: "/tickets", icon: Ticket },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Model Monitor", href: "/model", icon: Cpu },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900  px-4 ">
      <div className="py-2">
        {" "}
        <div className="py-5">
          <Image
            src="/SupportFlow.svg"
            alt="Company Logo"
            width={500}
            height={10}
          />
        </div>
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
