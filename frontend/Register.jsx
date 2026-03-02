import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    password: "", confirmPassword: "", role: "Broker",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roles = ["Broker", "Manager", "Finance", "Assessor", "Admin"];

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (!/[A-Z]/.test(form.password)) e.password = "Must contain uppercase letter";
    if (!/[0-9]/.test(form.password)) e.password = "Must contain a number";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Registration failed");
      }
      navigate("/login?registered=true");
    } catch (err) {
      setErrors({ _general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">InsureX</h1>
          <p className="text-gray-500 mt-1">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
          {errors._general && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{errors._general}</div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name" error={errors.firstName}>
              <input name="firstName" value={form.firstName} onChange={handleChange}
                className={inp(errors.firstName)} autoFocus />
            </Field>
            <Field label="Last Name" error={errors.lastName}>
              <input name="lastName" value={form.lastName} onChange={handleChange}
                className={inp(errors.lastName)} />
            </Field>
          </div>

          <Field label="Email" error={errors.email}>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              className={inp(errors.email)} />
          </Field>

          <Field label="Phone (optional)">
            <input name="phone" value={form.phone} onChange={handleChange} className={inp()} />
          </Field>

          <Field label="Role">
            <select name="role" value={form.role} onChange={handleChange} className={inp()}>
              {roles.map((r) => <option key={r}>{r}</option>)}
            </select>
          </Field>

          <Field label="Password" error={errors.password}>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              className={inp(errors.password)} />
            <p className="text-xs text-gray-400 mt-1">Min 8 chars, uppercase + number</p>
          </Field>

          <Field label="Confirm Password" error={errors.confirmPassword}>
            <input name="confirmPassword" type="password" value={form.confirmPassword}
              onChange={handleChange} className={inp(errors.confirmPassword)} />
          </Field>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold
              hover:bg-indigo-700 disabled:opacity-50 transition mt-2">
            {loading ? "Creating account…" : "Register"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
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

const inp = (error) =>
  `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2
  ${error ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-indigo-400"}`;
