import { useEffect, useState } from "react";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useApi } from "../lib/api";
import { EmptyState } from "../components/ui/empty-state";
import { Spinner } from "../components/ui/spinner";
import { StatusBadge } from "../components/ui/status-badge";

function ApplyLeave() {
  const api = useApi();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [managers, setManagers] = useState([]);
  const [form, setForm] = useState({
    leaveType: "",
    appliedTo: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const [loadStatus, setLoadStatus] = useState({ loading: true, error: "" });

  const today = new Date().toISOString().split("T")[0];
  const minEndDate = form.startDate || today;

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      setLoadStatus({ loading: true, error: "" });
      try {
        const [types, users, myRequests] = await Promise.all([
          api("/api/leave-types"),
          api("/api/users?role=manager"),
          api("/api/leave-requests/mine"),
        ]);
        if (!active) {
          return;
        }
        setLeaveTypes(types);
        setManagers(users);
        setRequests(myRequests);
        setForm((prev) => ({
          ...prev,
          leaveType: types[0]?._id || "",
          appliedTo: users[0]?._id || "",
        }));
        setLoadStatus({ loading: false, error: "" });
      } catch (error) {
        if (active) {
          setLoadStatus({
            loading: false,
            error: "We couldn't load leave data. Please try again.",
          });
        }
      }
    };
    loadData();
    return () => {
      active = false;
    };
  }, [api]);

  const updateField = (key) => (event) => {
    const value = event.target.value;
    setForm((prev) => {
      if (key === "startDate" && prev.endDate && value > prev.endDate) {
        return { ...prev, startDate: value, endDate: value };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.startDate < today || form.endDate < today) {
      setStatus({
        loading: false,
        error: "Please choose dates from today onward.",
        success: "",
      });
      return;
    }
    if (form.endDate < form.startDate) {
      setStatus({
        loading: false,
        error: "End date cannot be before start date.",
        success: "",
      });
      return;
    }
    setStatus({ loading: true, error: "", success: "" });
    try {
      await api("/api/leave-requests", {
        method: "POST",
        body: JSON.stringify({
          leaveType: form.leaveType,
          appliedTo: form.appliedTo,
          startDate: form.startDate,
          endDate: form.endDate,
          reason: form.reason,
        }),
      });
      const myRequests = await api("/api/leave-requests/mine");
      setRequests(myRequests);
      setStatus({ loading: false, error: "", success: "Request submitted." });
    } catch (error) {
      setStatus({
        loading: false,
        error: "We couldn't submit your request. Please try again.",
        success: "",
      });
    }
  };

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
          {loadStatus.loading ? (
            <Spinner label="Loading leave details" className="py-6" />
          ) : null}
          {loadStatus.error ? (
            <p className="text-sm text-red-600">{loadStatus.error}</p>
          ) : null}
          {!loadStatus.loading ? (
            <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm font-semibold">
                Leave type
                <select
                  className="h-11 rounded-2xl border border-ink/10 bg-white/80 px-4 text-sm"
                  value={form.leaveType}
                  onChange={updateField("leaveType")}
                  required
                >
                  {leaveTypes.length === 0 ? (
                    <option value="">No leave types available</option>
                  ) : null}
                  {leaveTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold">
                Approver
                <select
                  className="h-11 rounded-2xl border border-ink/10 bg-white/80 px-4 text-sm"
                  value={form.appliedTo}
                  onChange={updateField("appliedTo")}
                  required
                >
                  {managers.length === 0 ? (
                    <option value="">No managers available</option>
                  ) : null}
                  {managers.map((manager) => (
                    <option key={manager._id} value={manager._id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold">
                Start date
                <input
                  type="date"
                  value={form.startDate}
                  onChange={updateField("startDate")}
                  min={today}
                  className="h-11 rounded-2xl border border-ink/10 bg-white/80 px-4 text-sm"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold">
                End date
                <input
                  type="date"
                  value={form.endDate}
                  onChange={updateField("endDate")}
                  min={minEndDate}
                  className="h-11 rounded-2xl border border-ink/10 bg-white/80 px-4 text-sm"
                  required
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm font-semibold">
                Reason
                <textarea
                  rows="4"
                  className="rounded-3xl border border-ink/10 bg-white/80 p-4 text-sm"
                  placeholder="Share a short note for your manager."
                  value={form.reason}
                  onChange={updateField("reason")}
                  required
                />
              </label>
              {status.error ? (
                <p className="md:col-span-2 text-sm text-red-600">{status.error}</p>
              ) : null}
              {status.success ? (
                <p className="md:col-span-2 text-sm text-emerald-700">{status.success}</p>
              ) : null}
              <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button type="submit" disabled={status.loading} className="w-full sm:w-auto">
                  {status.loading ? "Submitting..." : "Submit request"}
                </Button>
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  Save as draft
                </Button>
              </div>
            </form>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your leave requests</CardTitle>
          <CardDescription>Track pending, approved, and rejected requests.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {requests.length === 0 ? (
            <EmptyState
              title="No leave requests yet"
              description="Submit a request and it will show up here with real-time status updates."
            />
          ) : null}
          {requests.map((request) => (
            <div
              key={request._id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white/70 p-4"
            >
              <div>
                <p className="text-sm font-semibold">
                  {request.leaveType ? request.leaveType.name : "Leave"}
                </p>
                <p className="text-xs text-ink/60">
                  {new Date(request.startDate).toLocaleDateString()} -{" "}
                  {new Date(request.endDate).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={request.status} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default ApplyLeave;
