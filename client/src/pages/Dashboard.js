import { useEffect, useState } from "react";

import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";
import { userService } from "../services/user.service";

function Dashboard() {
  const { showToast } = useToast();
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getDashboard();

        if (!ignore) {
          setDashboard(response);
        }
      } catch (error) {
        if (!ignore) {
          showToast({
            type: "error",
            title: "Unable to load dashboard",
            message: error.message,
          });
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      ignore = true;
    };
  }, [showToast]);

  if (isLoading) {
    return (
      <div className="page-shell flex min-h-[70vh] items-center justify-center">
        <Loader label="Loading dashboard" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="page-shell">
        <EmptyState
          title="Dashboard unavailable"
          description="Try refreshing the page or signing in again."
        />
      </div>
    );
  }

  return (
    <main className="page-shell space-y-8">
      <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <div className="surface p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/15 font-display text-2xl font-bold text-emerald-200">
              {dashboard.profile.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-white">
                {dashboard.profile.name}
              </h1>
              <p className="text-sm text-slate-400">{dashboard.profile.email}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Role</p>
              <p className="mt-2 text-base font-semibold capitalize text-white">
                {dashboard.profile.role}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Interests</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {dashboard.profile.interests.length > 0 ? (
                  dashboard.profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-400">No interests added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="surface p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Courses</p>
            <p className="mt-4 font-display text-4xl font-bold text-white">
              {dashboard.stats.enrolledCourses}
            </p>
            <p className="mt-2 text-sm text-slate-400">Enrolled and ready to continue</p>
          </div>
          <div className="surface p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Progress</p>
            <p className="mt-4 font-display text-4xl font-bold text-white">
              {dashboard.enrolledCourses.length
                ? Math.round(
                    dashboard.enrolledCourses.reduce(
                      (total, course) => total + course.progress,
                      0
                    ) / dashboard.enrolledCourses.length
                  )
                : 0}
              %
            </p>
            <p className="mt-2 text-sm text-slate-400">Average completion across active courses</p>
          </div>
          <div className="surface p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Momentum</p>
            <p className="mt-4 font-display text-4xl font-bold text-white">
              {dashboard.enrolledCourses.length ? "Strong" : "Starting"}
            </p>
            <p className="mt-2 text-sm text-slate-400">Based on your current learning activity</p>
          </div>
        </div>
      </section>

      <section className="surface p-6 sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/80">
              Dashboard
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white">
              Enrolled courses
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            {dashboard.enrolledCourses.length} course
            {dashboard.enrolledCourses.length === 1 ? "" : "s"}
          </p>
        </div>

        {dashboard.enrolledCourses.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No enrollments yet"
              description="Head back to the catalog and enroll in your first course to populate this dashboard."
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {dashboard.enrolledCourses.map((course) => (
              <article
                key={course._id}
                className="rounded-3xl border border-white/10 bg-slate-950/50 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-100">
                    {course.category}
                  </span>
                  <span className="text-xs text-slate-400">{course.level}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-white">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {course.description}
                </p>
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
