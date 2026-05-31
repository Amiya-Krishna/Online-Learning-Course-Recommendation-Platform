import Button from "./Button";

const fallbackImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

function CourseCard({ course, onEnroll, highlightScore = false }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/60 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30">
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail || fallbackImage}
          alt={course.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-300">
            {course.category}
          </span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
            {course.level || "beginner"}
          </span>
          {highlightScore && typeof course.relevanceScore === "number" ? (
            <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs text-sky-100">
              Match score {course.relevanceScore}
            </span>
          ) : null}
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-white">{course.title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-400">{course.description}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>{course.instructor}</span>
          <span>{course.durationInHours || 0}h</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="font-display text-2xl font-bold text-white">Rs. {course.price}</p>
          {onEnroll ? (
            <Button onClick={() => onEnroll(course._id)}>Enroll</Button>
          ) : (
            <Button variant="secondary" disabled>
              Sign in to enroll
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
