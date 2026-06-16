"use client";

export default function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
}) {
  const variantClasses = {
    default: "bg-slate-700/50 text-slate-300 border-slate-600/50",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    error: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    info: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
