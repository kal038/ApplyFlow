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

  const handleSignup = async (e: React.FormEvent) => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Real-time validation
  const passwordsMatch = password === confirmPassword;
  // Only show mismatch error if both fields have values
  const showPasswordError =
    password.length > 0 && confirmPassword.length > 0 && !passwordsMatch;

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 left-4 border-2 hover:bg-secondary hover:scale-105 transition-transform"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-6 w-6 font-bold" />
      </Button>

      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8 border rounded-md bg-background p-6 shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Create your account</h2>
            <p className="text-muted-foreground mt-2">
              Get started with ApplyFlow
            </p>
          </div>

          <form
            onSubmit={handleSignup}
            className="space-y-4 border p-6 rounded-md"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={showPasswordError ? "border-red-500" : ""}
              />
              {showPasswordError && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              Create Account
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => navigate("/login")}
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
