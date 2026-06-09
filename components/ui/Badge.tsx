import React from "react";

export type BadgeStatus = "pending" | "confirmed" | "modified" | "cancelled";

const STATUS_LABELS: Record<BadgeStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  modified: "Modificada",
  cancelled: "Cancelada",
};

export interface BadgeProps {
  status: BadgeStatus;
  label?: string;
}

export default function Badge({ status, label }: BadgeProps) {
  return (
    <span className={`badge badge--${status}`}>
      {label || STATUS_LABELS[status]}
    </span>
  );
}
