const bookings = [
  {
    id: "RES-001",
    date: "15/04/2026",
    time: "09:00",
    client: "María López",
    business: "Peluquería Nova",
    service: "Corte + peinado",
    status: "Confirmada",
  },
  {
    id: "RES-002",
    date: "15/04/2026",
    time: "10:30",
    client: "Carlos Pérez",
    business: "Restaurante Marea",
    service: "Reserva para 4",
    status: "Pendiente",
  },
  {
    id: "RES-003",
    date: "15/04/2026",
    time: "12:00",
    client: "Lucía Sánchez",
    business: "Barber Studio",
    service: "Corte caballero",
    status: "Pagada",
  },
  {
    id: "RES-004",
    date: "16/04/2026",
    time: "13:30",
    client: "Pedro Ruiz",
    business: "Peluquería Nova",
    service: "Color + secado",
    status: "Confirmada",
  },
];

function getBadgeStyle(status: string) {
  const base = {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
    display: "inline-block",
  };

  if (status === "Confirmada" || status === "Pagada") {
    return {
      ...base,
      backgroundColor: "#dcfce7",
      color: "#166534",
    };
  }

  if (status === "Pendiente") {
    return {
      ...base,
      backgroundColor: "#fef3c7",
      color: "#92400e",
    };
  }

  return {
    ...base,
    backgroundColor: "#e5e7eb",
    color: "#374151",
  };
}

function FilterPill({ label }: { label: string }) {
  return (
    <button
      style={{
        border: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
        borderRadius: "999px",
        padding: "10px 14px",
        fontSize: "14px",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

export default function BookingsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <section
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "24px",
          border: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "30px" }}>Reservas</h2>
          <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
            Gestión de reservas de clientes y comercios.
          </p>
        </div>

        <button
          style={{
            border: "none",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            borderRadius: "14px",
            padding: "12px 18px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Nueva reserva
        </button>
      </section>

      <section
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <FilterPill label="Hoy" />
        <FilterPill label="Pendientes" />
        <FilterPill label="Confirmadas" />
        <FilterPill label="Pagadas" />
        <FilterPill label="Peluquerías" />
        <FilterPill label="Restaurantes" />
      </section>

      <section
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "24px",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "22px" }}>Listado de reservas</h3>
          <span style={{ color: "#6b7280", fontSize: "14px" }}>
            {bookings.length} resultados
          </span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#6b7280" }}>
              <th style={{ padding: "12px 0" }}>ID</th>
              <th style={{ padding: "12px 0" }}>Fecha</th>
              <th style={{ padding: "12px 0" }}>Hora</th>
              <th style={{ padding: "12px 0" }}>Cliente</th>
              <th style={{ padding: "12px 0" }}>Comercio</th>
              <th style={{ padding: "12px 0" }}>Servicio</th>
              <th style={{ padding: "12px 0" }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: "16px 0", fontWeight: 600 }}>{booking.id}</td>
                <td style={{ padding: "16px 0" }}>{booking.date}</td>
                <td style={{ padding: "16px 0" }}>{booking.time}</td>
                <td style={{ padding: "16px 0" }}>{booking.client}</td>
                <td style={{ padding: "16px 0" }}>{booking.business}</td>
                <td style={{ padding: "16px 0" }}>{booking.service}</td>
                <td style={{ padding: "16px 0" }}>
                  <span style={getBadgeStyle(booking.status)}>{booking.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}