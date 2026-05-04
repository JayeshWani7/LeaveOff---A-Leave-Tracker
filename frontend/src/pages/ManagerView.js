import { useEffect, useState } from "react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useApi } from "../lib/api";

function ManagerView() {
  const api = useApi();
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });

  const loadRequests = async () => {
    setStatus({ loading: true, error: "" });
    try {
      const data = await api("/api/leave-requests/pending");
      setRequests(data);
      setStatus({ loading: false, error: "" });
    } catch (error) {
      setStatus({ loading: false, error: error.message });
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await api(`/api/leave-requests/${id}/${action}`, { method: "PATCH" });
      await loadRequests();
    } catch (error) {
      setStatus({ loading: false, error: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manager queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status.error ? <p className="text-sm text-red-600">{status.error}</p> : null}
          {status.loading ? <p className="text-sm text-ink/60">Loading...</p> : null}
          {!status.loading && requests.length === 0 ? (
            <p className="text-sm text-ink/60">No pending requests.</p>
          ) : null}
          {requests.map((request) => (
            <div
              key={request._id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white/70 p-4"
            >
              <div>
                <p className="text-sm font-semibold">
                  {request.userId ? request.userId.name : "Employee"}
                </p>
                <p className="text-xs text-ink/60">
                  {request.leaveType ? request.leaveType.name : "Leave"} ·{" "}
                  {new Date(request.startDate).toLocaleDateString()} -{" "}
                  {new Date(request.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge>Pending</Badge>
                <Button size="sm" onClick={() => handleAction(request._id, "approve")}>
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction(request._id, "reject")}
                >
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
