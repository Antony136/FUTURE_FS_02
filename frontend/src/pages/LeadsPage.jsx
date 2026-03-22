import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Trash2, Eye, Inbox } from "lucide-react";
import toast from "react-hot-toast";
import { StatusBadge } from "./DashboardPage";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data } = await API.get("/leads");
        setLeads(data);
        setFiltered(data);
      } catch (err) {
        toast.error("Failed to load leads");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // Search + filter logic
  useEffect(() => {
    let result = leads;

    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [search, statusFilter, leads]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await API.delete(`/leads/${id}`);
      setLeads((prev) => prev.filter((l) => l._id !== id));
      toast.success("Lead deleted");
    } catch (err) {
      toast.error("Failed to delete lead");
    }
  };

  const handleStatusChange = async (id, status, e) => {
    e.stopPropagation();
    try {
      const { data } = await API.patch(`/leads/${id}/status`, { status });
      setLeads((prev) =>
        prev.map((l) => (l._id === id ? data.lead ?? data : l))
      );
      toast.success("Status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen mesh-bg noise-overlay overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gradient-brand tracking-tight">
              Lead Management
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Showing {filtered.length} lead{filtered.length !== 1 ? "s" : ""}
            </p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
          >
            <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-500 dark:group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/90 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/45 dark:focus:ring-cyan-500/40 focus:border-violet-400 dark:focus:border-cyan-500/50 dark:text-white transition-all shadow-sm"
              />
            </div>
            <div className="relative group sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-500 dark:group-focus-within:text-cyan-400 transition-colors" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-white/90 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/45 dark:focus:ring-cyan-500/40 focus:border-violet-400 dark:focus:border-cyan-500/50 dark:text-white transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
              </select>
            </div>
          </motion.div>
        </div>

        {/* Table Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/5 dark:shadow-none border border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 hover:shadow-[0_24px_60px_-12px_rgba(109,40,217,0.12)] dark:hover:shadow-[0_24px_60px_-12px_rgba(34,211,238,0.08)]"
        >
          {loading ? (
            <div className="flex flex-col gap-4 p-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">No leads found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
                {search || statusFilter !== "all" 
                  ? "We couldn't find any leads matching your current filters. Try adjusting them." 
                  : "You don't have any leads yet. Share your contact form to get started."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Lead Info</th>
                    <th className="px-6 py-4 font-semibold">Source</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Added</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <AnimatePresence>
                    {filtered.map((lead, index) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        key={lead._id}
                        onClick={() => navigate(`/leads/${lead._id}`)}
                        className="hover:bg-slate-50/95 dark:hover:bg-slate-800/55 cursor-pointer transition-all duration-200 group hover:shadow-[inset_3px_0_0_0_rgba(109,40,217,0.45)] dark:hover:shadow-[inset_3px_0_0_0_rgba(34,211,238,0.4)]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shadow-inner">
                              {lead.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {lead.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {lead.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 capitalize">
                          {lead.source}
                        </td>

                        <td className="px-6 py-4">
                          <div onClick={(e) => e.stopPropagation()} className="inline-block relative">
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead._id, e.target.value, e)}
                              className="appearance-none opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="converted">Converted</option>
                            </select>
                            <StatusBadge status={lead.status} />
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                          {formatDate(lead.createdAt)}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/leads/${lead._id}`);
                              }}
                              className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10 dark:hover:text-cyan-400 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(lead._id, e)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 rounded-lg transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default LeadsPage;