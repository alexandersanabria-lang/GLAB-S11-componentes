import type { ReactNode } from "react";
import styles from "./Button.module.css";

export interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
}: ButtonProps) {
  // Tailwind para tamaños y estructura básica
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const className = [
    styles.button,
    styles[variant],
    loading ? styles.loading : "",
    disabled ? styles.disabled : "",
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    "font-semibold rounded-lg text-white transition-all duration-300",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className={styles.spinner}></span>
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}