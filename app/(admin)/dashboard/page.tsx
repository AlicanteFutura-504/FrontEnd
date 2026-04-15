const bookings = [
  {
    time: "09:00",
    client: "María López",
    business: "Peluquería Nova",
    service: "Corte + peinado",
    status: "Confirmada",
  },
  {
    time: "10:30",
    client: "Carlos Pérez",
    business: "Restaurante Marea",
    service: "Reserva para 4",
    status: "Pendiente",
  },
  {
    time: "12:00",
    client: "Lucía Sánchez",
    business: "Barber Studio",
    service: "Corte caballero",
    status: "Pagada",
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

function Card({
  title,
  value,
  subtitle,
  subtitleColor = "#6b7280",
}: {
  title: string;
  value: string;
  subtitle: string;
  subtitleColor?: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        padding: "20px",
        border: "1px solid #e5e7eb",
      }}
    >
      <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>{title}</p>
      <h3 style={{ margin: "10px 0 8px", fontSize: "32px" }}>{value}</h3>
      <p style={{ margin: 0, color: subtitleColor, fontSize: "14px" }}>{subtitle}</p>
    </div>
  );
}

export default function DashboardPage() {
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
        <h2 style={{ margin: 0, fontSize: "30px" }}>Dashboard de reservas</h2>
        <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
          Vista general de reservas, clientes y cobros para comercios.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "16px",
        }}
      >
       <Card
  title="Reservas hoy"
  value="24"
  subtitle="+5 respecto a ayer"
  subtitleColor="#16a34a"
/>
<Card
  title="Cobrado hoy"
  value="820 €"
  subtitle="18 pagos registrados"
/>
<Card
  title="Pendientes"
  value="6"
  subtitle="Seguimiento necesario"
  subtitleColor="#ca8a04"
/>
<Card
  title="Clientes activos"
  value="214"
  subtitle="Este mes"
/>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
        }}
      >
        <div
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
            <h3 style={{ margin: 0, fontSize: "22px" }}>Próximas reservas</h3>
            <button
              style={{
                border: "none",
                background: "none",
                color: "#0369a1",
                cursor: "pointer",
              }}
            >
              Ver todas
            </button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#6b7280" }}>
                <th style={{ padding: "12px 0" }}>Hora</th>
                <th style={{ padding: "12px 0" }}>Cliente</th>
                <th style={{ padding: "12px 0" }}>Comercio</th>
                <th style={{ padding: "12px 0" }}>Servicio</th>
                <th style={{ padding: "12px 0" }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "16px 0", fontWeight: 600 }}>{booking.time}</td>
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
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            padding: "24px",
            border: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "22px" }}>Agenda rápida</h3>

          <div
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: "16px",
              padding: "16px",
            }}
          >
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              Siguiente reserva
            </p>
            <p style={{ margin: "8px 0 4px", fontWeight: 600 }}>María López</p>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              09:00 · Peluquería Nova
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: "16px",
              padding: "16px",
            }}
          >
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              Comercio destacado
            </p>
            <p style={{ margin: "8px 0 4px", fontWeight: 600 }}>Restaurante Marea</p>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              6 reservas hoy
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: "16px",
              padding: "16px",
            }}
          >
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              Recordatorios
            </p>
            <p style={{ margin: "8px 0 0" }}>4 confirmaciones pendientes</p>
          </div>
        </div>
      </section>
    </div>
  );
}