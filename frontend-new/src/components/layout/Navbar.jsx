import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import { 
  Camera, 
  TreePine, 
  MessageCircle, 
  Image as ImageIcon, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Binoculars,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@/assets/WBN Logo 2.jpg";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Chat", href: "/", icon: MessageCircle },
  ];

  // Add admin navigation if user is admin
  if (authUser && authUser.role === "admin") {
    navigation.push({ name: "Admin", href: "/admin", icon: Shield });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 navbar backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 ring-2 ring-[hsl(var(--primary))] ring-opacity-20">
                <img 
                  src={logoImage} 
                  alt="Wild By Nature Logo" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-display font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                Wild <span style={{ color: 'hsl(var(--primary))' }}>By</span> Nature
              </h1>
              <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>Photography Community</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {authUser && (
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary))]"
                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {authUser ? (
              <>
                {/* Desktop User Menu */}
                <div className="hidden md:flex items-center space-x-3">
                  <Link to="/profile">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[hsl(var(--primary)/0.3)]">
                        <img
                          src={authUser.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${authUser.fullName}`}
                          alt={authUser.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="hidden lg:inline text-sm font-medium">
                        {authUser.fullName}
                      </span>
                    </Button>
                  </Link>
                  
                  <Link to="/settings">
                    <Button variant="ghost" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Button variant="ghost" size="icon" onClick={logout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Join Community</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && authUser && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-wild-800/30 py-4"
            >
              <div className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "bg-nature-500/20 text-nature-400"
                          : "text-muted-foreground hover:text-foreground hover:bg-wild-800/30"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                <div className="border-t border-wild-800/30 pt-2 mt-2">
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-wild-800/30 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-wild-800/30 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-wild-800/30 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
