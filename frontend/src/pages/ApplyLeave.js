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
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const [types, users] = await Promise.all([
          api("/api/leave-types"),
          api("/api/users?role=manager"),
        ]);
        if (!active) {
          return;
        }
        setLeaveTypes(types);
        setManagers(users);
        setForm((prev) => ({
          ...prev,
          leaveType: types[0]?._id || "",
          appliedTo: users[0]?._id || "",
        }));
      } catch (error) {
        if (active) {
          setStatus({ loading: false, error: error.message, success: "" });
        }
      }
    };
    loadData();
    return () => {
      active = false;
    };
  }, [api]);

  const updateField = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      setStatus({ loading: false, error: "", success: "Request submitted." });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: "" });
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
          <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Leave type
              <select
                className="h-11 rounded-2xl border border-ink/10 bg-white/80 px-4 text-sm"
                value={form.leaveType}
                onChange={updateField("leaveType")}
                required
              >
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
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button type="submit" disabled={status.loading}>
                {status.loading ? "Submitting..." : "Submit request"}
              </Button>
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
