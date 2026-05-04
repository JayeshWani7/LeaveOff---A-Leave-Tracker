import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

function ManagerView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manager queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white/70 p-4"
            >
              <div>
                <p className="text-sm font-semibold">Casey Patel</p>
                <p className="text-xs text-ink/60">Casual leave · Apr 18 - Apr 20</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge>Pending</Badge>
                <Button size="sm">Approve</Button>
                <Button size="sm" variant="outline">
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default ManagerView;
