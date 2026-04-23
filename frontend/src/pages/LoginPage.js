import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const API = "https://api.healingheartsportsfoundation.org/api";
const API = "http://localhost:8000/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Login successful!");

      // Redirect based on designation
      const designation = response.data.user.designation;
      if (designation === "Admin") {
        navigate("/admin-dashboard");
      } else if (designation === "Member") {
        navigate("/member-dashboard");
      } else if (designation === "Coordinator") {
        navigate("/coordinator-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const logoUrl = "https://customer-assets.emergentagent.com/job_helping-hands-ngo/artifacts/i3qfl6uh_WhatsApp%20Image%202026-01-20%20at%207.05.49%20PM%20%283%29.jpeg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <img src={logoUrl} alt="HHSF Logo" className="h-20 w-20 mx-auto mb-4 object-contain" />
            <h2 className="font-heading text-3xl font-bold text-primary">Welcome Back</h2>
            <p className="text-text-secondary mt-2">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  id="email"
                  type="email"
                  data-testid="login-email-input"
                  required
                  className="input-field"
                  style={{paddingLeft: "2.5rem"}}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  data-testid="login-password-input"
                  required
                  className="input-field pl-10 pr-10"
                  style={{paddingLeft: "2.5rem"}}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-text-muted" />
                  ) : (
                    <Eye className="h-5 w-5 text-text-muted" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              data-testid="login-submit-btn"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-primary hover:text-secondary transition-colors">
                Register here
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-text-muted hover:text-primary transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;