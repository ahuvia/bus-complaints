import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bus,
  LayoutDashboard,
  FileText,
  BarChart2,
  LogOut,
} from "lucide-react";
import { cn } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types";

const navItems = [
  { label: "לוח בקרא", href: "/", icon: LayoutDashboard },
  { label: "תלונות", href: "/complaints", icon: FileText },
  { label: "סיכום חודשי", href: "/summary", icon: BarChart2 },
];

export function Sidebar(): React.ReactElement {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <Bus className="h-7 w-7 text-blue-400" />
        <span className="text-lg font-bold">תלונות אוטובוס</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <Link
                to={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User */}
      <div className="border-t border-slate-700 px-4 py-4">
        <div className="mb-2 text-xs text-slate-400">{user?.email}</div>
        {user?.role === UserRole.ADMIN && (
          <div className="mb-2">
            <span className="rounded bg-blue-700 px-2 py-0.5 text-xs text-white">
              מנהל
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          התנתקות
        </button>
      </div>
    </aside>
  );
}
