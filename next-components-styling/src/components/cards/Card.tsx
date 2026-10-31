import type { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  image?: string;
  footer?: ReactNode;
  hover?: boolean;
  className?: string;
}

export default function Card({
  children,
  title,
  subtitle,
  image,
  footer,
  hover = true,
  className = "",
}: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 ${
        hover ? "hover:-translate-y-1 hover:shadow-xl" : ""
      } ${className}`}
    >
      {/* Imagen opcional */}
      {image && (
        <div className="h-48 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title || "Card image"}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="p-6">
        {/* Header */}
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h3 className="mb-2 text-2xl font-bold text-gray-800">{title}</h3>
            )}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        )}

        {/* Body */}
        <div className="text-gray-600">{children}</div>
      </div>

      {/* Footer opcional */}
      {footer && (
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
}