import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Mail, Phone, Calendar, RefreshCw, Send, MessageSquarePlus, Activity } from "lucide-react";
import toast from "react-hot-toast";
import { StatusBadge } from "./DashboardPage";

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const { data } = await API.get(`/leads/${id}`);
        setLead(data);
      } catch (err) {
        setError("Lead not found.");
        toast.error("Lead not found");
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  const handleStatusChange = async (e) => {
    const status = e.target.value;
    setUpdatingStatus(true);
    try {
      const { data } = await API.patch(`/leads/${id}/status`, { status });
      setLead(data.lead ?? data);
      toast.success("Status updated to " + status);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setAddingNote(true);
    try {
      const { data } = await API.patch(`/leads/${id}/notes`, {
        text: noteText,
      });
      setLead(data.lead ?? data);
      setNoteText("");
      toast.success("Note added");
    } catch (err) {
      toast.error("Failed to add note");
    } finally {
      setAddingNote(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg noise-overlay">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="md:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen mesh-bg noise-overlay">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{error}</h2>
          <button
            onClick={() => navigate("/leads")}
            className="text-violet-600 dark:text-cyan-400 hover:underline font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to leads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg noise-overlay overflow-x-hidden pb-12">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Navigation */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <button
            onClick={() => navigate("/leads")}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-cyan-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Leads
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Info & Status */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 flex flex-col gap-6"
          >
            {/* Profile Card */}
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="glass-card rounded-2xl p-6 shadow-xl shadow-violet-500/5 dark:shadow-none border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden transition-shadow hover:shadow-violet-500/10 dark:hover:shadow-cyan-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50/90 to-cyan-50/40 dark:from-violet-900/15 dark:to-cyan-900/10 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg ring-2 ring-white/25 dark:ring-slate-900/50">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <StatusBadge status={lead.status} />
                </div>

                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                  {lead.name}
                </h2>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Email</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 break-all">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Phone</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{lead.phone || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Activity className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Source</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 capitalize">{lead.source}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Created</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{formatDate(lead.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="glass-card rounded-2xl p-6 shadow-lg border border-slate-200/80 dark:border-slate-800/80"
            >
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className={`w-5 h-5 text-violet-600 dark:text-cyan-400 ${updatingStatus ? "animate-spin" : ""}`} />
                <h3 className="font-semibold text-slate-800 dark:text-white">Update Status</h3>
              </div>
              
              <div className="relative">
                <select
                  value={lead.status}
                  onChange={handleStatusChange}
                  disabled={updatingStatus}
                  className="w-full appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/45 dark:focus:ring-cyan-500/40 cursor-pointer disabled:opacity-50 transition-all shadow-sm"
                >
                  <option value="new">🆕 New Lead</option>
                  <option value="contacted">📞 Contacted</option>
                  <option value="converted">✅ Converted</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  {updatingStatus ? (
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-violet-500 dark:border-t-cyan-400 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  )}
                </div>
              </div>
            </motion.div>
            
          </motion.div>


          {/* Right Column: Timeline & Notes */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 flex flex-col h-[calc(100vh-140px)] min-h-[500px]"
          >
            <div className="glass-card rounded-2xl shadow-xl shadow-violet-500/5 dark:shadow-none border border-slate-200/80 dark:border-slate-800/80 flex flex-col h-full overflow-hidden transition-shadow hover:shadow-2xl hover:shadow-violet-500/10 dark:hover:shadow-cyan-500/5">
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquarePlus className="w-5 h-5 text-violet-600 dark:text-cyan-400" />
                  <h3 className="font-semibold text-slate-800 dark:text-white">Notes Timeline</h3>
                </div>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-3 py-1 rounded-full">
                  {lead.notes.length} entries
                </span>
              </div>

              {/* Chat/Timeline Area */}
              <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/20 relative">
                {lead.notes.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm mb-4">
                      <MessageSquarePlus className="w-8 h-8 text-blue-400 opacity-80" />
                    </div>
                    <p className="font-medium text-slate-600 dark:text-slate-300">No notes yet</p>
                    <p className="text-sm mt-1 max-w-xs">Record your first interaction or follow-up task below.</p>
                  </div>
                ) : (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                    <AnimatePresence>
                      {[...lead.notes].reverse().map((note, idx) => (
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          layout
                          key={note._id}
                          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                        >
                          {/* Timeline Dot */}
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                            <span className="text-xs font-bold">{[...lead.notes].length - idx}</span>
                          </div>
                          
                          {/* Card */}
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700/50 relative">
                            {/* Speech bubble arrow */}
                            <div className="absolute top-4 -left-2 w-4 h-4 bg-white dark:bg-slate-800 border-l border-t border-slate-100 dark:border-slate-700/50 rotate-[-45deg] md:group-even:hidden"></div>
                            <div className="absolute top-4 -right-2 w-4 h-4 bg-white dark:bg-slate-800 border-r border-b border-slate-100 dark:border-slate-700/50 rotate-[-45deg] hidden md:group-even:block"></div>
                            
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
                              {note.text}
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium">
                              {formatDate(note.createdAt)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 z-20">
                <div className="relative">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddNote();
                      }
                    }}
                    placeholder="Type a follow-up note... (Press Enter to save)"
                    className="w-full pl-4 pr-16 py-3 min-h-[56px] max-h-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/45 dark:focus:ring-cyan-500/40 focus:bg-white dark:focus:bg-slate-800 dark:text-white transition-all resize-y shadow-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddNote}
                    disabled={addingNote || !noteText.trim()}
                    className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-gradient-to-br from-violet-600 to-cyan-600 hover:brightness-110 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg transition-all shadow-md"
                  >
                    {addingNote ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 ml-0.5" />
                    )}
                  </motion.button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LeadDetailPage;