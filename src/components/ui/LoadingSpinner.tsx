"use client";

export default function LoadingSpinner({
  size = "md",
  text,
}: {
  size?: "sm" | "md" | "lg";
  text?: string;
}) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-indigo-200 border-t-indigo-500 rounded-full animate-spin`}
      />
      {text && (
        <p className="text-sm text-indigo-200 animate-pulse">{text}</p>
      )}
    </div>
  );
}
