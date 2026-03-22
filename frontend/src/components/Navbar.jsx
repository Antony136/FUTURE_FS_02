import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, LayoutDashboard, Users, Menu, X } from "lucide-react";
import { cn } from "../lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Leads", path: "/leads", icon: Users },
  ];

  return (
    <nav className="sticky top-0 z-50 glass w-full border-b border-slate-200/60 dark:border-slate-800/80 backdrop-blur-xl px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-sm shadow-slate-900/[0.03] dark:shadow-black/20">
      <div className="flex items-center gap-6 md:gap-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 opacity-40 blur-md group-hover:opacity-60 transition-opacity" />
            <div className="relative bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow preserve-3d">
              <Users className="w-5 h-5 text-white drop-shadow-sm" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-gradient-brand tracking-tight">
            Mini CRM
          </h1>
        </motion.div>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;
            return (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300",
                  isActive
                    ? "text-violet-700 dark:text-cyan-300 bg-violet-50/90 dark:bg-cyan-500/10"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                )}
              >
                <Icon className="w-4 h-4" />
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 rounded-xl border border-violet-200/60 dark:border-cyan-500/25 pointer-events-none"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3">
        <ThemeToggle />

        <div className="w-px h-7 bg-slate-200/90 dark:bg-slate-700/80" />

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white/30 dark:ring-slate-900/50">
            {admin?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[140px] truncate">
            {admin?.name}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="p-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 rounded-xl transition-colors ml-1"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="flex md:hidden items-center gap-2">
        <ThemeToggle size="sm" />
        <button
          className="p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full glass-card border-b border-slate-200/70 dark:border-slate-800 p-4 flex flex-col gap-1 md:hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100/90 dark:hover:bg-slate-800/90"
              >
                <link.icon className="w-5 h-5 text-violet-600 dark:text-cyan-400" />
                {link.name}
              </button>
            ))}
            <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                  {admin?.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {admin?.name}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 mt-1"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
