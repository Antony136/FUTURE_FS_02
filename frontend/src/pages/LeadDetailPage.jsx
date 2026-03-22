import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

const StatusBadge = ({ status }) => {
  const styles = {
    new: "bg-blue-50 text-blue-600",
    contacted: "bg-yellow-50 text-yellow-600",
    converted: "bg-green-50 text-green-600",
  };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
    } finally {
      setAddingNote(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center text-gray-400 text-sm mt-20">Loading lead...</p>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center mt-20">
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => navigate("/leads")}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to leads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate("/leads")}
          className="text-sm text-gray-500 hover:text-blue-600 mb-6 flex items-center gap-1 transition-colors"
        >
          ← Back to leads
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left column — Lead info */}
          <div className="md:col-span-1 space-y-4">

            {/* Lead card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">{lead.name}</h2>
                <StatusBadge status={lead.status} />
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Email</p>
                  <p className="text-gray-700">{lead.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                  <p className="text-gray-700">{lead.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Source</p>
                  <p className="text-gray-700">{lead.source}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Added on</p>
                  <p className="text-gray-700">{formatDate(lead.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Last updated</p>
                  <p className="text-gray-700">{formatDate(lead.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Status update card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Update status
              </p>
              <select
                value={lead.status}
                onChange={handleStatusChange}
                disabled={updatingStatus}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
              </select>
              {updatingStatus && (
                <p className="text-xs text-gray-400 mt-2">Updating...</p>
              )}
            </div>

          </div>

          {/* Right column — Notes */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Notes & follow-ups
                <span className="ml-2 text-xs font-normal text-gray-400">
                  {lead.notes.length} note{lead.notes.length !== 1 ? "s" : ""}
                </span>
              </h3>

              {/* Add note input */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  placeholder="Add a follow-up note..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddNote}
                  disabled={addingNote || !noteText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm px-4 py-2.5 rounded-lg transition-colors"
                >
                  {addingNote ? "Adding..." : "Add"}
                </button>
              </div>

              {/* Notes list */}
              {lead.notes.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-sm">No notes yet.</p>
                  <p className="text-xs mt-1">
                    Add your first follow-up note above.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...lead.notes].reverse().map((note) => (
                    <div
                      key={note._id}
                      className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                    >
                      <p className="text-sm text-gray-700">{note.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(note.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LeadDetailPage;