import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function Reports() {
  const [period, setPeriod] = useState("month");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/reports/overview?period=${period}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [period]);

  const exportCsv = (type) => {
    window.location.href = `/api/reports/export/${type}?period=${period}&token=${token}`;
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading reports…</div>;
  if (!data) return <div className="p-8 text-center text-gray-400">No data available</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-3 items-center">
          {/* Period selector */}
          <select value={period} onChange={e => setPeriod(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          {/* Export buttons */}
          <button onClick={() => exportCsv("policies")}
            className="text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition">
            ↓ Export Policies
          </button>
          <button onClick={() => exportCsv("claims")}
            className="text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition">
            ↓ Export Claims
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Policies", value: data.totalPolicies?.toLocaleString() ?? "—", sub: `${data.newPolicies ?? 0} new this period`, color: "bg-blue-500" },
          { label: "Gross Premium", value: `R ${Number(data.grossPremium ?? 0).toLocaleString()}`, sub: `${data.premiumGrowth ?? 0}% vs prior period`, color: "bg-green-500" },
          { label: "Open Claims", value: data.openClaims?.toLocaleString() ?? "—", sub: `${data.claimsRatio ?? 0}% claims ratio`, color: "bg-yellow-500" },
          { label: "Total Assets", value: `R ${Number(data.totalAssetValue ?? 0).toLocaleString()}`, sub: `${data.assetCount ?? 0} assets insured`, color: "bg-purple-500" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl shadow p-5 border-l-4 border-l-transparent"
            style={{ borderLeftColor: kpi.color.replace("bg-", "").replace("-500", "") }}>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{kpi.label}</p>
            <p className="text-2xl font-bold mt-1">{kpi.value}</p>
            <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Premium trend */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Premium Income Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.premiumTrend ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `R${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => [`R ${Number(v).toLocaleString()}`, "Premium"]} />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Policy type breakdown */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Policies by Type</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.policyTypeBreakdown ?? []} dataKey="count" nameKey="type"
                cx="50%" cy="50%" outerRadius={80} label={({ type, percent }) => `${type} ${(percent*100).toFixed(0)}%`}>
                {(data.policyTypeBreakdown ?? []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Claims by status */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Claims by Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.claimsByStatus ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="status" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {(data.claimsByStatus ?? []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Assets by type */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Insured Value by Asset Type</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.assetsByType ?? []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `R${(v/1000000).toFixed(1)}M`} />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 10 }} width={110} />
              <Tooltip formatter={v => [`R ${Number(v).toLocaleString()}`, "Value"]} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top policies table */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Top 10 Policies by Premium</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500 text-xs uppercase">
                {["Policy #", "Client", "Type", "Premium", "Sum Insured", "Status"].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-semibold tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data.topPolicies ?? []).map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-3 py-2 font-mono text-blue-600">{p.policyNumber}</td>
                  <td className="px-3 py-2">{p.clientName}</td>
                  <td className="px-3 py-2">{p.policyType}</td>
                  <td className="px-3 py-2">R {Number(p.premiumAmount).toLocaleString()}</td>
                  <td className="px-3 py-2">R {Number(p.sumInsured).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
