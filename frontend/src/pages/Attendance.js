import { useEffect, useState, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { ErrorBanner } from "../components/ui/error-banner";
import { SuccessBanner } from "../components/ui/success-banner";
import { Spinner } from "../components/ui/spinner";
import { Badge } from "../components/ui/badge";
import { useApi } from "../lib/api";

/** Returns the right badge variant based on attendance status string. */
function attendanceBadgeVariant(status = "") {
  const s = status.toLowerCase();
  if (s === "present") return "default";
  if (s === "half-day" || s === "halfday") return "amber";
  if (s === "on-leave" || s === "leave") return "sky";
  return "slate";
}

function Attendance() {
  const api = useApi();

  // Today's attendance record
  const [today, setToday] = useState(null);
  const [todayStatus, setTodayStatus] = useState({ loading: true, error: "" });

  // Recent history
  const [history, setHistory] = useState([]);
  const [histStatus, setHistStatus] = useState({ loading: true, error: "" });

  // Check-in / check-out action feedback
  const [actionStatus, setActionStatus] = useState({ loading: false, error: "", success: "" });

  const loadToday = useCallback(async () => {
    setTodayStatus({ loading: true, error: "" });
    try {
      const data = await api("/api/attendance/today");
      setToday(data);
      setTodayStatus({ loading: false, error: "" });
    } catch {
      setTodayStatus({ loading: false, error: "Could not load today's attendance." });
    }
  }, [api]);

  const loadHistory = useCallback(async () => {
    setHistStatus({ loading: true, error: "" });
    try {
      const data = await api("/api/attendance/history");
      setHistory(data);
      setHistStatus({ loading: false, error: "" });
    } catch {
      setHistStatus({ loading: false, error: "Could not load attendance history." });
    }
  }, [api]);

  useEffect(() => {
    loadToday();
    loadHistory();
  }, [loadToday, loadHistory]);

  const handleAction = async (action) => {
    setActionStatus({ loading: true, error: "", success: "" });
    try {
      await api(`/api/attendance/${action}`, { method: "POST" });
      setActionStatus({
        loading: false,
        error: "",
        success: `${action === "checkin" ? "Checked in" : "Checked out"} successfully.`,
      });
      await loadToday();
    } catch (err) {
      setActionStatus({
        loading: false,
        error: err.message || `Could not ${action === "checkin" ? "check in" : "check out"}. Please try again.`,
        success: "",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Today card */}
      <Card className="relative">
        {todayStatus.loading && <Spinner overlay label="Loading today's record…" />}
        <CardHeader>
          <CardTitle>Today</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ErrorBanner
            message={todayStatus.error}
            onDismiss={() => setTodayStatus((s) => ({ ...s, error: "" }))}
          />
          <ErrorBanner
            message={actionStatus.error}
            onDismiss={() => setActionStatus((s) => ({ ...s, error: "" }))}
          />
          <SuccessBanner
            message={actionStatus.success}
            onDismiss={() => setActionStatus((s) => ({ ...s, success: "" }))}
          />

          {!todayStatus.loading && (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-ink/60">Status</p>
                <p className="text-2xl font-semibold">
                  {today?.status ?? "Not checked in"}
                </p>
                {today?.checkIn ? (
                  <p className="mt-1 text-xs text-ink/60">
                    Check-in: {new Date(today.checkIn).toLocaleTimeString()}
                    {today.checkOut
                      ? ` · Check-out: ${new Date(today.checkOut).toLocaleTimeString()}`
                      : ""}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  disabled={actionStatus.loading || !!today?.checkIn}
                  onClick={() => handleAction("checkin")}
                >
                  {actionStatus.loading ? <Spinner size="xs" /> : null}
                  Check in
                </Button>
                <Button
                  variant="outline"
                  disabled={actionStatus.loading || !today?.checkIn || !!today?.checkOut}
                  onClick={() => handleAction("checkout")}
                >
                  {actionStatus.loading ? <Spinner size="xs" /> : null}
                  Check out
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History card */}
      <Card className="relative">
        {histStatus.loading && <Spinner overlay label="Loading history…" />}
        <CardHeader>
          <CardTitle>Recent attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ErrorBanner
            message={histStatus.error}
            onDismiss={() => setHistStatus((s) => ({ ...s, error: "" }))}
          />
          {!histStatus.loading && history.length === 0 ? (
            <EmptyState
              icon="🗓️"
              title="No attendance records yet"
              description="Check in to create your first attendance entry."
            />
          ) : null}
          {history.map((record) => (
            <div
              key={record._id ?? record.date}
              className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white/70 p-4"
            >
              <div>
                <p className="text-sm font-semibold">
                  {record.date
                    ? new Date(record.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </p>
                <p className="text-xs text-ink/60">
                  {record.checkIn
                    ? `Check-in ${new Date(record.checkIn).toLocaleTimeString()}`
                    : "No check-in"}
                  {record.totalHours != null ? ` · ${record.totalHours}h` : ""}
                </p>
              </div>
              <Badge variant={attendanceBadgeVariant(record.status)}>
                {record.status ?? "Unknown"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default Attendance;
