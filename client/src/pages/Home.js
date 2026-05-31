import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../components/Button";
import CourseCard from "../components/CourseCard";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import SkeletonCard from "../components/SkeletonCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { courseService } from "../services/course.service";
import { recommendationService } from "../services/recommendation.service";

const initialCourseForm = {
  title: "",
  description: "",
  instructor: "",
  price: "",
  category: "",
  thumbnail: "",
  tags: "",
  level: "beginner",
  durationInHours: "",
};

function Home() {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [courseForm, setCourseForm] = useState(initialCourseForm);
  const deferredQuery = useDeferredValue(query);

  const filteredCourses = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return courses;
    }

    return courses.filter((course) =>
      [course.title, course.category, course.instructor]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [courses, deferredQuery]);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [allCourses, recommended] = await Promise.all([
          courseService.getCourses(),
          isAuthenticated && user?.id
            ? recommendationService.getRecommendations(user.id)
            : Promise.resolve([]),
        ]);

        if (!ignore) {
          setCourses(allCourses);
          setRecommendedCourses(recommended);
        }
      } catch (error) {
        if (!ignore) {
          showToast({
            type: "error",
            title: "Unable to load courses",
            message: error.message,
          });
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, showToast, user?.id]);

  const refreshRecommendations = async () => {
    if (!user?.id) {
      setRecommendedCourses([]);
      return;
    }

    const nextRecommendations = await recommendationService.getRecommendations(user.id);
    setRecommendedCourses(nextRecommendations);
  };

  const handleEnroll = async (courseId) => {
    try {
      await courseService.enrollCourse(courseId);
      showToast({
        type: "success",
        title: "Enrollment complete",
        message: "This course is now available in your dashboard.",
      });
      await refreshRecommendations();
    } catch (error) {
      showToast({
        type: "error",
        title: "Enrollment failed",
        message: error.message,
      });
    }
  };

  const handleCreateCourse = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      const createdCourse = await courseService.createCourse({
        ...courseForm,
        price: Number(courseForm.price),
        durationInHours: Number(courseForm.durationInHours || 0),
        tags: courseForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });

      setCourses((currentCourses) => [createdCourse, ...currentCourses]);
      setCourseForm(initialCourseForm);
      showToast({
        type: "success",
        title: "Course published",
        message: "Your new course is live in the catalog.",
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "Unable to publish course",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourseForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  return (
    <main className="page-shell space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="surface relative overflow-hidden p-8 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.18),_transparent_30%)]" />
          <div className="relative space-y-6">
            <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
              Production-ready learning experience
            </span>
            <div className="space-y-4">
              <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Explore future-proof skills with a product-grade learning platform.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Personalized recommendations, reliable enrollment flows, and a
                clean dashboard for focused learning momentum.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button as={Link} to="/dashboard">
                View dashboard
              </Button>
              {!isAuthenticated ? (
                <Button as={Link} to="/register" variant="secondary">
                  Create account
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="surface p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/80">
            Search the catalog
          </p>
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, category, or instructor"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-3xl font-bold text-white">{courses.length}</p>
              <p className="mt-1 text-sm text-slate-400">Courses available</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-3xl font-bold text-white">
                {isAuthenticated ? recommendedCourses.length : "--"}
              </p>
              <p className="mt-1 text-sm text-slate-400">Recommended for you</p>
            </div>
          </div>
        </div>
      </section>

      {isAuthenticated ? (
        <section className="surface p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
                Personalized picks
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-white">
                Recommendations tuned to your interests
              </h2>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              Interests: {(user?.interests || []).join(", ") || "Add more in profile later"}
            </span>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
              : recommendedCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    onEnroll={handleEnroll}
                    highlightScore
                  />
                ))}
          </div>

          {!isLoading && recommendedCourses.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No personalized recommendations yet"
                description="Browse the full catalog and enroll in a course to improve your next suggestion set."
              />
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="surface p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200/80">
              Course library
            </p>
            <h2 className="section-title mt-2">Browse all courses</h2>
          </div>
          <p className="text-sm text-slate-400">
            {filteredCourses.length} result{filteredCourses.length === 1 ? "" : "s"}
          </p>
        </div>

        {isLoading ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No courses matched your search"
              description="Try a different keyword or create a new course if you are building the catalog."
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onEnroll={isAuthenticated ? handleEnroll : undefined}
              />
            ))}
          </div>
        )}
      </section>

      {isAuthenticated ? (
        <section className="surface p-6 sm:p-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200/80">
              Instructor tools
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">
              Publish a new course
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              This form writes through the validated backend flow so the app can be demoed end to end.
            </p>
          </div>

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleCreateCourse}>
            <label className="space-y-2 text-sm text-slate-300">
              Title
              <input
                name="title"
                value={courseForm.title}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition focus:border-emerald-400/60"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Instructor
              <input
                name="instructor"
                value={courseForm.instructor}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition focus:border-emerald-400/60"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              Description
              <textarea
                name="description"
                value={courseForm.description}
                onChange={handleChange}
                rows="4"
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition focus:border-emerald-400/60"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Category
              <input
                name="category"
                value={courseForm.category}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition focus:border-emerald-400/60"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Price
              <input
                name="price"
                type="number"
                min="0"
                value={courseForm.price}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition focus:border-emerald-400/60"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Level
              <select
                name="level"
                value={courseForm.level}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition focus:border-emerald-400/60"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Duration in hours
              <input
                name="durationInHours"
                type="number"
                min="0"
                value={courseForm.durationInHours}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition focus:border-emerald-400/60"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Thumbnail URL
              <input
                name="thumbnail"
                value={courseForm.thumbnail}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition focus:border-emerald-400/60"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              Tags
              <input
                name="tags"
                value={courseForm.tags}
                onChange={handleChange}
                placeholder="react, backend, ai"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition focus:border-emerald-400/60"
              />
            </label>
            <div className="md:col-span-2">
              <Button type="submit" loading={isSubmitting}>
                Publish course
              </Button>
            </div>
          </form>
        </section>
      ) : (
        <section className="surface flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              Sign in to unlock recommendations and enrollment
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Your dashboard and personalized course feed appear once your session is active.
            </p>
          </div>
          <Button as={Link} to="/login">
            Sign in
          </Button>
        </section>
      )}

      {isLoading ? (
        <div className="flex justify-center pb-8">
          <Loader label="Refreshing learning experience" />
        </div>
      ) : null}
    </main>
  );
}

export default Home;
