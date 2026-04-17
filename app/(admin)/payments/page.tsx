const payments = [
  {
    id: "COB-001",
    client: "María López",
    business: "Peluquería Nova",
    amount: "28 €",
    method: "Tarjeta",
    date: "15/04/2026",
    status: "Pagado",
  },
  {
    id: "COB-002",
    client: "Carlos Pérez",
    business: "Restaurante Marea",
    amount: "80 €",
    method: "Pendiente",
    date: "15/04/2026",
    status: "Por cobrar",
  },
  {
    id: "COB-003",
    client: "Lucía Sánchez",
    business: "Barber Studio",
    amount: "18 €",
    method: "Bizum",
    date: "15/04/2026",
    status: "Pagado",
  },
  {
    id: "COB-004",
    client: "Pedro Ruiz",
    business: "Peluquería Nova",
    amount: "45 €",
    method: "Efectivo",
    date: "16/04/2026",
    status: "Pagado",
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

  if (status === "Pagado") {
    return {
      ...base,
      backgroundColor: "#dcfce7",
      color: "#166534",
    };
  }

  if (status === "Por cobrar") {
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

function SummaryCard({
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

export default function PaymentsPage() {
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
          <h2 style={{ margin: 0, fontSize: "30px" }}>Cobros</h2>
          <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
            Seguimiento de pagos realizados y pendientes.
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
          Registrar cobro
        </button>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "16px",
        }}
      >
        <SummaryCard
          title="Cobrado hoy"
          value="171 €"
          subtitle="4 operaciones registradas"
          subtitleColor="#16a34a"
        />
        <SummaryCard
          title="Pendiente"
          value="80 €"
          subtitle="1 cobro por revisar"
          subtitleColor="#ca8a04"
        />
        <SummaryCard
          title="Método más usado"
          value="Tarjeta"
          subtitle="Mayor volumen del día"
        />
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
          <h3 style={{ margin: 0, fontSize: "22px" }}>Listado de cobros</h3>
          <span style={{ color: "#6b7280", fontSize: "14px" }}>
            {payments.length} resultados
          </span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#6b7280" }}>
              <th style={{ padding: "12px 0" }}>ID</th>
              <th style={{ padding: "12px 0" }}>Cliente</th>
              <th style={{ padding: "12px 0" }}>Comercio</th>
              <th style={{ padding: "12px 0" }}>Importe</th>
              <th style={{ padding: "12px 0" }}>Método</th>
              <th style={{ padding: "12px 0" }}>Fecha</th>
              <th style={{ padding: "12px 0" }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: "16px 0", fontWeight: 600 }}>{payment.id}</td>
                <td style={{ padding: "16px 0" }}>{payment.client}</td>
                <td style={{ padding: "16px 0" }}>{payment.business}</td>
                <td style={{ padding: "16px 0" }}>{payment.amount}</td>
                <td style={{ padding: "16px 0" }}>{payment.method}</td>
                <td style={{ padding: "16px 0" }}>{payment.date}</td>
                <td style={{ padding: "16px 0" }}>
                  <span style={getBadgeStyle(payment.status)}>{payment.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}