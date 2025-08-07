import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Camera, TreePine, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    if (!formData.email.trim()) return false;
    if (!formData.password) return false;
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      login(formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        {/* Background Elements */}
        <div className="absolute -top-10 -left-10 animate-float">
          <TreePine className="w-12 h-12 text-nature-500/20" />
        </div>
        <div className="absolute -bottom-10 -right-10 animate-float" style={{ animationDelay: '2s' }}>
          <Camera className="w-10 h-10 text-gold-500/20" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="backdrop-blur-xl border-wild-800/30 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mx-auto w-16 h-16 bg-gradient-to-r from-nature-500 to-gold-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Camera className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <CardTitle className="text-2xl font-display font-bold text-white">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Sign in to continue your wildlife photography journey
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="photographer@wildnature.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-9 pr-9"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoggingIn || !validateForm()}
                >
                  {isLoggingIn ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="font-medium text-nature-400 hover:text-nature-300 transition-colors"
                  >
                    Join the community
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-muted-foreground/70">
            Connect with wildlife photographers worldwide
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
