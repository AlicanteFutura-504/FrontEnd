"use client";

/**
 * @fileoverview Vista de calendario mensual para el módulo de reservas.
 * Muestra las reservas agrupadas por día con navegación entre meses
 * y un panel lateral con el detalle del día seleccionado.
 * @module app/(admin)/calendar/page
 */

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Badge from "@/components/ui/Badge";
import { getAppointmentsByRange, getBusinesses, getCustomers, getCustomersByBusiness } from "@/lib/api";
import type { Booking, Business, Customer } from "@/lib/types";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Helpers de fecha
// ---------------------------------------------------------------------------

function toYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(ymd: string): string {
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Returns [{date, isCurrentMonth, isToday}] for all cells in a 6-row calendar
function buildCalendarGrid(year: number, month: number): { ymd: string; currentMonth: boolean; today: boolean }[] {
  const todayYmd = toYMD(new Date());
  const firstDay = new Date(year, month, 1);
  // Monday-based: getDay() returns 0=Sun; shift so Mon=0
  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells: { ymd: string; currentMonth: boolean; today: boolean }[] = [];

  // Days from previous month
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    cells.push({ ymd: toYMD(d), currentMonth: false, today: false });
  }

  // Days of current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const ymd = toYMD(new Date(year, month, d));
    cells.push({ ymd, currentMonth: true, today: ymd === todayYmd });
  }

  // Fill rest to complete 6 rows (42 cells)
  let nextDay = 1;
  while (cells.length < 42) {
    const d = new Date(year, month + 1, nextDay++);
    cells.push({ ymd: toYMD(d), currentMonth: false, today: false });
  }

  return cells;
}

// ---------------------------------------------------------------------------
// Status chip colours (matching globals.css variables)
// ---------------------------------------------------------------------------
const STATUS_DOT: Record<string, string> = {
  pending: "var(--warning)",
  confirmed: "var(--info)",
  paid: "var(--success)",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CalendarPage() {
  const params = useParams();
  const businessId = params?.id as string | undefined;
  const { user } = useAuth();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(toYMD(today));

  // Compute the from/to for the current view (include surrounding days)
  const { from, to } = useMemo(() => {
    const f = toYMD(new Date(viewYear, viewMonth, 1));
    const t = toYMD(new Date(viewYear, viewMonth + 1, 0));
    return { from: f, to: t };
  }, [viewYear, viewMonth]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [appts, bizs, custs] = await Promise.all([
        getAppointmentsByRange(from, to, businessId),
        getBusinesses(),
        businessId ? getCustomersByBusiness(businessId) : getCustomers(),
      ]);
      setBookings(appts);
      setBusinesses(Array.isArray(bizs) ? bizs : (bizs?.data || []));
      setCustomers(custs || []);
    } catch (err) {
      console.error("Error cargando calendario:", err);
    } finally {
      setLoading(false);
    }
  }, [user, from, to, businessId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Group bookings by date string
  const byDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    for (const b of bookings) {
      if (!map[b.date]) map[b.date] = [];
      map[b.date].push(b);
    }
    return map;
  }, [bookings]);

  const grid = useMemo(() => buildCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  const selectedBookings = selectedDay ? (byDate[selectedDay] ?? []) : [];

  const businessName = (id: number) =>
    businesses.find((b) => b.id === id)?.nombre ?? `Negocio #${id}`;

  const customerName = (id: number) => {
    const c = customers.find((x) => x.id === id);
    if (!c) return null;
    return `${c.name}${c.surname ? " " + c.surname : ""}`;
  };

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function goToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDay(toYMD(today));
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="page-stack" style={{ gap: "24px" }}>
      {/* Header */}
      <section className="page-hero">
        <div>
          <h2 className="text-3xl font-bold">Calendario de Reservas</h2>
          <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
            Vista mensual · {MONTH_NAMES[viewMonth]} {viewYear}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="secondary-btn"
            onClick={goToday}
            style={secondaryBtnStyle}
          >
            Hoy
          </button>
          <button
            className="secondary-btn"
            onClick={prevMonth}
            style={secondaryBtnStyle}
            aria-label="Mes anterior"
          >
            ‹
          </button>
          <button
            className="secondary-btn"
            onClick={nextMonth}
            style={secondaryBtnStyle}
            aria-label="Mes siguiente"
          >
            ›
          </button>
        </div>
      </section>

      {/* Main layout */}
      <div style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "stretch" }}>

        {/* Calendar grid */}
        <div style={calendarContainerStyle}>
          {/* Day names header */}
          <div style={gridHeaderStyle}>
            {DAY_NAMES.map((d) => (
              <div key={d} style={dayNameStyle}>{d}</div>
            ))}
          </div>

          {/* Cells */}
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
              Cargando…
            </div>
          ) : (
            <div style={gridBodyStyle}>
              {grid.map(({ ymd, currentMonth, today }) => {
                const dayBookings = byDate[ymd] ?? [];
                const isSelected = ymd === selectedDay;

                return (
                  <button
                    key={ymd}
                    onClick={() => setSelectedDay(ymd)}
                    style={cellStyle(currentMonth, isSelected, today)}
                  >
                    {/* Day number */}
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        fontSize: 13,
                        fontWeight: today ? 700 : 500,
                        background: today ? "var(--accent-1)" : "transparent",
                        color: today
                          ? "#fff"
                          : currentMonth
                          ? "var(--text)"
                          : "var(--text-muted)",
                      }}
                    >
                      {ymd.split("-")[2]}
                    </span>

                    {/* Booking chips */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
                      {dayBookings.slice(0, 3).map((b) => (
                        <div
                          key={b.id}
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "2px 5px",
                            borderRadius: 4,
                            background: `${STATUS_DOT[b.status] ?? "var(--accent-1)"}22`,
                            color: STATUS_DOT[b.status] ?? "var(--accent-1)",
                            border: `1px solid ${STATUS_DOT[b.status] ?? "var(--accent-1)"}44`,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                          }}
                        >
                          {b.time} {b.serviceName}
                        </div>
                      ))}
                      {dayBookings.length > 3 && (
                        <div style={{ fontSize: 10, color: "var(--text-muted)", paddingLeft: 2 }}>
                          +{dayBookings.length - 3} más
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Day detail panel */}
        <div style={panelStyle}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "var(--text)" }}>
            {selectedDay ? formatDisplayDate(selectedDay) : "Selecciona un día"}
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
            {selectedBookings.length === 0
              ? "Sin reservas"
              : `${selectedBookings.length} reserva${selectedBookings.length > 1 ? "s" : ""}`}
          </p>

          {selectedBookings.length === 0 ? (
            <div style={emptyPanelStyle}>
              <span style={{ fontSize: 32 }}>📅</span>
              <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 8 }}>
                No hay reservas para este día
              </p>
            </div>
          ) : (
            <>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
                gap: 16,
                maxHeight: "500px",
                overflowY: "auto",
                paddingRight: "8px"
              }}>
                {selectedBookings.slice(0, 50).map((b) => (
                <Link 
                  href={`/business/${b.businessId}/bookings`}
                  key={b.id} 
                  style={{ ...bookingCardStyle, textDecoration: "none", cursor: "pointer", display: "block" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                      {b.time}
                    </span>
                    <Badge status={b.status} />
                  </div>
                  <p style={{ fontSize: 13, marginTop: 4, color: "var(--text)" }}>
                    {b.serviceName}
                  </p>
                  <p style={{ fontSize: 11, marginTop: 6, color: "var(--text-muted)", background: "var(--surface)", padding: "4px 8px", borderRadius: "4px", display: "inline-block" }}>
                    {businessName(b.businessId)} · Cliente #{b.customerId}{customerName(b.customerId) ? ` - ${customerName(b.customerId)}` : ""}
                  </p>
                </Link>
              ))}
              </div>
              {selectedBookings.length > 50 && (
                <div style={{ marginTop: 16, textAlign: "center", padding: 12, background: "var(--warning-bg)", color: "var(--warning)", borderRadius: 8, fontWeight: 600 }}>
                  Mostrando 50 de {selectedBookings.length} reservas. Utiliza el listado principal para verlas todas.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={legendStyle}>
        {[
          { label: "Pendiente", color: "var(--warning)" },
          { label: "Confirmada", color: "var(--info)" },
          { label: "Pagada", color: "var(--success)" },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles (inline, matching globals.css dark-glass aesthetic)
// ---------------------------------------------------------------------------

const calendarContainerStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-md)",
  overflow: "hidden",
};

const gridHeaderStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  borderBottom: "1px solid var(--border)",
};

const dayNameStyle: React.CSSProperties = {
  padding: "10px 0",
  textAlign: "center",
  fontSize: 11,
  fontWeight: 700,
  color: "var(--text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const gridBodyStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
};

const cellStyle = (currentMonth: boolean, selected: boolean, isToday: boolean): React.CSSProperties => ({
  padding: "8px 6px",
  minHeight: 90,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  background: selected
    ? "rgba(99,102,241,0.08)"
    : "transparent",
  border: "none",
  borderTop: "1px solid var(--border)",
  borderRight: "1px solid var(--border)",
  cursor: "pointer",
  textAlign: "left",
  opacity: currentMonth ? 1 : 0.4,
  transition: "background 0.15s",
  outline: selected ? "2px solid var(--accent-1)" : "none",
  outlineOffset: -2,
});

const panelStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-md)",
  padding: 24,
};

const bookingCardStyle: React.CSSProperties = {
  background: "var(--surface-hover)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  padding: "10px 12px",
};

const emptyPanelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 0",
};

const legendStyle: React.CSSProperties = {
  display: "flex",
  gap: 20,
  alignItems: "center",
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: "var(--radius-sm)",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
};
