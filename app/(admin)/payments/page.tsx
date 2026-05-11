/**
 * @fileoverview Página del módulo de Payments (cobros).
 * Muestra KPIs de facturación del día y una tabla con el historial de cobros.
 * Los datos son estáticos (mock) pendientes de integración con la API de pagos.
 * @module app/(admin)/payments/page
 */

// ---------------------------------------------------------------------------
// Tipos locales
// ---------------------------------------------------------------------------

/**
 * Estados posibles de un cobro en el sistema.
 * - `"pending"` → El cobro está pendiente de realizarse.
 * - `"paid"`    → El cobro ya ha sido completado.
 */
type PaymentStatus = "pending" | "paid";

/**
 * Representa un registro de cobro en la tabla de pagos.
 */
type Payment = {
  /** Identificador legible del cobro (ej: `"COB-001"`). */
  id: string;
  /** Nombre completo del cliente que realiza el pago. */
  client: string;
  /** Nombre del negocio receptor del pago. */
  business: string;
  /** Importe del cobro formateado como cadena (ej: `"28 €"`). */
  amount: string;
  /** Método de pago utilizado (ej: `"Tarjeta"`, `"Bizum"`, `"Efectivo"`). */
  method: string;
  /** Fecha del cobro en formato `"DD/MM/AAAA"`. */
  date: string;
  /** Estado actual del cobro. */
  status: PaymentStatus;
};

// ---------------------------------------------------------------------------
// Datos mock (pendiente de conexión con la API)
// ---------------------------------------------------------------------------

/**
 * Lista estática de cobros de ejemplo para la tabla de pagos.
 * @todo Reemplazar por una llamada real a la API de pagos cuando esté disponible.
 */
const payments: Payment[] = [
  {
    id: "COB-001",
    client: "María López",
    business: "Peluquería Nova",
    amount: "28 €",
    method: "Tarjeta",
    date: "15/04/2026",
    status: "paid",
  },
  {
    id: "COB-002",
    client: "Carlos Pérez",
    business: "Restaurante Marea",
    amount: "80 €",
    method: "Pendiente",
    date: "15/04/2026",
    status: "pending",
  },
  {
    id: "COB-003",
    client: "Lucía Sánchez",
    business: "Barber Studio",
    amount: "18 €",
    method: "Bizum",
    date: "15/04/2026",
    status: "paid",
  },
  {
    id: "COB-004",
    client: "Pedro Ruiz",
    business: "Peluquería Nova",
    amount: "45 €",
    method: "Efectivo",
    date: "16/04/2026",
    status: "paid",
  },
];

// ---------------------------------------------------------------------------
// Subcomponentes internos
// ---------------------------------------------------------------------------

/**
 * Props del componente `KpiCard`.
 */
interface KpiCardProps {
  /** Título descriptivo del indicador (ej: "Cobrado hoy"). */
  title: string;
  /** Valor principal a destacar (ej: `"171 €"` o `"84%"`). */
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
 * Tarjeta de indicador clave de rendimiento (KPI) para el módulo de Payments.
 * Muestra una métrica financiera con título, valor y subtítulo opcionales.
 *
 * @param {KpiCardProps} props - Props del componente.
 * @returns {JSX.Element} Una tarjeta con el indicador financiero.
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

/**
 * Props del componente `Badge`.
 */
interface BadgeProps {
  /** Estado del cobro a representar visualmente. */
  status: PaymentStatus;
}

/**
 * Componente Badge.
 * Renderiza una etiqueta visual coloreada según el estado del cobro.
 * Mapea `"pending"` → clase `badge--pending` y `"paid"` → clase `badge--confirmed`.
 *
 * @param {BadgeProps} props - Props del componente.
 * @returns {JSX.Element} Un `<span>` con la clase CSS y el texto de estado.
 */
function Badge({ status }: BadgeProps) {
  return (
    <span className={`badge badge--${status === "pending" ? "pending" : "confirmed"}`}>
      {status === "pending" ? "Por cobrar" : "Pagado"}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------

/**
 * Página del módulo de Payments (cobros).
 * Muestra KPIs de facturación del día y una tabla con el histórico de cobros,
 * con indicación visual del estado de cada operación.
 *
 * @remarks
 * Actualmente usa datos estáticos (mock). Pendiente de integración con la API de pagos.
 *
 * @returns {JSX.Element} El panel completo del módulo de cobros.
 */
export default function PaymentsPage() {
  return (
    <div className="page-stack">
      {/* Hero: título de sección + botón de acción principal */}
      <section className="page-hero">
        <div>
          <h2>Payments</h2>
          <p>Seguimiento de cobros realizados y pendientes.</p>
        </div>

        <button className="primary-btn" type="button">
          Registrar cobro
        </button>
      </section>

      {/* KPIs de facturación */}
      <section className="kpi-grid">
        <KpiCard
          title="Cobrado hoy"
          value="171 €"
          subtitle="4 operaciones registradas"
          variant="positive"
        />
        <KpiCard
          title="Pendiente"
          value="80 €"
          subtitle="1 cobro por revisar"
          variant="warning"
        />
        <KpiCard title="Método más usado" value="Tarjeta" subtitle="Mayor volumen del día" />
        <KpiCard title="Conversión" value="84%" subtitle="Cobros cerrados hoy" />
      </section>

      {/* Tabla de cobros */}
      <section className="section-card">
        <div className="panel-title-row">
          <h3 className="panel-title">Listado de cobros</h3>
          <span style={{ color: "#6b7280", fontSize: 14 }}>
            {payments.length} resultados
          </span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Comercio</th>
              <th>Importe</th>
              <th>Método</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td style={{ fontWeight: 600 }}>{payment.id}</td>
                <td>{payment.client}</td>
                <td>{payment.business}</td>
                <td>{payment.amount}</td>
                <td>{payment.method}</td>
                <td>{payment.date}</td>
                <td>
                  <Badge status={payment.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}