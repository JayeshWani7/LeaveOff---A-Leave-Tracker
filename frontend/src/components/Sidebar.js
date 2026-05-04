import { NavLink } from "react-router-dom";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Apply Leave", to: "/apply-leave" },
  { label: "Manager View", to: "/manager", roles: ["manager", "superadmin"] },
  { label: "Calendar", to: "/calendar" },
  { label: "Attendance", to: "/attendance" },
];

function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const visibleItems = navItems.filter((item) => {
    if (!item.roles) {
      return true;
    }
    return user && item.roles.includes(user.role);
  });

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/30 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-72 border-r border-white/60 bg-white/80 px-6 pb-10 pt-8 shadow-soft backdrop-blur-lg transition-transform",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink/50">
              LeaveOff
            </p>
            <h1 className="text-2xl font-semibold">Leave & Time-Off</h1>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-ink/70 transition hover:bg-black/5 lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-brand-soft text-brand-dark"
                    : "text-ink/70 hover:bg-black/5"
                )
              }
            >
              <span>{item.label}</span>
              <span className="h-2 w-2 rounded-full bg-brand" />
            </NavLink>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-white/60 bg-white/70 p-5">
          <p className="text-sm font-semibold">Next up</p>
          <p className="mt-2 text-xs text-ink/60">
            Keep your balances updated. Quick actions help teams plan faster.
          </p>
          <Button className="mt-4 w-full" size="sm">
            New Leave Request
          </Button>
          <Button
            className="mt-3 w-full"
            size="sm"
            variant="outline"
            type="button"
            onClick={logout}
          >
            Sign out
          </Button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
