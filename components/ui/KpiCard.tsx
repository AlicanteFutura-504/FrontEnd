import React from "react";

export interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  variant?: "positive" | "warning";
}

export default function KpiCard({ title, value, subtitle, variant }: KpiCardProps) {
  const metaClass = variant === "positive"
    ? "kpi-card__meta kpi-card__meta--positive"
    : variant === "warning"
      ? "kpi-card__meta kpi-card__meta--warning"
      : "kpi-card__meta";

  return (
    <div className="kpi-card">
      <p className="kpi-card__label">{title}</p>
      <h3 className="kpi-card__value">{value}</h3>
      <p className={metaClass}>{subtitle}</p>
    </div>
  );
}
