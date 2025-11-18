import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use Supabase authentication
      const { supabase } = await import("@/lib/supabase");

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      if (data.user) {
        console.log('✅ Logged in successfully:', data.user.email);
        localStorage.setItem("isAuthenticated", "true");
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        toast.success("Successfully logged in!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error('Login exception:', error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-md px-2 sm:px-0">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient mb-2">
            The Final Conflict Ministry
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Admin Portal</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@finalconflict.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="min-h-[44px]"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="min-h-[44px]"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => toast.info("Password reset feature coming soon")}
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full min-h-[44px]" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
          © 2024 The Final Conflict Ministry. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
