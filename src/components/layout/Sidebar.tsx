import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Landmark,
  Map,
  BarChart3,
  ClipboardList,
  Bell,
  Settings as SettingsIcon,
  X,
} from "lucide-react";
import BrandMark from "../common/BrandMark";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sites", label: "Sites", icon: Landmark },
  { to: "/map", label: "Analysis", icon: Map },
  { to: "/analytics", label: "Risk Prediction", icon: BarChart3 },
  { to: "/conservation", label: "Reports", icon: ClipboardList },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-brand-border bg-brand-sidebar transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <NavLink to="/" onClick={onClose} className="transition-opacity hover:opacity-90" aria-label="HeritageGuard home">
            <BrandMark theme="light" />
          </NavLink>
          <button onClick={onClose} className="text-brand-text-muted hover:text-brand-text-dark lg:hidden" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-3" aria-label="Primary">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-brand-forest text-white"
                        : "text-brand-text-muted hover:bg-brand-border/30 hover:text-brand-text-dark"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={17}
                        aria-hidden="true"
                        className={`transition-transform duration-200 ${isActive ? "scale-105" : "text-brand-text-muted group-hover:text-brand-text-dark"}`}
                      />
                      {label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Widget at the bottom */}
        <div className="border-t border-brand-border p-4">
          <div className="flex items-center gap-3 rounded-lg border border-brand-border/60 bg-white/50 p-3">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&h=80&q=80"
              alt="Admin avatar"
              className="h-9 w-9 rounded-full object-cover border border-brand-border"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-brand-text-dark truncate">Admin User</p>
              <p className="text-[10px] text-brand-text-muted truncate">Conservation Team</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
