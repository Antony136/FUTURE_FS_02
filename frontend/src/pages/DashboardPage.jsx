import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

const StatCard = ({ label, value, color }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 p-6 shadow-sm`}>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Overview of all your leads</p>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <StatCard label="Total leads" value={total} color="text-gray-800" />
              <StatCard label="New" value={newLeads} color="text-blue-600" />
              <StatCard label="Contacted" value={contacted} color="text-yellow-500" />
              <StatCard label="Converted" value={converted} color="text-green-600" />
            </div>

            {/* Conversion rate bar */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-medium text-gray-700">Conversion rate</p>
                <p className="text-sm font-bold text-green-600">{conversionRate}%</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all"
                  style={{ width: `${conversionRate}%` }}
                />
              </div>
            </div>

            {/* Recent leads preview */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">Recent leads</h3>
                <button
                  onClick={() => navigate("/leads")}
                  className="text-xs text-blue-600 hover:underline"
                >
                  View all
                </button>
              </div>

              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead._id}
                  onClick={() => navigate(`/leads/${lead._id}`)}
                  className="flex items-center justify-between px-6 py-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{lead.name}</p>
                    <p className="text-xs text-gray-400">{lead.email}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
              ))}

              {leads.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">
                  No leads yet. Share your contact form to get started.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

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

export default DashboardPage;