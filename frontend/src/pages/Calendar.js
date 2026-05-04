import { useEffect, useState, useCallback } from "react";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { ErrorBanner } from "../components/ui/error-banner";
import { Spinner } from "../components/ui/spinner";
import { useApi } from "../lib/api";

/** Map leave type name to a badge color variant. */
function leaveTypeBadgeVariant(type = "") {
  const t = type.toLowerCase();
  if (t.includes("sick")) return "red";
  if (t.includes("casual") || t.includes("personal")) return "amber";
  if (t.includes("wfh") || t.includes("work from home")) return "sky";
  if (t.includes("annual") || t.includes("earned")) return "default";
  return "violet";
}

function Calendar() {
  const api = useApi();
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });

  const loadCalendar = useCallback(async () => {
    setStatus({ loading: true, error: "" });
    try {
      const data = await api("/api/leave-requests/team-calendar");
      setEntries(data);
      setStatus({ loading: false, error: "" });
    } catch {
      setStatus({
        loading: false,
        error: "Could not load the team calendar. Please try again.",
      });
    }
  }, [api]);

  useEffect(() => {
    loadCalendar();
  }, [loadCalendar]);

  return (
    <div className="space-y-6">
      <Card>
        {status.loading && <Spinner overlay label="Loading calendar…" />}
        <CardHeader>
          <CardTitle>Team leave calendar</CardTitle>
          <CardDescription>Approved leave for the current and next week.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ErrorBanner
            message={status.error}
            onDismiss={() => setStatus((s) => ({ ...s, error: "" }))}
          />
          {!status.loading && entries.length === 0 ? (
            <EmptyState
              icon="📅"
              title="No upcoming leave entries"
              description="Once requests are approved, they will appear here."
            />
          ) : null}
          {entries.map((entry) => {
            const key = entry.id ?? entry._id ?? `${entry.userName ?? entry.name}-${entry.startDate}`;
            // Backend returns `userName` (string); fallback for other shapes
            const name =
              entry.userName ??
              entry.name ??
              entry.userId?.name ??
              "Employee";
            // Backend returns `leaveType` as a string; fallback for populated objects
            const type =
              (typeof entry.leaveType === "string" ? entry.leaveType : null) ??
              entry.type ??
              entry.leaveType?.name ??
              "Leave";
            const fmtDate = (d) =>
              new Date(d).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              });
            const range = [
              fmtDate(entry.startDate),
              entry.endDate && entry.endDate !== entry.startDate
                ? `– ${fmtDate(entry.endDate)}`
                : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                key={key}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white/70 p-4"
              >
                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-ink/60">{range}</p>
                </div>
                <Badge variant={leaveTypeBadgeVariant(type)}>{type}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

export default Calendar;
