import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, KeyRound, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { ThemeToggle } from "../components/ThemeToggle";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const testimonials = [
    "Nexus CRM transformed how we manage leads.",
    "Lightning fast and incredibly intuitive.",
    "The best investment for our sales pipeline."
  ];

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-slate-50 dark:bg-[#07070d] selection:bg-violet-500/30">
      
      {/* Left Panel: Branding & Marketing (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col relative w-1/2 p-12 justify-between isolate overflow-hidden">
        {/* Animated Aurora Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 z-0" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay" />
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] max-w-[800px] h-[60vw] max-h-[800px] rounded-full bg-violet-400/30 blur-[120px] animate-aurora z-0" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] max-w-[800px] h-[60vw] max-h-[800px] rounded-full bg-cyan-400/30 blur-[120px] animate-aurora [animation-delay:-5s] z-0" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-16 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold shadow-lg border border-white/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white drop-shadow-md">
              Nexus CRM
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-extrabold text-white leading-[1.15] tracking-tight mb-8"
          >
            Manage smarter. <br />
            Close faster.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-5"
          >
            {["Real-time pipeline analytics", "Intuitive drag-and-drop interface", "Enterprise-grade data security"].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-medium">{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 glass-card bg-white/10 dark:bg-black/20 border-white/20 rounded-2xl p-6 backdrop-blur-xl"
        >
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-300 to-violet-300 shrink-0 border-2 border-white/50" />
            <div>
              <p className="text-white font-medium text-lg leading-snug">"{testimonials[0]}"</p>
              <p className="text-white/70 text-sm mt-1">— Sarah Jenkins, VP of Sales</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
          <ThemeToggle />
        </div>

        {/* Mobile-only background meshes */}
        <div className="lg:hidden absolute inset-0 mesh-bg noise-overlay -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="mb-10 lg:mb-12">
            <motion.div
              initial={{ rotate: -18, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
              className="inline-flex lg:hidden items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 shadow-xl mb-6 relative"
            >
              <KeyRound className="w-7 h-7 text-white relative z-10" />
            </motion.div>

            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Admin Portal
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 dark:group-focus-within:text-cyan-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@minicrm.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-violet-500/40 dark:focus:ring-cyan-500/40 focus:border-violet-500 dark:focus:border-cyan-500 dark:text-white transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 dark:group-focus-within:text-cyan-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-violet-500/40 dark:focus:ring-cyan-500/40 focus:border-violet-500 dark:focus:border-cyan-500 dark:text-white transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900" />
                <label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400 font-medium cursor-pointer">Remember me</label>
              </div>
              <a href="#" className="text-sm font-semibold text-violet-600 dark:text-cyan-400 hover:underline">Forgot password?</a>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="btn-brand w-full flex items-center justify-center gap-2 py-4 rounded-xl disabled:opacity-70 disabled:pointer-events-none mt-4 text-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In System
                </>
              )}
            </motion.button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
              Don't have an account?{" "}
              <a href="#" className="font-semibold text-violet-600 dark:text-cyan-400 hover:underline">
                Contact your admin
              </a>
            </p>
          </form>
        </motion.div>
      </div>

    </div>
  );
};

export default LoginPage;
