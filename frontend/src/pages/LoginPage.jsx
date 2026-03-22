import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, LogIn, Sparkles,
  CheckCircle2, TrendingUp, Users, Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { ThemeToggle } from "../components/ThemeToggle";

// ── Live stat ticker on the left panel ───────────────────────
const useTicker = (end, duration = 1800) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const t = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(t); }
      else setVal(start);
    }, 16);
    return () => clearInterval(t);
  }, [end, duration]);
  return val;
};

// ── Rotating feature text ─────────────────────────────────────
const FEATURES = [
  "Real-time pipeline analytics",
  "Instant lead status updates",
  "Follow-up notes on every lead",
  "Enterprise-grade data security",
  "Multi-source lead tracking",
];

const RotatingFeature = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % FEATURES.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="h-8 overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/90 text-base font-medium absolute"
        >
          {FEATURES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

// ── Mini pipeline visual ──────────────────────────────────────
const PipelinePreview = ({ total, contacted, converted }) => {
  const stages = [
    { label: "New", value: total - contacted - converted, color: "bg-violet-400" },
    { label: "Contacted", value: contacted, color: "bg-cyan-400" },
    { label: "Converted", value: converted, color: "bg-emerald-400" },
  ];
  const max = Math.max(total, 1);

  return (
    <div className="space-y-2.5">
      {stages.map((s) => (
        <div key={s.label} className="flex items-center gap-3">
          <span className="text-white/60 text-xs w-16 shrink-0">{s.label}</span>
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(s.value / max) * 100}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.8 }}
              className={`h-full rounded-full ${s.color}`}
            />
          </div>
          <span className="text-white/70 text-xs w-6 text-right shrink-0">{s.value}</span>
        </div>
      ))}
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────
const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  // Live stats from backend
  const [stats, setStats] = useState({ total: 0, contacted: 0, converted: 0 });
  useEffect(() => {
    API.get("/leads/count")
      .then(({ data }) => setStats(data))
      .catch(() => {});
  }, []);

  const totalTick    = useTicker(stats.total,     1600);
  const convertedTick = useTicker(stats.converted, 1800);
  const rateTick     = useTicker(
    stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0,
    2000
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", formData);
      login(data);
      toast.success("Welcome back, Admin!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-[#f0f2f8] dark:bg-[#07070d]">

      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex flex-col w-[52%] relative p-12 justify-between isolate overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-indigo-600 to-cyan-600 z-0" />
        <div className="absolute inset-0 opacity-[0.07] z-0"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }}
        />
        <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-violet-400/25 blur-[130px] animate-aurora z-0" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full bg-cyan-400/25 blur-[120px] animate-aurora z-0 [animation-delay:-5s]" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 flex items-center gap-2.5 cursor-pointer w-fit"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white drop-shadow">
            Mini CRM
          </span>
        </motion.div>

        {/* Middle content */}
        <div className="relative z-10 space-y-10">

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h1 className="text-5xl font-extrabold text-white leading-[1.12] tracking-tight mb-4">
              Manage smarter. <br />
              <span className="text-cyan-300 drop-shadow-sm">Close faster.</span>
            </h1>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
              <Zap className="w-3.5 h-3.5 text-cyan-300" />
              <span>Currently active feature</span>
            </div>
            <RotatingFeature />
          </motion.div>

          {/* Live stats cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { icon: <Users className="w-4 h-4" />, label: "Total leads", value: totalTick },
              { icon: <TrendingUp className="w-4 h-4" />, label: "Converted", value: convertedTick },
              { icon: <CheckCircle2 className="w-4 h-4" />, label: "Conv. rate", value: `${rateTick}%` },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4"
              >
                <div className="flex items-center gap-1.5 text-white/60 text-xs mb-2">
                  {s.icon}
                  <span>{s.label}</span>
                </div>
                <p className="text-2xl font-extrabold text-white tracking-tight">{s.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Pipeline preview */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5"
          >
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold mb-4">
              Live pipeline
            </p>
            <PipelinePreview
              total={stats.total}
              contacted={stats.contacted}
              converted={stats.converted}
            />
          </motion.div>
        </div>

        {/* Bottom checklist */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="relative z-10 flex flex-wrap gap-3"
        >
          {["JWT secured", "Role based access", "Real-time updates", "MongoDB backed"].map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 text-xs font-semibold text-white/80 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Right panel — login form ── */}
      <div className="w-full lg:w-[48%] flex items-center justify-center p-6 relative">

        {/* Theme toggle */}
        <div className="absolute top-5 right-5 z-20">
          <ThemeToggle />
        </div>

        {/* Mobile mesh bg */}
        <div className="lg:hidden absolute inset-0 mesh-bg noise-overlay -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >

          {/* Mobile logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            className="flex lg:hidden items-center gap-2 mb-8"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gradient-brand">Mini CRM</span>
          </motion.div>

          {/* Header */}
          <div className="mb-9">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Admin Portal
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Sign in to access your lead dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
                  focused === "email"
                    ? "text-violet-600 dark:text-cyan-400"
                    : "text-slate-400"
                }`}>
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  required
                  placeholder="admin@minicrm.com"
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/35 dark:focus:ring-cyan-500/35 focus:border-violet-500 dark:focus:border-cyan-500/60 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
                  focused === "password"
                    ? "text-violet-600 dark:text-cyan-400"
                    : "text-slate-400"
                }`}>
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/35 dark:focus:ring-cyan-500/35 focus:border-violet-500 dark:focus:border-cyan-500/60 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-violet-600 focus:ring-violet-500 dark:bg-slate-900 accent-violet-600"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm font-semibold text-violet-600 dark:text-cyan-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-brand w-full flex items-center justify-center gap-2.5 py-3.5 mt-2 disabled:opacity-60 disabled:pointer-events-none text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In to Dashboard
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-[#f0f2f8] dark:bg-[#07070d] text-xs text-slate-400 dark:text-slate-600 font-medium">
                secured access only
              </span>
            </div>
          </div>

          {/* Security badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {["JWT Auth", "Bcrypt passwords", "Admin only"].map((badge) => (
              <span
                key={badge}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 px-3 py-1.5 rounded-full"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                {badge}
              </span>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-8">
            © {new Date().getFullYear()} Mini CRM — Built to manage real clients.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;