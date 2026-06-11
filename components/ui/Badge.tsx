import React from "react";

export type BadgeStatus = "pending" | "confirmed" | "completed" | "modified" | "cancelled" | "paid";

const STATUS_LABELS: Record<BadgeStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  completed: "Completada",
  modified: "Modificada",
  cancelled: "Cancelada",
  paid: "Pagado",
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
