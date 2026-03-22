import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { motion } from "framer-motion";
import {
  Users, UserPlus, PhoneCall, CheckCircle2,
  ChevronRight, TrendingUp, Activity,
} from "lucide-react";
import {
  AreaChart, Area,
  LineChart, Line,
  BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  FunnelChart, Funnel, LabelList,
  ResponsiveContainer,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend,
  Cell,
} from "recharts";

// ─── Constants ───────────────────────────────────────────────

const STATUS_COLORS = {
  new: "#7c3aed",
  contacted: "#f97316",
  converted: "#10b981",
};

const MONTHS_SHOWN = 6;

// ─── Data helpers ─────────────────────────────────────────────

const formatMonth = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    month: "short",
    year: "2-digit",
  });

// Sorted unique months from leads
const getSortedMonths = (leads) => {
  const set = new Set(leads.map((l) => formatMonth(l.createdAt)));
  return [...set].slice(-MONTHS_SHOWN);
};

// Cumulative total leads by month
const getCumulativeData = (leads) => {
  const map = {};
  leads.forEach((l) => {
    const key = formatMonth(l.createdAt);
    map[key] = (map[key] || 0) + 1;
  });
  let running = 0;
  return Object.entries(map)
    .slice(-MONTHS_SHOWN)
    .map(([month, count]) => {
      running += count;
      return { month, total: running, new: count };
    });
};

// Monthly conversion % trend
const getConversionTrend = (leads) => {
  const map = {};
  leads.forEach((l) => {
    const key = formatMonth(l.createdAt);
    if (!map[key]) map[key] = { total: 0, converted: 0 };
    map[key].total += 1;
    if (l.status === "converted") map[key].converted += 1;
  });
  return Object.entries(map)
    .slice(-MONTHS_SHOWN)
    .map(([month, d]) => ({
      month,
      rate: d.total > 0 ? Math.round((d.converted / d.total) * 100) : 0,
    }));
};

// Multi-line: new, contacted, converted per month
const getMultiLineTrend = (leads) => {
  const map = {};
  leads.forEach((l) => {
    const key = formatMonth(l.createdAt);
    if (!map[key]) map[key] = { month: key, new: 0, contacted: 0, converted: 0 };
    map[key][l.status] += 1;
  });
  return Object.values(map).slice(-MONTHS_SHOWN);
};

// Funnel data
const getFunnelData = (total, contacted, converted) => [
  { name: "Total leads", value: total, fill: "#7c3aed" },
  { name: "Contacted", value: contacted, fill: "#f97316" },
  { name: "Converted", value: converted, fill: "#10b981" },
];

// Radar data
const getRadarData = (total, contacted, converted, notes, sources) => {
  const max = Math.max(total, 1);
  return [
    { metric: "Total leads", value: Math.round((total / max) * 100) },
    { metric: "Contacted", value: total > 0 ? Math.round((contacted / total) * 100) : 0 },
    { metric: "Converted", value: total > 0 ? Math.round((converted / total) * 100) : 0 },
    { metric: "Follow-ups", value: Math.min(notes * 10, 100) },
    { metric: "Sources", value: Math.min(sources * 20, 100) },
  ];
};

// Sparkline data per stat (last 6 months count)
const getSparkline = (leads, filterFn) => {
  const map = {};
  leads.filter(filterFn).forEach((l) => {
    const key = formatMonth(l.createdAt);
    map[key] = (map[key] || 0) + 1;
  });
  return getSortedMonths(leads).map((m) => ({ v: map[m] || 0 }));
};

// Timeline — last 8 events across all leads
const getTimeline = (leads) => {
  const events = [];
  leads.forEach((lead) => {
    events.push({
      id: `${lead._id}-created`,
      type: "created",
      label: `${lead.name} submitted a lead`,
      time: new Date(lead.createdAt),
      color: "bg-violet-500",
    });
    lead.notes?.forEach((note) => {
      events.push({
        id: note._id,
        type: "note",
        label: `Note on ${lead.name}: "${note.text.slice(0, 40)}${note.text.length > 40 ? "…" : ""}"`,
        time: new Date(note.createdAt),
        color: "bg-cyan-500",
      });
    });
  });
  return events
    .sort((a, b) => b.time - a.time)
    .slice(0, 8);
};

// ─── Shared UI components ─────────────────────────────────────

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-xl text-sm">
      {label && (
        <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">{label}</p>
      )}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}:{" "}
          <span className="font-bold">
            {p.value}{p.name === "Conversion %" ? "%" : ""}
          </span>
        </p>
      ))}
    </div>
  );
};

const ChartCard = ({ title, subtitle, children, delay = 0, span = 1, minH = 260 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45 }}
    className={`glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50
      ${span === 2 ? "lg:col-span-2" : span === 3 ? "lg:col-span-3" : "lg:col-span-1"}`}
    style={{ minHeight: minH }}
  >
    <p className="text-base font-semibold text-slate-800 dark:text-white mb-0.5">{title}</p>
    <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">{subtitle}</p>
    {children}
  </motion.div>
);

const Empty = ({ text = "Not enough data yet." }) => (
  <div className="flex items-center justify-center h-40">
    <p className="text-sm text-slate-400">{text}</p>
  </div>
);

// Sparkline inside stat card
const Sparkline = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={40}>
    <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.3} />
          <stop offset="95%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey="v"
        stroke={color}
        strokeWidth={1.5}
        fill={`url(#sg-${color})`}
        dot={false}
      />
    </AreaChart>
  </ResponsiveContainer>
);

// Stat card with sparkline
const StatCard = ({ label, value, color, icon: Icon, delay, sparkData, sparkColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -6, transition: { duration: 0.28 } }}
    className="glass-card rounded-2xl p-6 relative overflow-hidden group border border-slate-200/80 dark:border-slate-700/50 hover:border-violet-300/60 dark:hover:border-cyan-500/25 hover:shadow-xl transition-shadow duration-300"
  >
    <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-[0.12] group-hover:scale-125 transition-transform duration-700 ${color.bg}`} />
    <div className="flex justify-between items-start mb-2 relative z-10">
      <div className={`p-3 rounded-2xl ${color.bg} ${color.text} shadow-lg ring-1 ring-black/5 dark:ring-white/10`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="relative z-10 mb-2">
      <p className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
        {value}
      </p>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
    </div>
    {/* Sparkline */}
    {sparkData && <Sparkline data={sparkData} color={sparkColor} />}
  </motion.div>
);

export const StatusBadge = ({ status }) => {
  const styles = {
    new: "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30",
    contacted: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30",
    converted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30",
  };
  return (
    <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap ${styles[status]}`}>
      {status}
    </span>
  );
};

// ─── Main dashboard ───────────────────────────────────────────

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

  // Core stats
  const total = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const contacted = leads.filter((l) => l.status === "contacted").length;
  const converted = leads.filter((l) => l.status === "converted").length;
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;
  const totalNotes = leads.reduce((acc, l) => acc + (l.notes?.length || 0), 0);
  const uniqueSources = new Set(leads.map((l) => l.source)).size;

  // Chart data
  const cumulativeData = getCumulativeData(leads);
  const conversionTrend = getConversionTrend(leads);
  const multiLineData = getMultiLineTrend(leads);
  const funnelData = getFunnelData(total, contacted, converted);
  const radarData = getRadarData(total, contacted, converted, totalNotes, uniqueSources);
  const timeline = getTimeline(leads);

  // Sparklines
  const sparkAll = getSparkline(leads, () => true);
  const sparkNew = getSparkline(leads, (l) => l.status === "new");
  const sparkContacted = getSparkline(leads, (l) => l.status === "contacted");
  const sparkConverted = getSparkline(leads, (l) => l.status === "converted");

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg noise-overlay overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gradient-brand tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-base">
            Here&apos;s what&apos;s happening with your clients today.
          </p>
        </motion.div>

        {/* ── Row 1: Stat cards with sparklines ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total leads" value={total} icon={Users} delay={0.1}
            sparkData={sparkAll} sparkColor="#7c3aed"
            color={{ bg: "bg-violet-100 dark:bg-violet-500/20", text: "text-violet-700 dark:text-violet-300" }} />
          <StatCard label="New" value={newLeads} icon={UserPlus} delay={0.2}
            sparkData={sparkNew} sparkColor="#06b6d4"
            color={{ bg: "bg-cyan-100 dark:bg-cyan-500/20", text: "text-cyan-700 dark:text-cyan-300" }} />
          <StatCard label="Contacted" value={contacted} icon={PhoneCall} delay={0.3}
            sparkData={sparkContacted} sparkColor="#f97316"
            color={{ bg: "bg-orange-100 dark:bg-orange-500/20", text: "text-orange-600 dark:text-orange-400" }} />
          <StatCard label="Converted" value={converted} icon={CheckCircle2} delay={0.4}
            sparkData={sparkConverted} sparkColor="#10b981"
            color={{ bg: "bg-emerald-100 dark:bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400" }} />
        </div>

        {/* ── Row 2: Funnel + Cumulative growth ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Funnel chart */}
          <ChartCard
            title="Sales pipeline funnel"
            subtitle="Lead drop-off at each stage"
            delay={0.5}
            span={1}
          >
            {total === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={220}>
                <FunnelChart>
                  <Tooltip content={<ChartTooltip />} />
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive
                    label={{ fill: "#fff", fontSize: 12, fontWeight: 600 }}
                  >
                    <LabelList
                      position="center"
                      fill="#fff"
                      fontSize={12}
                      fontWeight={700}
                      formatter={(v) => v}
                    />
                    {funnelData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            )}
            {/* Drop-off labels */}
            {total > 0 && (
              <div className="flex justify-around mt-2 text-xs text-slate-500">
                <span className="text-violet-600 font-semibold">{total} leads</span>
                <span>→</span>
                <span className="text-orange-500 font-semibold">{contacted} contacted</span>
                <span>→</span>
                <span className="text-emerald-600 font-semibold">{converted} converted</span>
              </div>
            )}
          </ChartCard>

          {/* Cumulative growth */}
          <ChartCard
            title="Cumulative lead growth"
            subtitle="Running total of leads over time"
            delay={0.6}
            span={2}
          >
            {cumulativeData.length < 2 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={cumulativeData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false} tickLine={false} allowDecimals={false}
                    label={{ value: "Total leads", angle: -90, position: "insideLeft", offset: 12, style: { fontSize: 11, fill: "#94a3b8" } }}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone" dataKey="total" name="Total leads"
                    stroke="#7c3aed" strokeWidth={2.5}
                    fill="url(#cumGrad)"
                    dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* ── Row 3: Multi-line trend + Conversion trend ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Multi-line: new vs contacted vs converted */}
          <ChartCard
            title="Status trends over time"
            subtitle="New, contacted and converted leads per month"
            delay={0.7}
            span={2}
          >
            {multiLineData.length < 2 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={multiLineData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false} tickLine={false} allowDecimals={false}
                    label={{ value: "Leads", angle: -90, position: "insideLeft", offset: 12, style: { fontSize: 11, fill: "#94a3b8" } }}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    iconType="circle" iconSize={8}
                    formatter={(v) => <span style={{ fontSize: 12, color: "#64748b", textTransform: "capitalize" }}>{v}</span>}
                  />
                  <Line type="monotone" dataKey="new" name="New" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="contacted" name="Contacted" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="converted" name="Converted" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Conversion % trend */}
          <ChartCard
            title="Conversion rate trend"
            subtitle="Monthly conversion % over time"
            delay={0.8}
            span={1}
          >
            {conversionTrend.length < 2 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={conversionTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false} tickLine={false}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    label={{ value: "Rate (%)", angle: -90, position: "insideLeft", offset: 12, style: { fontSize: 11, fill: "#94a3b8" } }}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone" dataKey="rate" name="Conversion %"
                    stroke="#10b981" strokeWidth={2.5}
                    fill="url(#convGrad)"
                    dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* ── Row 4: Radar + Timeline activity feed ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Radar chart */}
          <ChartCard
            title="Performance radar"
            subtitle="Overall CRM health across key metrics (0–100 scale)"
            delay={0.9}
            span={1}
          >
            {total === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    tickFormatter={(v) => `${v}`}
                  />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="#7c3aed"
                    fill="#7c3aed"
                    fillOpacity={0.2}
                    dot={{ r: 3, fill: "#7c3aed" }}
                  />
                  <Tooltip content={<ChartTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Timeline activity feed */}
          <ChartCard
            title="Activity timeline"
            subtitle="Latest events across all leads"
            delay={1.0}
            span={2}
            minH={300}
          >
            {timeline.length === 0 ? (
              <Empty text="No activity yet." />
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
                {timeline.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + i * 0.06 }}
                    className="flex items-start gap-3"
                  >
                    {/* Dot + line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${event.color}`} />
                      {i < timeline.length - 1 && (
                        <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 mt-1 min-h-[20px]" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-3">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">
                        {event.label}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {event.time.toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ChartCard>
        </div>

        {/* ── Row 5: Recent leads ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="glass-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/50"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-white">Recent leads</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 5 incoming leads</p>
            </div>
            <button
              onClick={() => navigate("/leads")}
              className="group flex items-center text-sm font-semibold text-violet-600 dark:text-cyan-400 hover:text-violet-700 transition-colors"
            >
              View all
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="p-2">
            {leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Users className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-sm">No leads yet. Share your form to get started.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {leads.slice(0, 5).map((lead, i) => (
                  <motion.div
                    key={lead._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.08 }}
                    onClick={() => navigate(`/leads/${lead._id}`)}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50/90 dark:hover:bg-slate-800/60 cursor-pointer transition-all group border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-200 to-cyan-200 dark:from-violet-900/50 dark:to-cyan-900/40 flex items-center justify-center text-violet-700 dark:text-cyan-300 font-bold text-sm shadow-inner">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-violet-700 dark:group-hover:text-cyan-300 transition-colors">
                          {lead.name}
                        </p>
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

      </main>
    </div>
  );
};

export default DashboardPage;