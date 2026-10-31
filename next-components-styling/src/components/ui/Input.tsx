import type { ReactNode } from "react";
import styles from "./Input.module.css";

export interface InputProps {
  label?: string;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  icon?: ReactNode;
}

export default function Input({
  label,
  type = "text",
  placeholder = " ", // el espacio es necesario para el label flotante
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  helperText,
  icon,
}: InputProps) {
  return (
    <div className="mb-4">
      <div className={styles.inputWrapper}>
        {/* Ícono opcional */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`${styles.input} ${error ? styles.error : ""} ${
            icon ? "pl-10" : "pl-4"
          } w-full rounded-lg border-2 border-gray-300 py-3 pr-4 outline-none disabled:cursor-not-allowed disabled:bg-gray-100`}
        />

        {/* Label flotante */}
        {label && (
          <label
            className={`${styles.floatingLabel} ${icon ? styles.withIcon : ""}`}
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
      </div>

      {/* Mensaje de error o ayuda */}
      {error ? (
        <p className={styles.errorMessage}>{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
}