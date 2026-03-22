import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Save, ArrowLeft, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
      )}
      {children}
    </div>
  </div>
);

const inputClass = (hasIcon = true) =>
  `w-full ${hasIcon ? "pl-10" : "pl-4"} pr-4 py-2.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/35 dark:focus:ring-cyan-500/35 focus:border-violet-500 dark:focus:border-cyan-500/60 transition-all`;

const ProfilePage = () => {
  const { admin, login } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await API.put("/auth/profile", {
        name: profileData.name,
        email: profileData.email,
      });
      // Update stored admin info
      const updated = { ...admin, name: data.name, email: data.email };
      login({ ...updated, token: localStorage.getItem("token") });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSavingPassword(true);
    try {
      await API.put("/auth/profile", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg noise-overlay">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-8 md:py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-cyan-400 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to dashboard
          </button>
          <h2 className="text-3xl font-extrabold text-gradient-brand tracking-tight">
            Profile & Settings
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your account details and password.
          </p>
        </motion.div>

        <div className="space-y-6">

          {/* ── Profile info card ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 md:p-8"
          >
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-violet-500/20 flex-shrink-0">
                {admin?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800 dark:text-white">
                  {admin?.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {admin?.email}
                </p>
                <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  {admin?.role || "admin"}
                </span>
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-5">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Personal info
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name" icon={User}>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Your name"
                    required
                    className={inputClass()}
                  />
                </Field>

                <Field label="Email address" icon={Mail}>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className={inputClass()}
                  />
                </Field>
              </div>

              <div className="flex justify-end pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={savingProfile}
                  className="btn-brand flex items-center gap-2 px-6 py-2.5 text-sm disabled:opacity-60 disabled:pointer-events-none"
                >
                  {savingProfile ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Save className="w-4 h-4" /> Save profile</>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* ── Change password card ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 md:p-8"
          >
            <form onSubmit={handlePasswordSave} className="space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Change password
                </h3>
              </div>

              <Field label="Current password" icon={Lock}>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  className={inputClass()}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="New password" icon={Lock}>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Min 6 characters"
                    required
                    className={inputClass()}
                  />
                </Field>

                <Field label="Confirm new password" icon={Lock}>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Repeat new password"
                    required
                    className={inputClass()}
                  />
                </Field>
              </div>

              {/* Password strength hint */}
              {passwordData.newPassword && (
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordData.newPassword.length >= i * 3
                          ? i <= 1 ? "bg-red-400"
                          : i <= 2 ? "bg-orange-400"
                          : i <= 3 ? "bg-yellow-400"
                          : "bg-emerald-500"
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-slate-400 ml-1">
                    {passwordData.newPassword.length < 4 ? "Weak"
                      : passwordData.newPassword.length < 7 ? "Fair"
                      : passwordData.newPassword.length < 10 ? "Good"
                      : "Strong"}
                  </span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={savingPassword}
                  className="btn-brand flex items-center gap-2 px-6 py-2.5 text-sm disabled:opacity-60 disabled:pointer-events-none"
                >
                  {savingPassword ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Lock className="w-4 h-4" /> Update password</>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* ── Danger zone ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6 md:p-8 border border-red-100 dark:border-red-500/10"
          >
            <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
              Danger zone
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              These actions are permanent and cannot be undone.
            </p>
            <button
              onClick={() => {
                if (window.confirm("Are you sure? All lead data will be lost.")) {
                  toast.error("Not implemented in demo mode.");
                }
              }}
              className="text-sm font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              Delete all leads
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;