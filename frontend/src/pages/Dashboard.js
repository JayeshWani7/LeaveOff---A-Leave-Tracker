import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { ErrorBanner } from "../components/ui/error-banner";
import { Spinner } from "../components/ui/spinner";
import { StatusBadge } from "../components/ui/status-badge";
import { useApi } from "../lib/api";

function StatCard({ label, value, loading }) {
  return (
    <Card className="relative overflow-hidden p-6">
      <p className="text-sm text-ink/60">{label}</p>
      {loading ? (
        <Spinner className="mt-4" size="md" />
      ) : (
        <p className="mt-3 text-3xl font-semibold">{value ?? "—"}</p>
      )}
    </Card>
  );
}

function Dashboard() {
  const api = useApi();

  // Summary stats (leave balance, pending count, etc.)
  const [stats, setStats] = useState(null);
  const [statsStatus, setStatsStatus] = useState({ loading: true, error: "" });

  // Recent leave requests for the user
  const [requests, setRequests] = useState([]);
  const [reqStatus, setReqStatus] = useState({ loading: true, error: "" });

  useEffect(() => {
    let active = true;

    // Load dashboard summary
    const loadStats = async () => {
      setStatsStatus({ loading: true, error: "" });
      try {
        const data = await api("/api/dashboard/summary");
        if (active) {
          setStats(data);
          setStatsStatus({ loading: false, error: "" });
        }
      } catch {
        if (active) {
          setStatsStatus({
            loading: false,
            error: "Could not load summary data. Check your connection.",
          });
        }
      }
    };

    // Load recent leave requests
    const loadRequests = async () => {
      setReqStatus({ loading: true, error: "" });
      try {
        const data = await api("/api/leave-requests/mine");
        if (active) {
          setRequests(data.slice(0, 5));
          setReqStatus({ loading: false, error: "" });
        }
      } catch {
        if (active) {
          setReqStatus({
            loading: false,
            error: "Could not load your recent requests.",
          });
        }
      }
    };

    loadStats();
    loadRequests();

    return () => {
      active = false;
    };
  }, [api]);

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
          <CardHeader>
            <Badge>Today</Badge>
            <CardTitle className="mt-4 text-2xl sm:text-3xl">
              {statsStatus.loading ? (
                <Spinner size="lg" label="Loading your balance…" />
              ) : stats ? (
                <>You have {stats.leaveBalance ?? "—"} days of leave remaining.</>
              ) : (
                "Welcome back."
              )}
            </CardTitle>
            <CardDescription>
              Track your requests, attendance, and team calendar from here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/apply-leave">Apply for Leave</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/calendar">Team Calendar</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pending requests mini-panel */}
        <Card>
          <CardHeader>
            <Badge variant="amber">Attention</Badge>
            <CardTitle className="mt-4">Pending approvals</CardTitle>
            <CardDescription>
              {statsStatus.loading
                ? "Loading…"
                : stats
                ? `${stats.pendingCount ?? 0} request(s) awaiting review.`
                : "Could not load count."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reqStatus.loading ? (
              <Spinner label="Loading requests…" />
            ) : reqStatus.error ? (
              <ErrorBanner message={reqStatus.error} />
            ) : requests.length === 0 ? (
              <EmptyState
                icon="🎉"
                title="All clear!"
                description="No pending requests right now."
              />
            ) : (
              <div className="space-y-3 text-sm">
                {requests.map((req) => (
                  <div
                    key={req._id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="truncate text-ink/80">
                      {req.leaveType?.name ?? "Leave"}
                      {" · "}
                      {new Date(req.startDate).toLocaleDateString()}
                    </span>
                    <StatusBadge status={req.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Error banner for stats failure */}
      {statsStatus.error ? (
        <ErrorBanner
          message={statsStatus.error}
          onDismiss={() => setStatsStatus((s) => ({ ...s, error: "" }))}
        />
      ) : null}

      {/* Stat cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <StatCard
          label="On leave today"
          value={stats?.onLeaveToday}
          loading={statsStatus.loading}
        />
        <StatCard
          label="Half-day check-ins"
          value={stats?.halfDayCount}
          loading={statsStatus.loading}
        />
        <StatCard
          label="Attendance rate"
          value={
            stats?.attendanceRate != null
              ? `${stats.attendanceRate}%`
              : undefined
          }
          loading={statsStatus.loading}
        />
      </section>
    </div>
  );
}

export default Dashboard;
