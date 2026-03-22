import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { motion } from "framer-motion";
import { Users, UserPlus, PhoneCall, CheckCircle2, ChevronRight, TrendingUp } from "lucide-react";

const StatCard = ({ label, value, color, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="glass-card rounded-2xl p-6 relative overflow-hidden group"
  >
    {/* Decorative background blob */}
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ${color.bg}`} />
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 rounded-xl ${color.bg} ${color.text} shadow-sm`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{value}</p>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  </motion.div>
);

const DashboardPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data } = await API.get("/leads");
        setLeads(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const total = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const contacted = leads.filter((l) => l.status === "contacted").length;
  const converted = leads.filter((l) => l.status === "converted").length;
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Here's what's happening with your clients today.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard 
                label="Total Leads" 
                value={total} 
                icon={Users} 
                delay={0.1}
                color={{ bg: "bg-indigo-100 dark:bg-indigo-500/20", text: "text-indigo-600 dark:text-indigo-400" }} 
              />
              <StatCard 
                label="New" 
                value={newLeads} 
                icon={UserPlus} 
                delay={0.2}
                color={{ bg: "bg-blue-100 dark:bg-blue-500/20", text: "text-blue-600 dark:text-blue-400" }} 
              />
              <StatCard 
                label="Contacted" 
                value={contacted} 
                icon={PhoneCall} 
                delay={0.3}
                color={{ bg: "bg-orange-100 dark:bg-orange-500/20", text: "text-orange-600 dark:text-orange-400" }} 
              />
              <StatCard 
                label="Converted" 
                value={converted} 
                icon={CheckCircle2} 
                delay={0.4}
                color={{ bg: "bg-emerald-100 dark:bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400" }} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              {/* Conversion rate */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-1 glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Conversion Rate</h3>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Overall success metric</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <span className="text-5xl font-bold text-slate-800 dark:text-white">{conversionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${conversionRate}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Recent leads preview */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="lg:col-span-2 glass-card rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Leads</h3>
                  <button
                    onClick={() => navigate("/leads")}
                    className="group flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    View all
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="flex-1 p-2">
                  {leads.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400">
                      <Users className="w-12 h-12 mb-4 opacity-50" />
                      <p>No leads yet. Share your form to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {leads.slice(0, 5).map((lead, i) => (
                        <motion.div
                          key={lead._id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + i * 0.1 }}
                          onClick={() => navigate(`/leads/${lead._id}`)}
                          className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shadow-inner">
                              {lead.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{lead.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{lead.email}</p>
                            </div>
                          </div>
                          <StatusBadge status={lead.status} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    new: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30",
    contacted: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30",
    converted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30",
  };
  return (
    <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap ${styles[status]}`}>
      {status}
    </span>
  );
};

export default DashboardPage;