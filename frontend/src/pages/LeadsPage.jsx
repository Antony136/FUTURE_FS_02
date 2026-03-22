import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Trash2, Eye, Inbox, ChevronLeft, ChevronRight, X } from "lucide-react";
import toast from "react-hot-toast";
import { StatusBadge } from "./DashboardPage";

const LEADS_PER_PAGE = 10;

// ── Pagination controls ──────────────────────────────────────
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  // Show max 5 page buttons with ellipsis logic
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;
    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (currentPage >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Page <span className="font-semibold text-slate-700 dark:text-slate-300">{currentPage}</span> of{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-300">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10 dark:hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {getVisiblePages().map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm select-none">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                currentPage === page
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/25 dark:bg-cyan-500 dark:text-slate-900"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-violet-600 dark:hover:text-cyan-400"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10 dark:hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ── Status select overlay ────────────────────────────────────
const StatusSelect = ({ lead, onChange }) => (
  <div onClick={(e) => e.stopPropagation()} className="inline-block relative">
    <select
      value={lead.status}
      onChange={(e) => onChange(lead._id, e.target.value, e)}
      className="appearance-none opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
    >
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="converted">Converted</option>
    </select>
    <div className="flex items-center gap-1.5 group/badge">
      <StatusBadge status={lead.status} />
      <span className="text-[10px] text-slate-400 dark:text-slate-500 opacity-0 group-hover/badge:opacity-100 transition-opacity select-none">
        ▾
      </span>
    </div>
  </div>
);

// ── Main page ────────────────────────────────────────────────
const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data } = await API.get("/leads");
        setLeads(data);
      } catch {
        toast.error("Failed to load leads");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Filtered leads — memoized
  const filtered = useMemo(() => {
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
    return result;
  }, [leads, search, statusFilter]);

  // Paginated slice
  const totalPages = Math.ceil(filtered.length / LEADS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * LEADS_PER_PAGE,
    currentPage * LEADS_PER_PAGE
  );

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await API.delete(`/leads/${id}`);
      setLeads((prev) => prev.filter((l) => l._id !== id));
      toast.success("Lead deleted");
    } catch {
      toast.error("Failed to delete lead");
    }
  };

  const handleStatusChange = async (id, status, e) => {
    e.stopPropagation();
    try {
      const { data } = await API.patch(`/leads/${id}/status`, { status });
      setLeads((prev) =>
        prev.map((l) => (l._id === id ? (data.lead ?? data) : l))
      );
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const hasActiveFilters = search.trim() || statusFilter !== "all";

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // Status count pills for quick filter
  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    converted: leads.filter((l) => l.status === "converted").length,
  };

  const quickFilters = [
    { label: "All", value: "all", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700", active: "bg-slate-800 text-white dark:bg-white dark:text-slate-900" },
    { label: "New", value: "new", color: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300 hover:bg-violet-100", active: "bg-violet-600 text-white dark:bg-violet-500" },
    { label: "Contacted", value: "contacted", color: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300 hover:bg-orange-100", active: "bg-orange-500 text-white dark:bg-orange-500" },
    { label: "Converted", value: "converted", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 hover:bg-emerald-100", active: "bg-emerald-600 text-white dark:bg-emerald-500" },
  ];

  return (
    <div className="min-h-screen mesh-bg noise-overlay overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gradient-brand tracking-tight">
              Lead Management
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              {filtered.length} lead{filtered.length !== 1 ? "s" : ""}
              {hasActiveFilters && " matching filters"}
            </p>
          </motion.div>

          {/* Search + filter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
          >
            {/* Search */}
            <div className="relative group flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-500 dark:group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 dark:focus:border-cyan-500/50 transition-all shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status filter dropdown */}
            <div className="relative group sm:w-44">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-500 dark:group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 dark:focus:border-cyan-500/50 transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="all">All statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
              </select>
            </div>
          </motion.div>
        </div>

        {/* ── Quick filter pills ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-5 flex-wrap"
        >
          {quickFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                statusFilter === f.value ? f.active : f.color
              }`}
            >
              {f.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                statusFilter === f.value
                  ? "bg-white/20 text-white"
                  : "bg-black/8 dark:bg-white/10"
              }`}>
                {counts[f.value]}
              </span>
            </button>
          ))}

          {/* Clear filters */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-red-200 dark:border-red-500/20 transition-colors"
              >
                <X className="w-3 h-3" /> Clear filters
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80"
        >
          {loading ? (
            <div className="flex flex-col gap-3 p-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                  style={{ opacity: 1 - i * 0.12 }}
                />
              ))}
            </div>

          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Inbox className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-1">
                No leads found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-4">
                {hasActiveFilters
                  ? "No leads match your current filters."
                  : "No leads yet. Share your contact form to get started."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-violet-600 dark:text-cyan-400 hover:underline font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>

          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/50">
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Lead
                      </th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Source
                      </th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Notes
                      </th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Added
                      </th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginated.map((lead) => (
                      <tr
                        key={lead._id}
                        onClick={() => navigate(`/leads/${lead._id}`)}
                        className="hover:bg-violet-50/60 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group hover:shadow-[inset_3px_0_0_0_rgba(109,40,217,0.5)] dark:hover:shadow-[inset_3px_0_0_0_rgba(34,211,238,0.4)]"
                      >
                        {/* Lead info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/40 dark:to-indigo-900/40 flex items-center justify-center text-violet-700 dark:text-violet-300 font-bold text-sm shadow-inner flex-shrink-0">
                              {lead.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-violet-700 dark:group-hover:text-cyan-300 transition-colors truncate">
                                {lead.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {lead.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Source */}
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full capitalize">
                            {lead.source}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <StatusSelect lead={lead} onChange={handleStatusChange} />
                        </td>

                        {/* Notes count */}
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            lead.notes?.length > 0
                              ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                              : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                          }`}>
                            {lead.notes?.length || 0} note{lead.notes?.length !== 1 ? "s" : ""}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {formatDate(lead.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/leads/${lead._id}`);
                              }}
                              title="View details"
                              className="p-2 text-slate-400 hover:text-violet-600 dark:hover:text-cyan-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(lead._id, e)}
                              title="Delete lead"
                              className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Pagination ── */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </motion.div>

        {/* Results summary */}
        {!loading && filtered.length > 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-4">
            Showing {(currentPage - 1) * LEADS_PER_PAGE + 1}–
            {Math.min(currentPage * LEADS_PER_PAGE, filtered.length)} of{" "}
            {filtered.length} leads
          </p>
        )}
      </main>
    </div>
  );
};

export default LeadsPage;