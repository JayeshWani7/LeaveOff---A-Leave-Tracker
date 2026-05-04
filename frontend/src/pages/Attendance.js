import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";

function Attendance() {
  const recentAttendance = [
    { date: "May 3", status: "Present" },
    { date: "May 2", status: "Half-Day" },
    { date: "May 1", status: "On-Leave" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Today</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-ink/60">Status</p>
            <p className="text-2xl font-semibold">Present</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button>Check in</Button>
            <Button variant="outline">Check out</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentAttendance.length === 0 ? (
            <EmptyState
              title="No attendance records yet"
              description="Check in to create your first attendance entry."
            />
          ) : null}
          {recentAttendance.map((record) => (
            <div
              key={record.date}
              className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white/70 p-4"
            >
              <div>
                <p className="text-sm font-semibold">{record.date}</p>
                <p className="text-xs text-ink/60">Check-in 09:02 · 6.5 hrs</p>
              </div>
              <Badge variant={record.status === "Present" ? "default" : "slate"}>
                {record.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default Attendance;
