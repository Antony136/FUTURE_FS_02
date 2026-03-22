import { useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Globe, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";
import { ThemeToggle } from "../components/ThemeToggle";

const PublicNavbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/60 dark:border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2.5 cursor-default"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 opacity-35 blur-md" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight text-gradient-brand">
            Nexus CRM
          </span>
        </motion.div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
            className="text-sm font-semibold text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-600/60 bg-white/50 dark:bg-slate-800/50 hover:border-violet-400/50 dark:hover:border-cyan-500/40 hover:shadow-md transition-all"
          >
            Admin Login
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

// Removed FloatingStack

const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "Website",
  });
  const [submitting, setSubmitting] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 280, damping: 28 });
  const springY = useSpring(my, { stiffness: 280, damping: 28 });
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${springX}px ${springY}px, rgba(124, 58, 237, 0.12), transparent 55%)`;

  const handleMouse = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Name and Email are required");
      return;
    }

    setSubmitting(true);
    try {
      await API.post("/leads", formData);
      toast.success("Thank you! We'll be in touch soon.");
      setFormData({ name: "", email: "", phone: "", source: "Website" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: "Secure Data",
      desc: "Enterprise-grade security for your pipeline.",
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: "Lightning Fast",
      desc: "Optimized flows that feel instant.",
    },
    {
      icon: <Globe className="w-6 h-6 text-cyan-500" />,
      title: "Global Reach",
      desc: "Collaborate across regions without friction.",
    },
  ];

  return (
    <div className="min-h-screen mesh-bg noise-overlay text-slate-900 dark:text-white font-sans selection:bg-violet-500/30">
      <PublicNavbar />

      <section className="relative pt-28 pb-16 md:pt-40 md:pb-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[10%] w-[420px] h-[420px] rounded-full bg-violet-500/20 blur-[100px] animate-aurora" />
          <div className="absolute bottom-10 right-[5%] w-[380px] h-[380px] rounded-full bg-cyan-500/15 blur-[90px] animate-aurora [animation-delay:-6s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,720px)] h-[min(90vw,720px)] rounded-full border border-violet-500/10 animate-spin-slow opacity-40" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/20 text-violet-700 dark:text-violet-200 text-sm font-semibold mb-6 glow-ring"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              Now accepting new clients
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.08] text-slate-900 dark:text-white">
              Scale Your Business <br />
              With{" "}
              <span className="text-gradient-brand drop-shadow-sm">
                Intelligent
              </span>{" "}
              CRM
            </h1>

            <p className="text-lg text-slate-700 dark:text-slate-400 mb-10 max-w-lg leading-relaxed font-medium">
              Manage leads, nurture relationships, and close faster — with a
              workspace that feels as premium as your brand.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="group relative rounded-2xl p-4 border border-slate-200/70 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md shadow-lg shadow-slate-900/5 dark:shadow-black/30 overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10" />
                  <div className="relative flex flex-col gap-2">
                    <div className="w-11 h-11 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                      {f.icon}
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                      {f.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="relative w-full max-w-xl mx-auto lg:max-w-none flex flex-col xl:flex-row items-center justify-center gap-10 xl:gap-12 xl:justify-end">
            <motion.div
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md shrink-0 xl:mr-20"
            >
              <div
                onMouseMove={handleMouse}
                className="relative tilt-3d rounded-[1.75rem] p-[1px] bg-gradient-to-br from-violet-500/40 via-white/50 to-cyan-400/40 dark:from-violet-500/30 dark:via-slate-700/40 dark:to-cyan-400/25 shadow-2xl"
              >
                <motion.div
                  className="relative rounded-[1.7rem] overflow-hidden glass-card shadow-inner"
                  style={{ backgroundImage: spotlight }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-cyan-500/10 pointer-events-none" />
                  <div className="relative p-8">
                    <div className="mb-8 text-center">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Get Started Today
                      </h2>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-2">
                        We&apos;ll reach out within 24 hours.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-white/90 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-white/90 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                          placeholder="john@company.com"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-white/90 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                          How did you hear about us?
                        </label>
                        <select
                          value={formData.source}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              source: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white/90 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-violet-500/50 appearance-none cursor-pointer text-slate-900 dark:text-white"
                        >
                          <option value="Website">Website Direct</option>
                          <option value="Social Media">Social Media</option>
                          <option value="Referral">Referral</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={submitting}
                        className="btn-brand w-full py-3.5 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:pointer-events-none text-base"
                      >
                        {submitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Request Demo <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/70 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md py-10 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>
          © {new Date().getFullYear()} Nexus CRM. Crafted for clarity and
          conversion.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
