import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

function ApplyLeave() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Apply for time off</CardTitle>
          <CardDescription>
            Submit a new request. Managers will be notified automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Leave type
              <select className="h-11 rounded-2xl border border-ink/10 bg-white/80 px-4 text-sm">
                <option>Casual</option>
                <option>Sick</option>
                <option>WFH</option>
                <option>Comp-off</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Approver
              <select className="h-11 rounded-2xl border border-ink/10 bg-white/80 px-4 text-sm">
                <option>Priya Sharma</option>
                <option>Jordan Singh</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Start date
              <input
                type="date"
                className="h-11 rounded-2xl border border-ink/10 bg-white/80 px-4 text-sm"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              End date
              <input
                type="date"
                className="h-11 rounded-2xl border border-ink/10 bg-white/80 px-4 text-sm"
              />
            </label>
            <label className="md:col-span-2 flex flex-col gap-2 text-sm font-semibold">
              Reason
              <textarea
                rows="4"
                className="rounded-3xl border border-ink/10 bg-white/80 p-4 text-sm"
                placeholder="Share a short note for your manager."
              />
            </label>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button type="button">Submit request</Button>
              <Button type="button" variant="outline">
                Save as draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ApplyLeave;
