/**
 * @fileoverview Página del directorio de clientes.
 * Muestra una cuadrícula de tarjetas con información básica de cada cliente
 * y su próxima reserva. Los datos son estáticos (mock) pendientes de integración con la API.
 * @module app/(admin)/customers/page
 */

// ---------------------------------------------------------------------------
// Datos mock (pendiente de conexión con la API)
// ---------------------------------------------------------------------------

/**
 * Lista estática de clientes de ejemplo para la vista de directorio.
 * @todo Reemplazar por una llamada real a la API de clientes cuando esté disponible.
 */
const customers = [
  {
    /** Identificador legible del cliente. */
    id: "C-001",
    name: "María López",
    phone: "600 123 456",
    email: "maria@email.com",
    /** Nombre del negocio asociado al cliente. */
    business: "Peluquería Nova",
    /** Descripción textual de la próxima reserva del cliente. */
    nextBooking: "Hoy · 09:00",
  },
  {
    id: "C-002",
    name: "Carlos Pérez",
    phone: "611 456 789",
    email: "carlos@email.com",
    business: "Restaurante Marea",
    nextBooking: "Hoy · 10:30",
  },
  {
    id: "C-003",
    name: "Lucía Sánchez",
    phone: "622 987 654",
    email: "lucia@email.com",
    business: "Barber Studio",
    nextBooking: "Mañana · 12:00",
  },
];

// ---------------------------------------------------------------------------
// Subcomponentes internos
// ---------------------------------------------------------------------------

/**
 * Props del componente `CustomerCard`.
 */
interface CustomerCardProps {
  /**
   * Objeto cliente a renderizar.
   * El tipo se infiere directamente del array `customers` para mantener consistencia.
   */
  customer: (typeof customers)[0];
}

/**
 * Componente CustomerCard.
 * Tarjeta visual que representa a un cliente en el directorio.
 * Muestra nombre, teléfono, email, negocio asociado y próxima reserva.
 *
 * @param {CustomerCardProps} props - Props del componente.
 * @returns {JSX.Element} Una tarjeta con la información resumida del cliente.
 */
function CustomerCard({
  customer,
}: CustomerCardProps) {
  return (
    <div className="customer-card">
      <p className="customer-name">{customer.name}</p>
      <p className="customer-meta">{customer.phone}</p>
      <p className="customer-meta">{customer.email}</p>
      <div className="customer-tag">{customer.business}</div>
      <div className="customer-next">
        <strong>Próxima reserva:</strong> {customer.nextBooking}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------

/**
 * Página del directorio de clientes.
 * Renderiza un panel de búsqueda/filtrado y una cuadrícula de `CustomerCard`
 * con todos los clientes disponibles.
 *
 * @remarks
 * Actualmente usa datos estáticos (mock). La búsqueda y el filtrado
 * están pendientes de implementación.
 *
 * @returns {JSX.Element} El panel completo del directorio de clientes.
 */
export default function CustomersPage() {
  return (
    <div className="page-stack">
      {/* Hero: título de sección + botón de acción principal */}
      <section className="page-hero">
        <div>
          <h2>Customer directory</h2>
          <p>Gestión visual de clientes y próximas reservas.</p>
        </div>

        <button className="primary-btn" type="button">
          Nuevo cliente
        </button>
      </section>

      {/* Barra de búsqueda y filtrado (pendiente de implementar) */}
      <section className="section-card">
        <div className="search-row">
          <input className="input" placeholder="Buscar cliente..." />
          <button className="secondary-btn" type="button">
            Filtrar
          </button>
        </div>
      </section>

      {/* Cuadrícula de tarjetas de clientes */}
      <section className="customer-grid">
        {customers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </section>
    </div>
  );
}