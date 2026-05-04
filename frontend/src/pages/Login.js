import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state && location.state.from ? location.state.from.pathname : "/dashboard";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username.trim().toLowerCase(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink/50">
            LeaveOff
          </p>
          <CardTitle className="mt-3 text-2xl">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Username
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="h-11 rounded-2xl border border-ink/10 bg-white/80 px-4 text-sm"
                placeholder="e.g. superadmin"
                autoComplete="username"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 rounded-2xl border border-ink/10 bg-white/80 px-4 text-sm"
                autoComplete="current-password"
                required
              />
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
