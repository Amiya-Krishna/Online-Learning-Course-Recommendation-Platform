import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
  interests: "",
};

function Register() {
  const navigate = useNavigate();
  const { isAuthenticated, register } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState(initialForm);
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
      await register({
        ...form,
        interests: form.interests
          .split(",")
          .map((interest) => interest.trim())
          .filter(Boolean),
      });
      showToast({
        type: "success",
        title: "Account created",
        message: "Your session is active and recommendations are ready.",
      });
      navigate("/", { replace: true });
    } catch (error) {
      showToast({
        type: "error",
        title: "Unable to create account",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-2xl shadow-slate-950/40 lg:grid-cols-[1fr_1fr]">
        <section className="p-8 sm:p-10">
          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
              Create your profile
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold text-white">
              Start learning with a personalized feed
            </h1>
            <p className="mt-3 text-sm text-slate-400">
              Choose a few interests so the recommendation engine has something meaningful to rank.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-2 text-sm text-slate-300">
              Full name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-emerald-400/60"
              />
            </label>
            <label className="block space-y-2 text-sm text-slate-300">
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-emerald-400/60"
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
                minLength="8"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-emerald-400/60"
              />
            </label>
            <label className="block space-y-2 text-sm text-slate-300">
              Interests
              <input
                name="interests"
                value={form.interests}
                onChange={handleChange}
                placeholder="ai, react, data science"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-emerald-400/60"
              />
            </label>
            <Button type="submit" className="w-full justify-center" loading={isSubmitting}>
              Create account
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Already have an account?{" "}
            <Link className="font-medium text-sky-200" to="/login">
              Sign in
            </Link>
          </p>
        </section>

        <section className="hidden bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.22),_transparent_34%),linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(2,6,23,0.96))] p-10 lg:block">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-300">
              What you get
            </p>
            <div className="mt-6 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  Tailored recommendations
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Courses are ranked by interest, category, and tags with a clean fallback path.
                </p>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  One-click enrollment
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Protected actions, clear feedback, and a dashboard that updates around your progress.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;
