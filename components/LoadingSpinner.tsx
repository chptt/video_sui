"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  return (
    <div
      className={`spinner spinner-${size}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingPage({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="page-loader">
      <div className="spinner spinner-lg" />
      <p style={{ color: "#64748b", fontSize: "0.9375rem" }}>{message}</p>
    </div>
  );
}
