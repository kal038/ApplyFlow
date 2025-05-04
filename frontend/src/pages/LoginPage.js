import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            navigate("/dashboard");
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    };
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx(Button, { variant: "outline", size: "icon", className: "absolute top-4 left-4 border-2 hover:bg-secondary hover:scale-105 transition-transform", onClick: () => navigate("/"), children: _jsx(ArrowLeft, { className: "h-6 w-6 font-bold" }) }), _jsx("div", { className: "flex min-h-screen items-center justify-center px-4", children: _jsxs("div", { className: "w-full max-w-sm space-y-8 border rounded-md bg-background p-6 shadow-md", children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Welcome back" }), _jsx("p", { className: "text-muted-foreground mt-2", children: "Sign in to your account" })] }), _jsxs("form", { onSubmit: handleLogin, className: "space-y-4 border p-6 rounded-md", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", placeholder: "you@example.com", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), error && _jsx("p", { className: "text-sm text-red-500", children: error }), _jsx(Button, { type: "submit", className: "w-full", children: "Sign In" }), _jsxs("div", { className: "text-center text-sm", children: ["Don't have an account?", " ", _jsx(Button, { variant: "link", className: "p-0 h-auto font-semibold", onClick: () => navigate("/signup"), children: "Sign up" })] })] })] }) })] }));
}
