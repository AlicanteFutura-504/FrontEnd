import React from "react";

export type BadgeStatus = "pending" | "confirmed" | "paid";

const STATUS_LABELS: Record<BadgeStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  paid: "Pagada",
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
