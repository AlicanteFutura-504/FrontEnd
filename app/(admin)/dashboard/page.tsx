/**
 * @fileoverview Página del Dashboard (resumen general del panel de administración).
 * Muestra KPIs del día, una tabla de próximas reservas y un panel de información rápida.
 * Los datos son estáticos (mock) ya que esta sección aún no está conectada al backend.
 * @module app/(admin)/dashboard/page
 */

// ---------------------------------------------------------------------------
// Tipos locales
// ---------------------------------------------------------------------------

/**
 * Estados posibles de una reserva representada en el Dashboard.
 * - `"pending"`   → Pendiente de confirmación.
 * - `"confirmed"` → Confirmada por el negocio.
 * - `"paid"`      → Servicio completado y cobrado.
 */
type DashboardBookingStatus = "pending" | "confirmed" | "paid";

/**
 * Estructura de una reserva tal como se muestra en la tabla del Dashboard.
 * Contiene únicamente los campos necesarios para la vista resumida.
 */
type DashboardBooking = {
  /** Hora de la reserva en formato `"HH:mm"`. */
  time: string;
  /** Nombre completo del cliente. */
  client: string;
  /** Nombre del negocio donde se realiza la reserva. */
  business: string;
  /** Nombre del servicio reservado. */
  service: string;
  /** Estado actual de la reserva. */
  status: DashboardBookingStatus;
};

// ---------------------------------------------------------------------------
// Datos mock (pendiente de conexión con la API)
// ---------------------------------------------------------------------------

/**
 * Lista de reservas de ejemplo para la tabla de "Próximas reservas".
 * @todo Reemplazar por una llamada real a `getAppointments()` cuando esté disponible.
 */
const bookings: DashboardBooking[] = [
  {
    time: "09:00",
    client: "María López",
    business: "Peluquería Nova",
    service: "Corte + peinado",
    status: "confirmed",
  },
  {
    time: "10:30",
    client: "Carlos Pérez",
    business: "Restaurante Marea",
    service: "Reserva para 4",
    status: "pending",
  },
  {
    time: "12:00",
    client: "Lucía Sánchez",
    business: "Barber Studio",
    service: "Corte caballero",
    status: "paid",
  },
];

// ---------------------------------------------------------------------------
// Subcomponentes internos
// ---------------------------------------------------------------------------

/**
 * Props del componente `Badge`.
 */
interface BadgeProps {
  /** Estado de la reserva a representar visualmente. */
  status: DashboardBookingStatus;
}

/**
 * Componente Badge.
 * Renderiza una etiqueta visual coloreada según el estado de la reserva.
 *
 * @param {BadgeProps} props - Props del componente.
 * @returns {JSX.Element} Un `<span>` con la clase CSS y el texto de estado correspondiente.
 */
function Badge({ status }: BadgeProps) {
  const label =
    status === "pending"
      ? "Pendiente"
      : status === "confirmed"
        ? "Confirmada"
        : "Pagada";

  return <span className={`badge badge--${status}`}>{label}</span>;
}

/**
 * Props del componente `KpiCard`.
 */
interface KpiCardProps {
  /** Título descriptivo del indicador (ej: "Reservas hoy"). */
  title: string;
  /** Valor principal a destacar (ej: `"24"` o `"820 €"`). */
  value: string;
  /** Texto secundario informativo mostrado debajo del valor. */
  subtitle: string;
  /**
   * Variante visual opcional que colorea el subtítulo:
   * - `"positive"` → verde (buen resultado).
   * - `"warning"`  → amarillo/naranja (requiere atención).
   * - `undefined`  → color neutro por defecto.
   */
  variant?: "positive" | "warning";
}

/**
 * Componente KpiCard.
 * Tarjeta de indicador clave de rendimiento (KPI) usada en el Dashboard
 * para mostrar métricas del día de forma visual y destacada.
 *
 * @param {KpiCardProps} props - Props del componente.
 * @returns {JSX.Element} Una tarjeta con título, valor principal y subtítulo.
 */
function KpiCard({
  title,
  value,
  subtitle,
  variant,
}: KpiCardProps) {
  return (
    <div className="kpi-card">
      <p className="kpi-card__label">{title}</p>
      <h3 className="kpi-card__value">{value}</h3>
      <p
        className={`kpi-card__meta ${
          variant === "positive"
            ? "kpi-card__meta--positive"
            : variant === "warning"
              ? "kpi-card__meta--warning"
              : ""
        }`}
      >
        {subtitle}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------

/**
 * Página del Dashboard.
 * Muestra un resumen del estado diario de la plataforma: KPIs,
 * tabla de próximas reservas y un panel lateral de información rápida.
 *
 * @remarks
 * Actualmente usa datos estáticos (mock). Pendiente de integración con la API.
 *
 * @returns {JSX.Element} El panel de resumen del Dashboard.
 */
export default function DashboardPage() {
  return (
    <div className="page-stack">
      {/* Hero: título de sección */}
      <section className="page-hero">
        <div>
          <h2>Dashboard overview</h2>
          <p>Control diario de reservas, actividad y pagos.</p>
        </div>

        <button className="primary-btn" type="button">
          Export report
        </button>
      </section>

      {/* KPIs del día */}
      <section className="kpi-grid">
        <KpiCard
          title="Reservas hoy"
          value="24"
          subtitle="+5 respecto a ayer"
          variant="positive"
        />
        <KpiCard title="Cobrado hoy" value="820 €" subtitle="18 pagos registrados" />
        <KpiCard
          title="Pendientes"
          value="6"
          subtitle="Seguimiento necesario"
          variant="warning"
        />
        <KpiCard title="Clientes activos" value="214" subtitle="Este mes" />
      </section>

      {/* Grid principal: tabla de reservas + panel lateral */}
      <section className="dashboard-grid">
        <div className="section-card">
          <div className="panel-title-row">
            <h3 className="panel-title">Próximas reservas</h3>
            <button className="panel-subtle-link" type="button">
              Ver todas
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Comercio</th>
                <th>Servicio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 600 }}>{booking.time}</td>
                  <td>{booking.client}</td>
                  <td>{booking.business}</td>
                  <td>{booking.service}</td>
                  <td>
                    <Badge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Panel lateral de información contextual */}
        <div className="info-stack">
          <div className="info-box">
            <p className="info-box__eyebrow">Siguiente reserva</p>
            <p className="info-box__title">María López</p>
            <p className="info-box__text">09:00 · Peluquería Nova</p>
          </div>

          <div className="info-box">
            <p className="info-box__eyebrow">Comercio destacado</p>
            <p className="info-box__title">Restaurante Marea</p>
            <p className="info-box__text">6 reservas hoy</p>
          </div>

          <div className="info-box">
            <p className="info-box__eyebrow">Recordatorios</p>
            <p className="info-box__title">4 confirmaciones pendientes</p>
            <p className="info-box__text">Revisión recomendada esta mañana</p>
          </div>
        </div>
      </section>
    </div>
  );
}