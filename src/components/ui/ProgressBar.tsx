"use client";

export default function ProgressBar({
  value,
  max,
  label,
  showPercentage = true,
  color = "indigo",
}: {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  color?: "indigo" | "green" | "amber" | "rose";
}) {
  const percentage = Math.round((value / max) * 100);

  const colorClasses = {
    indigo: "from-indigo-500 to-purple-500",
    green: "from-emerald-500 to-green-400",
    amber: "from-amber-500 to-yellow-400",
    rose: "from-rose-500 to-pink-400",
  };

  const glowClasses = {
    indigo: "shadow-indigo-500/30",
    green: "shadow-emerald-500/30",
    amber: "shadow-amber-500/30",
    rose: "shadow-rose-500/30",
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs font-medium text-slate-300">{label}</span>}
          {showPercentage && (
            <span className="text-xs font-bold text-indigo-300">{percentage}%</span>
          )}
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClasses[color]} shadow-lg ${glowClasses[color]} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
