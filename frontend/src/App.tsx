import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashboardPage } from "@/pages/DashboardPage";
import { LandingPage } from "@/pages/LandingPage";

function App() {
  const [apiHealth, setApiHealth] = useState<string>("");

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch("/api/v1/health");
        const data = await response.json();
        setApiHealth(JSON.stringify(data));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        setApiHealth(`Error: ${errorMessage}`);
      }
    };
    fetchHealth();
  }, []);

  // Add dark mode to entire app
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <Router>
      <div className="min-h-screen w-full bg-background">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>

        {/* API Status indicator */}
        {apiHealth && (
          <div className="fixed bottom-4 right-4 px-3 py-2 rounded-md bg-muted text-xs">
            API:{" "}
            {apiHealth.includes("Error") ? (
              <span className="text-red-400">{apiHealth}</span>
            ) : (
              <span className="text-green-400">Connected</span>
            )}
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
