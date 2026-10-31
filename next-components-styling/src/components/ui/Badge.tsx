import type { ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  variant?: "success" | "error" | "warning" | "info" | "neutral";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
}

export default function Badge({
  children,
  variant = "neutral",
  size = "md",
  rounded = false,
}: BadgeProps) {
  const variantClasses = {
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    neutral: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center border font-semibold ${variantClasses[variant]} ${sizeClasses[size]} ${
        rounded ? "rounded-full" : "rounded-md"
      }`}
    >
      {children}
    </span>
  );
}