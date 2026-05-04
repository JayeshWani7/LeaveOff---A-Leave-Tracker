import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const entries = [
  { name: "Avery Das", type: "WFH", range: "May 6 - May 7" },
  { name: "Logan Reddy", type: "Sick", range: "May 8" },
  { name: "Harper Bose", type: "Casual", range: "May 10 - May 11" },
];

function Calendar() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team leave calendar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.name}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white/70 p-4"
            >
              <div>
                <p className="text-sm font-semibold">{entry.name}</p>
                <p className="text-xs text-ink/60">{entry.range}</p>
              </div>
              <Badge variant="slate">{entry.type}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default Calendar;
