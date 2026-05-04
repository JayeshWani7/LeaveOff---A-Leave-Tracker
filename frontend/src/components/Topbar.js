import { useLocation } from "react-router-dom";

import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";

const titles = {
  "/dashboard": "Overview",
  "/apply-leave": "Apply for Leave",
  "/manager": "Manager View",
  "/calendar": "Team Calendar",
  "/attendance": "Attendance",
};

function Topbar({ onMenuClick }) {
  const location = useLocation();
  const title = titles[location.pathname] || "LeaveOff";
  const { user } = useAuth();
  const isManager = user && (user.role === "manager" || user.role === "superadmin");

  return (
    <header className="sticky top-0 z-20 bg-transparent">
      <div className="flex items-center justify-between px-6 pb-4 pt-6 sm:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full border border-white/60 bg-white/70 p-2 text-ink/80 shadow-soft transition hover:bg-white lg:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            ☰
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">
              Week 19
            </p>
            <h2 className="text-3xl font-semibold">{title}</h2>
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          {isManager ? <Button variant="outline">Review Requests</Button> : null}
          <Button>Apply Leave</Button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
