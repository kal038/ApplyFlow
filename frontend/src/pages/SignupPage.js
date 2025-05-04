import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
export function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const signup = useAuthStore((state) => state.signup);
    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        // Check password length first
        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }
        // Then check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            await signup(email, password);
            navigate("/dashboard");
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    };
    // Real-time validation
    const passwordsMatch = password === confirmPassword;
    // Only show mismatch error if both fields have values
    const showPasswordError = password.length > 0 && confirmPassword.length > 0 && !passwordsMatch;
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx(Button, { variant: "outline", size: "icon", className: "absolute top-4 left-4 border-2 hover:bg-secondary hover:scale-105 transition-transform", onClick: () => navigate("/"), children: _jsx(ArrowLeft, { className: "h-6 w-6 font-bold" }) }), _jsx("div", { className: "flex min-h-screen items-center justify-center px-4", children: _jsxs("div", { className: "w-full max-w-sm space-y-8 border rounded-md bg-background p-6 shadow-md", children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Create your account" }), _jsx("p", { className: "text-muted-foreground mt-2", children: "Get started with ApplyFlow" })] }), _jsxs("form", { onSubmit: handleSignup, className: "space-y-4 border p-6 rounded-md", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", placeholder: "you@example.com", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "confirm-password", children: "Confirm Password" }), _jsx(Input, { id: "confirm-password", type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true, className: showPasswordError ? "border-red-500" : "" }), showPasswordError && (_jsx("p", { className: "text-sm text-red-500", children: "Passwords do not match" }))] }), error && _jsx("p", { className: "text-sm text-red-500", children: error }), _jsx(Button, { type: "submit", className: "w-full", children: "Create Account" }), _jsxs("div", { className: "text-center text-sm", children: ["Already have an account?", " ", _jsx(Button, { variant: "link", className: "p-0 h-auto font-semibold", onClick: () => navigate("/login"), children: "Sign in" })] })] })] }) })] }));
}
