import { forwardRef } from "react";

const variantMap = {
  primary:
    "bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-[1.01]",
  secondary:
    "border border-white/10 bg-white/5 text-white hover:bg-white/10",
  ghost: "text-slate-200 hover:bg-white/5",
};

const Button = forwardRef(
  (
    {
      as: Component = "button",
      children,
      className = "",
      loading = false,
      type = "button",
      variant = "primary",
      ...props
    },
    ref
  ) => (
    <Component
      ref={ref}
      type={Component === "button" ? type : undefined}
      className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200 ${variantMap[variant]} ${className}`}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </Component>
  )
);

export default Button;
