import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const POLICY_TYPES = [
  "Commercial Short Term",
  "Personal Lines",
  "Marine",
  "Aviation",
  "Engineering",
  "Liability",
  "Life",
  "Health",
];

const STATUS_OPTIONS = ["Draft", "Active", "Lapsed", "Cancelled", "Expired"];

const defaultForm = {
  policyNumber: "",
  policyType: "",
  status: "Draft",
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  insurerName: "",
  financerName: "",
  premiumAmount: "",
  sumInsured: "",
  startDate: "",
  endDate: "",
  notes: "",
};

export default function PolicyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    fetch(`/api/policies/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setForm({
          ...defaultForm,
          ...data,
          startDate: data.startDate?.split("T")[0] ?? "",
          endDate: data.endDate?.split("T")[0] ?? "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.clientName.trim()) e.clientName = "Client name is required";
    if (!form.policyType) e.policyType = "Policy type is required";
    if (!form.startDate) e.startDate = "Start date is required";
    if (!form.endDate) e.endDate = "End date is required";
    if (form.startDate && form.endDate && form.startDate >= form.endDate)
      e.endDate = "End date must be after start date";
    if (!form.premiumAmount || isNaN(form.premiumAmount) || Number(form.premiumAmount) <= 0)
      e.premiumAmount = "Valid premium amount required";
    if (!form.sumInsured || isNaN(form.sumInsured) || Number(form.sumInsured) <= 0)
      e.sumInsured = "Valid sum insured required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setSaving(true);
    try {
      const url = isEdit ? `/api/policies/${id}` : "/api/policies";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...form,
          premiumAmount: Number(form.premiumAmount),
          sumInsured: Number(form.sumInsured),
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();
      navigate(`/policies/${saved.id}`);
    } catch (err) {
      setErrors({ _general: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading policy…</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Policy" : "New Policy"}
      </h1>

      {errors._general && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errors._general}</div>
      )}

      <div className="bg-white rounded-xl shadow p-6 space-y-6">

        {/* Client Info */}
        <section>
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Client Name *" error={errors.clientName}>
              <input name="clientName" value={form.clientName} onChange={handleChange}
                className={inputClass(errors.clientName)} placeholder="Full name or company" />
            </Field>
            <Field label="Email">
              <input name="clientEmail" type="email" value={form.clientEmail} onChange={handleChange}
                className={inputClass()} />
            </Field>
            <Field label="Phone">
              <input name="clientPhone" value={form.clientPhone} onChange={handleChange}
                className={inputClass()} />
            </Field>
          </div>
        </section>

        {/* Policy Details */}
        <section>
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">Policy Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Policy Type *" error={errors.policyType}>
              <select name="policyType" value={form.policyType} onChange={handleChange}
                className={inputClass(errors.policyType)}>
                <option value="">— Select type —</option>
                {POLICY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select name="status" value={form.status} onChange={handleChange}
                className={inputClass()}>
                {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Insurer">
              <input name="insurerName" value={form.insurerName} onChange={handleChange}
                className={inputClass()} />
            </Field>
            <Field label="Financer">
              <input name="financerName" value={form.financerName} onChange={handleChange}
                className={inputClass()} />
            </Field>
            <Field label="Start Date *" error={errors.startDate}>
              <input name="startDate" type="date" value={form.startDate} onChange={handleChange}
                className={inputClass(errors.startDate)} />
            </Field>
            <Field label="End Date *" error={errors.endDate}>
              <input name="endDate" type="date" value={form.endDate} onChange={handleChange}
                className={inputClass(errors.endDate)} />
            </Field>
          </div>
        </section>

        {/* Financials */}
        <section>
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">Financials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Annual Premium (R) *" error={errors.premiumAmount}>
              <input name="premiumAmount" type="number" min="0" step="0.01"
                value={form.premiumAmount} onChange={handleChange}
                className={inputClass(errors.premiumAmount)} />
            </Field>
            <Field label="Sum Insured (R) *" error={errors.sumInsured}>
              <input name="sumInsured" type="number" min="0" step="0.01"
                value={form.sumInsured} onChange={handleChange}
                className={inputClass(errors.sumInsured)} />
            </Field>
          </div>
        </section>

        {/* Notes */}
        <section>
          <Field label="Notes">
            <textarea name="notes" rows={4} value={form.notes} onChange={handleChange}
              className={inputClass() + " resize-none"} />
          </Field>
        </section>
      </div>

      <div className="flex gap-3 mt-6 justify-end">
        <button onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition">
          Cancel
        </button>
        <button onClick={handleSubmit} disabled={saving}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition">
          {saving ? "Saving…" : isEdit ? "Update Policy" : "Create Policy"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function inputClass(error) {
  return `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition
    ${error ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-blue-400"}`;
}
