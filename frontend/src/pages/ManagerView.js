import { useEffect, useState } from "react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { ErrorBanner } from "../components/ui/error-banner";
import { Spinner } from "../components/ui/spinner";
import { StatusBadge } from "../components/ui/status-badge";
import { useApi } from "../lib/api";

function ManagerView() {
  const api = useApi();
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });
  const [remarks, setRemarks] = useState({});
  const [actionId, setActionId] = useState(null);

  const loadRequests = async () => {
    setStatus({ loading: true, error: "" });
    try {
      const data = await api("/api/leave-requests/pending");
      setRequests(data);
      setStatus({ loading: false, error: "" });
    } catch (error) {
      setStatus({
        loading: false,
        error: "We couldn't load pending requests. Please refresh and try again.",
      });
    }
  };

  useEffect(() => {
    loadRequests();
  }, [api]);

  const handleAction = async (id, action) => {
    try {
      setActionId(id);
      setStatus({ loading: true, error: "" });
      if (action === "reject") {
        const comment = (remarks[id] || "").trim();
        if (!comment) {
          setStatus({ loading: false, error: "Please add a remark before rejecting." });
          setActionId(null);
          return;
        }
        await api(`/api/leave-requests/${id}/${action}`, {
          method: "PATCH",
          body: JSON.stringify({ managerComment: comment }),
        });
      } else {
        await api(`/api/leave-requests/${id}/${action}`, { method: "PATCH" });
      }
      await loadRequests();
    } catch (error) {
      setStatus({
        loading: false,
        error: "We couldn't update that request. Please try again.",
      });
    } finally {
      setActionId(null);
    }
  };

  const handleRemarkChange = (id) => (event) => {
    const value = event.target.value;
    setRemarks((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manager queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ErrorBanner
            message={status.error}
            onDismiss={() => setStatus((s) => ({ ...s, error: "" }))}
          />
          {status.loading ? <Spinner label="Loading requests" /> : null}
          {!status.loading && requests.length === 0 ? (
            <EmptyState
              icon="✅"
              title="No pending requests"
              description="You're all caught up. New submissions will appear here."
            />
          ) : null}
          {requests.map((request) => (
            <div
              key={request._id}
              className="flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-[220px] flex-1">
                <p className="text-sm font-semibold">
                  {request.userId ? request.userId.name : "Employee"}
                </p>
                <p className="text-xs text-ink/60">
                  {request.leaveType ? request.leaveType.name : "Leave"} ·{" "}
                  {new Date(request.startDate).toLocaleDateString()} -{" "}
                  {new Date(request.endDate).toLocaleDateString()}
                </p>
                <textarea
                  rows="2"
                  className="mt-3 w-full rounded-2xl border border-ink/10 bg-white/80 p-3 text-xs"
                  placeholder="Add a remark for rejection"
                  value={remarks[request._id] || ""}
                  onChange={handleRemarkChange(request._id)}
                />
              </div>
              <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:justify-end">
                <StatusBadge status={request.status || "Pending"} />
                <Button
                  size="sm"
                  disabled={status.loading && actionId === request._id}
                  onClick={() => handleAction(request._id, "approve")}
                >
                  {status.loading && actionId === request._id ? (
                    <Spinner className="text-white" />
                  ) : (
                    "Approve"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={status.loading && actionId === request._id}
                  onClick={() => handleAction(request._id, "reject")}
                >
                  {status.loading && actionId === request._id ? (
                    <Spinner />
                  ) : (
                    "Reject"
                  )}
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
