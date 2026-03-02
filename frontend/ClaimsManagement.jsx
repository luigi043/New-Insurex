import { useState, useEffect, useCallback } from "react";

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-800",
  UnderReview: "bg-blue-100 text-blue-800",
  Assessed: "bg-purple-100 text-purple-800",
  Approved: "bg-green-100 text-green-800",
  PartiallyApproved: "bg-teal-100 text-teal-800",
  Rejected: "bg-red-100 text-red-800",
  Paid: "bg-emerald-100 text-emerald-800",
  Closed: "bg-gray-100 text-gray-700",
};

const ALL_STATUSES = Object.keys(STATUS_COLORS);

export default function ClaimsManagement() {
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", search: "", page: 1 });
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [actionModal, setActionModal] = useState(null); // { type: 'approve'|'reject'|'pay', claim }

  const token = localStorage.getItem("token");
  const h = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: filters.page,
        pageSize: 20,
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      });
      const [claimsRes, statsRes] = await Promise.all([
        fetch(`/api/claims?${params}`, { headers: h }),
        fetch("/api/claims/stats", { headers: h }),
      ]);
      setClaims((await claimsRes.json()).items ?? []);
      setStats(await statsRes.json());
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const doAction = async (type, id, payload) => {
    await fetch(`/api/claims/${id}/${type}`, { method: "POST", headers: h, body: JSON.stringify(payload) });
    setActionModal(null);
    setSelected(null);
    load();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Claims Management</h1>
        <button onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          + New Claim
        </button>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Claims", value: stats.total, color: "text-gray-900" },
            { label: "Pending Review", value: stats.pending, color: "text-yellow-600" },
            { label: "Approved", value: stats.approved, color: "text-green-600" },
            { label: "Total Paid", value: `R ${Number(stats.totalPaid || 0).toLocaleString()}`, color: "text-blue-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl shadow">
        <input
          placeholder="Search claim, client…"
          value={filters.search}
          onChange={(e) => setFilters(p => ({ ...p, search: e.target.value, page: 1 }))}
          className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <select value={filters.status}
          onChange={(e) => setFilters(p => ({ ...p, status: e.target.value, page: 1 }))}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option value="">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Claim #", "Policy", "Claimant", "Date of Loss", "Claimed Amount", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading…</td></tr>
            ) : claims.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">No claims found</td></tr>
            ) : claims.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-mono text-blue-600 font-medium">{c.claimNumber}</td>
                <td className="px-4 py-3">{c.policyNumber ?? `#${c.policyId}`}</td>
                <td className="px-4 py-3">{c.claimantName}</td>
                <td className="px-4 py-3">{new Date(c.dateOfLoss).toLocaleDateString()}</td>
                <td className="px-4 py-3">R {Number(c.claimedAmount).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[c.status] ?? "bg-gray-100"}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => setSelected(c)}
                      className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100">View</button>
                    {c.status === "Pending" || c.status === "Assessed" ? (
                      <>
                        <button onClick={() => setActionModal({ type: "approve", claim: c })}
                          className="text-xs px-2 py-1 rounded border border-green-300 text-green-700 hover:bg-green-50">✓</button>
                        <button onClick={() => setActionModal({ type: "reject", claim: c })}
                          className="text-xs px-2 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50">✕</button>
                      </>
                    ) : null}
                    {c.status === "Approved" && (
                      <button onClick={() => setActionModal({ type: "pay", claim: c })}
                        className="text-xs px-2 py-1 rounded border border-blue-300 text-blue-700 hover:bg-blue-50">Pay</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail panel */}
      {selected && <ClaimDetail claim={selected} onClose={() => setSelected(null)} headers={h} onRefresh={load} />}

      {/* Create modal */}
      {showCreate && <CreateClaimModal onClose={() => setShowCreate(false)} onSaved={load} headers={h} />}

      {/* Action modal */}
      {actionModal && (
        <ActionModal
          type={actionModal.type}
          claim={actionModal.claim}
          onConfirm={(payload) => doAction(actionModal.type, actionModal.claim.id, payload)}
          onClose={() => setActionModal(null)} />
      )}
    </div>
  );
}

function ClaimDetail({ claim, onClose, headers, onRefresh }) {
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`/api/claims/${claim.id}`, { headers })
      .then(r => r.json())
      .then(d => setDocs(d.documents ?? []));
  }, [claim.id]);

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    await fetch(`/api/claims/${claim.id}/documents`, {
      method: "POST",
      headers: { Authorization: headers.Authorization },
      body: fd,
    });
    setUploading(false);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">{claim.claimNumber}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Claimant", claim.claimantName],
              ["Contact", claim.claimantContact],
              ["Date of Loss", new Date(claim.dateOfLoss).toLocaleDateString()],
              ["Claimed", `R ${Number(claim.claimedAmount).toLocaleString()}`],
              ["Approved", claim.approvedAmount ? `R ${Number(claim.approvedAmount).toLocaleString()}` : "—"],
              ["Paid", claim.paidAmount ? `R ${Number(claim.paidAmount).toLocaleString()}` : "—"],
              ["Status", claim.status],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-gray-500">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          {claim.description && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
              <p className="text-sm bg-gray-50 rounded-lg p-3">{claim.description}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Documents ({docs.length})</p>
            {docs.map(d => (
              <div key={d.id} className="flex items-center gap-2 text-sm py-1 border-b last:border-0">
                <span>📎</span><span>{d.fileName}</span>
              </div>
            ))}
            <label className="mt-3 inline-flex items-center gap-2 text-sm text-blue-600 cursor-pointer hover:underline">
              {uploading ? "Uploading…" : "+ Upload Document"}
              <input type="file" className="hidden" onChange={upload} accept=".pdf,.jpg,.jpeg,.png" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateClaimModal({ onClose, onSaved, headers }) {
  const [form, setForm] = useState({ policyId: "", dateOfLoss: "", description: "", claimedAmount: "", claimantName: "", claimantContact: "" });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/claims", {
        method: "POST", headers,
        body: JSON.stringify({ ...form, claimedAmount: Number(form.claimedAmount) }),
      });
      if (!res.ok) throw new Error("Failed");
      onSaved(); onClose();
    } finally { setSaving(false); }
  };

  const ch = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-lg font-bold">New Claim</h2>
        {[
          { name: "policyId", label: "Policy ID", type: "number" },
          { name: "claimantName", label: "Claimant Name", type: "text" },
          { name: "claimantContact", label: "Contact / Email", type: "text" },
          { name: "dateOfLoss", label: "Date of Loss", type: "date" },
          { name: "claimedAmount", label: "Claimed Amount (R)", type: "number" },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input name={f.name} type={f.type} value={form[f.name]} onChange={ch}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={ch} rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Saving…" : "Submit Claim"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionModal({ type, claim, onConfirm, onClose }) {
  const [form, setForm] = useState({ approvedAmount: claim.claimedAmount, paidAmount: "", notes: "", reason: "" });

  const titles = { approve: "Approve Claim", reject: "Reject Claim", pay: "Record Payment" };

  const payload = () => {
    if (type === "approve") return { approvedAmount: Number(form.approvedAmount), notes: form.notes };
    if (type === "reject") return { reason: form.reason };
    return { paidAmount: Number(form.paidAmount), notes: form.notes };
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-bold">{titles[type]} — {claim.claimNumber}</h2>
        {type === "approve" && (
          <div>
            <label className="block text-sm font-medium mb-1">Approved Amount (R)</label>
            <input type="number" value={form.approvedAmount}
              onChange={e => setForm(p => ({...p, approvedAmount: e.target.value}))}
              className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        )}
        {type === "pay" && (
          <div>
            <label className="block text-sm font-medium mb-1">Payment Amount (R)</label>
            <input type="number" value={form.paidAmount}
              onChange={e => setForm(p => ({...p, paidAmount: e.target.value}))}
              className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        )}
        {type === "reject" ? (
          <div>
            <label className="block text-sm font-medium mb-1">Rejection Reason *</label>
            <textarea value={form.reason} rows={3}
              onChange={e => setForm(p => ({...p, reason: e.target.value}))}
              className="w-full border rounded-lg px-3 py-2 text-sm resize-none" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea value={form.notes} rows={2}
              onChange={e => setForm(p => ({...p, notes: e.target.value}))}
              className="w-full border rounded-lg px-3 py-2 text-sm resize-none" />
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={() => onConfirm(payload())}
            className={`px-6 py-2 rounded-lg text-white text-sm font-medium transition
              ${type === "reject" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
