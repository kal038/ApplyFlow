import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashboardPage } from "@/pages/DashboardPage";
import { LandingPage } from "@/pages/LandingPage";
import { SignupPage } from "@/pages/SignupPage";
import { LoginPage } from "@/pages/LoginPage";
import { useAuthStore } from "@/store/useAuthStore";
function App() {
    const [apiHealth, setApiHealth] = useState("");
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const response = await fetch("/api/v1/health");
                const data = await response.json();
                setApiHealth(JSON.stringify(data));
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
                setApiHealth(`Error: ${errorMessage}`);
            }
        };
        fetchHealth();
    }, []);
    // Add dark mode to entire app
    useEffect(() => {
        document.documentElement.classList.add("dark");
    }, []);
    return (_jsx(Router, { children: _jsxs("div", { className: "min-h-screen w-full bg-background", children: [_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignupPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) })] }), isAuthenticated && apiHealth && (_jsxs("div", { className: "fixed bottom-4 right-4 px-3 py-2 rounded-md bg-muted text-xs", children: ["API:", " ", apiHealth.includes("Error") ? (_jsx("span", { className: "text-red-400", children: apiHealth })) : (_jsx("span", { className: "text-green-400", children: "Connected" }))] }))] }) }));
}
export default App;
