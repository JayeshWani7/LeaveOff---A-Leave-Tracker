import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";

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

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 transition-all duration-300 ${scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
        }`}
    >
      <div className="flex items-center justify-between px-6 pb-5 pt-8 sm:px-10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-full border border-white/60 bg-white/70 p-2.5 text-ink/80 shadow-soft transition hover:bg-white lg:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            ☰
          </button>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink/40">
              Week 19
            </p>
            <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
              {title}
            </h2>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isManager && (
            <Button variant="outline" asChild>
              <Link to="/manager">Review Requests</Link>
            </Button>
          )}
          <Button asChild>
            <Link to="/apply-leave">Apply Leave</Link>
          </Button>
        </div>
      </div>

      <div className="px-6 pb-5 sm:px-10 md:hidden">
        <div className="flex flex-col gap-2">
          {isManager && (
            <Button variant="outline" asChild>
              <Link to="/manager">Review Requests</Link>
            </Button>
          )}
          <Button asChild>
            <Link to="/apply-leave">Apply Leave</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;