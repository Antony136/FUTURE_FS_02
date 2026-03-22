import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        console.error(err);
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
    e.stopPropagation(); // prevent row click
    if (!window.confirm("Delete this lead?")) return;
    try {
      await API.delete(`/leads/${id}`);
      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status, e) => {
    e.stopPropagation(); // prevent row click
    try {
      const { data } = await API.patch(`/leads/${id}/status`, { status });
      setLeads((prev) =>
        prev.map((l) => (l._id === id ? data.lead ?? data : l))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
            <p className="text-sm text-gray-500 mt-1">
              {filtered.length} lead{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-12">Loading leads...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">
              No leads found.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Source</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Added</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((lead) => (
                  <tr
                    key={lead._id}
                    onClick={() => navigate(`/leads/${lead._id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {/* Name */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{lead.name}</p>
                      <p className="text-xs text-gray-400">{lead.phone || "No phone"}</p>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-600">{lead.email}</td>

                    {/* Source */}
                    <td className="px-6 py-4 text-gray-500">{lead.source}</td>

                    {/* Status dropdown */}
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead._id, e.target.value, e)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500
                          ${lead.status === "new" ? "bg-blue-50 text-blue-600" : ""}
                          ${lead.status === "contacted" ? "bg-yellow-50 text-yellow-600" : ""}
                          ${lead.status === "converted" ? "bg-green-50 text-green-600" : ""}
                        `}
                      >
                        <option value="new">new</option>
                        <option value="contacted">contacted</option>
                        <option value="converted">converted</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {formatDate(lead.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/leads/${lead._id}`);
                          }}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={(e) => handleDelete(lead._id, e)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadsPage;