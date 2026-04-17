const customers = [
  {
    id: "C-001",
    name: "María López",
    phone: "600 123 456",
    email: "maria@email.com",
    business: "Peluquería Nova",
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

function CustomerCard({
  customer,
}: {
  customer: (typeof customers)[0];
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        padding: "20px",
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div style={{ fontWeight: 600, fontSize: "18px" }}>
        {customer.name}
      </div>

      <div style={{ fontSize: "14px", color: "#6b7280" }}>
        {customer.phone}
      </div>

      <div style={{ fontSize: "14px", color: "#6b7280" }}>
        {customer.email}
      </div>

      <div
        style={{
          fontSize: "13px",
          backgroundColor: "#f1f5f9",
          padding: "6px 10px",
          borderRadius: "8px",
          width: "fit-content",
        }}
      >
        {customer.business}
      </div>

      <div style={{ marginTop: "10px", fontSize: "14px" }}>
        <strong>Próxima reserva:</strong> {customer.nextBooking}
      </div>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <section
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "24px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "30px" }}>Clientes</h2>
        <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
          Gestión de clientes y sus próximas reservas.
        </p>
      </section>

      <section
        style={{
          display: "flex",
          gap: "12px",
        }}
      >
        <input
          placeholder="Buscar cliente..."
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        />

        <button
          style={{
            border: "none",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            borderRadius: "12px",
            padding: "12px 16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Nuevo cliente
        </button>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {customers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </section>
    </div>
  );
}