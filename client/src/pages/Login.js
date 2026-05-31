import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      await login(form);
      showToast({
        type: "success",
        title: "Welcome back",
        message: "Your learning dashboard is ready.",
      });
      navigate("/", { replace: true });
    } catch (error) {
      showToast({
        type: "error",
        title: "Sign in failed",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-2xl shadow-slate-950/40 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.24),_transparent_32%),linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(2,6,23,0.96))] p-10 lg:block">
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-100">
            Online Learning Platform
          </span>
          <h1 className="mt-8 font-display text-5xl font-bold leading-tight text-white">
            Build skills with a product experience that feels ready for launch day.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
            Secure auth, personalized recommendations, and a clear dashboard all in one flow.
          </p>
        </section>

        <section className="p-8 sm:p-10">
          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/80">
              Welcome back
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold text-white">Sign in</h2>
            <p className="mt-3 text-sm text-slate-400">
              Continue where you left off and pick up your next lesson.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-2 text-sm text-slate-300">
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-sky-400/60"
              />
            </label>
            <label className="block space-y-2 text-sm text-slate-300">
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-sky-400/60"
              />
            </label>
            <Button type="submit" className="w-full justify-center" loading={isSubmitting}>
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Need an account?{" "}
            <Link className="font-medium text-emerald-200" to="/register">
              Create one
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default Login;
