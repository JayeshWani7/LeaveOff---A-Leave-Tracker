import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import ApplyLeave from "./pages/ApplyLeave";
import ManagerView from "./pages/ManagerView";
import Calendar from "./pages/Calendar";
import Attendance from "./pages/Attendance";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-sand">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-72">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="px-6 pb-16 pt-6 sm:px-8">
            <div className="mx-auto max-w-6xl animate-floatIn">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/apply-leave" element={<ApplyLeave />} />
                <Route path="/manager" element={<ManagerView />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/attendance" element={<Attendance />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
