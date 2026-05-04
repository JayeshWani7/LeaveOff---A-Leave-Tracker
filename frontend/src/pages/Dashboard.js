import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

function Dashboard() {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
          <CardHeader>
            <Badge>Today</Badge>
            <CardTitle className="mt-4 text-3xl">
              You have 12.5 days of leave remaining.
            </CardTitle>
            <CardDescription>
              Your next planned leave is in two weeks. Keep an eye on approvals and
              attendance changes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>Apply for Leave</Button>
            <Button variant="outline">View History</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Badge variant="amber">Attention</Badge>
            <CardTitle className="mt-4">Pending approvals</CardTitle>
            <CardDescription>
              4 requests need manager review. Average approval time: 1.2 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              {[
                "Riley T. - Casual leave",
                "Jordan M. - Sick leave",
                "Emerson L. - WFH",
              ].map((item) => (
                <div key={item} className="flex items-center justify-between">
                  <span>{item}</span>
                  <Badge variant="slate">Pending</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          { label: "On leave today", value: "3" },
          { label: "Half-day check-ins", value: "5" },
          { label: "Attendance rate", value: "92%" },
        ].map((stat) => (
          <Card key={stat.label} className="p-6">
            <p className="text-sm text-ink/60">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}

export default Dashboard;
