import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, LayoutDashboard, Users,
  Menu, X, Settings,
} from "lucide-react";
import { cn } from "../lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Leads",     path: "/leads",     icon: Users },
  ];

  return (
    <nav className="sticky top-0 z-50 glass w-full border-b border-slate-200/60 dark:border-slate-800/80 backdrop-blur-xl px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-sm shadow-slate-900/[0.03] dark:shadow-black/20">

      {/* ── Left: logo + nav links ── */}
      <div className="flex items-center gap-6 md:gap-8">

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 opacity-40 blur-md group-hover:opacity-60 transition-opacity" />
            <div className="relative bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
              <Users className="w-5 h-5 text-white drop-shadow-sm" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-gradient-brand tracking-tight">
            Mini CRM
          </h1>
        </motion.div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;
            return (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200",
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

      {/* ── Right: theme toggle + profile ── */}
      <div className="hidden md:flex items-center gap-3">
        <ThemeToggle />

        <div className="w-px h-7 bg-slate-200/90 dark:bg-slate-700/80" />

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white/30 dark:ring-slate-900/50 flex-shrink-0">
              {admin?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
              {admin?.name}
            </span>
            <svg
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          <AnimatePresence>
            {profileMenuOpen && (
              <>
                {/* Click outside to close */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 top-full mt-2 w-52 glass-card rounded-2xl p-1.5 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 z-50 border border-slate-200 dark:border-slate-700/60"
                >
                  {/* User info header */}
                  <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                      {admin?.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {admin?.email}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
                      {admin?.role || "admin"}
                    </span>
                  </div>

                  {/* Profile link */}
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-violet-700 dark:hover:text-cyan-400 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Profile & settings
                  </button>

                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                  {/* Logout */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile: theme toggle + hamburger ── */}
      <div className="flex md:hidden items-center gap-2">
        <ThemeToggle size="sm" />
        <button
          className="p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full glass-card border-b border-slate-200/70 dark:border-slate-800 p-4 flex flex-col gap-1 md:hidden shadow-2xl"
          >
            {/* Nav links */}
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <button
                  key={link.name}
                  onClick={() => {
                    navigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                    isActive
                      ? "text-violet-700 dark:text-cyan-300 bg-violet-50 dark:bg-cyan-500/10"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/90 dark:hover:bg-slate-800/90"
                  )}
                >
                  <link.icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-violet-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400"
                  )} />
                  {link.name}
                </button>
              );
            })}

            <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />

            {/* Profile link */}
            <button
              onClick={() => {
                navigate("/profile");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100/90 dark:hover:bg-slate-800/90 transition-colors"
            >
              <Settings className="w-5 h-5 text-violet-600 dark:text-cyan-400" />
              Profile & settings
            </button>

            <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />

            {/* User info + logout */}
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {admin?.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[140px]">
                    {admin?.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                    {admin?.email}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
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