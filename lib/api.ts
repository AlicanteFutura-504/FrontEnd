import type {
  Booking,
  BookingStatus,
  CreateBookingDto,
  UpdateBookingDto,
  Payment,
  PaymentStatus,
  PaymentTypeEnum,
  CreatePaymentDtoReq,
  UpdatePaymentDtoReq,
  Business,
  Customer,
  User
} from "./types";

// Reexportamos los tipos para que el resto de la aplicación 
// que importa desde lib/api.ts no se rompa y siga funcionando sin cambios.
export type {
  Booking, BookingStatus, CreateBookingDto, UpdateBookingDto,
  Payment, PaymentStatus, PaymentTypeEnum, CreatePaymentDtoReq, UpdatePaymentDtoReq,
  Business, Customer, User
};

// URL base del backend. Se saca de variables de entorno, o usa el localhost por defecto.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("access_token") || "";
  }

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 3. Interceptamos posibles errores de autenticación
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      // Ignorar /payments de la redirección automática
      if (
        window.location.pathname !== "/login" &&
        !window.location.pathname.startsWith("/payments")
      ) {
        window.location.href = "/login";
      }
    }
  }

  return res;
}

export async function getAppointments(): Promise<Booking[]> {
  const res = await fetchWithAuth(`/appointments`, { cache: "no-store" });
  if (res.status === 401) return [];
  if (!res.ok) throw new Error("Error al obtener reservas");
  return res.json();
}

export async function createAppointment(data: CreateBookingDto): Promise<Booking> {
  const res = await fetchWithAuth(`/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear reserva");
  return res.json();
}

export async function updateAppointment(id: number, data: UpdateBookingDto): Promise<Booking> {
  const res = await fetchWithAuth(`/appointments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al editar reserva");
  return res.json();
}

export async function deleteAppointment(id: number): Promise<{ message: string }> {
  const res = await fetchWithAuth(`/appointments/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar reserva");
  const text = await res.text();
  return text ? JSON.parse(text) : { message: `Reserva eliminada` };
}

export async function getPayments(): Promise<Payment[]> {
  const res = await fetchWithAuth(`/payments`, { cache: "no-store" });
  if (res.status === 401) return [];
  if (!res.ok) throw new Error("Error al obtener pagos");
  return res.json();
}

export async function createPayment(data: CreatePaymentDtoReq): Promise<Payment> {
  const res = await fetchWithAuth(`/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear pago");
  return res.json();
}

export async function updatePayment(id: number, data: UpdatePaymentDtoReq): Promise<Payment> {
  const res = await fetchWithAuth(`/payments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al editar pago");
  return res.json();
}

export async function deletePayment(id: number): Promise<{ message: string }> {
  const res = await fetchWithAuth(`/payments/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar pago");
  const text = await res.text();
  return text ? JSON.parse(text) : { message: `Pago eliminado` };
}

export async function loginUsuario(identifier: string, contrasena: string): Promise<any> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, contrasena }),
  });

  if (!res.ok) throw new Error("Nombre de usuario o contraseña incorrectos");
  
  const data = await res.json();
  if (data?.access_token && typeof window !== "undefined") {
    localStorage.setItem("access_token", data.access_token);
  }
  return data;
}

export async function createBusiness(nombre: string, contrasena: string, usuarioId: number): Promise<any> {
  const res = await fetchWithAuth(`/business`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, contrasena, usuarioId }),
  });
  if (!res.ok) throw new Error("Error al crear empresa");
  return res.json();
}

export async function getBusinesses(): Promise<Business[]> {
  const res = await fetchWithAuth(`/business`, { cache: "no-store" });
  if (res.status === 401) return [];
  if (!res.ok) throw new Error("Error al obtener negocios");
  return res.json();
}

export async function getCustomers(): Promise<Customer[]> {
  const res = await fetchWithAuth(`/customers`, { cache: "no-store" });
  if (res.status === 401) return [];
  if (!res.ok) throw new Error("Error al obtener clientes");
  return res.json();
}

export async function createCustomer(data: Partial<Customer>): Promise<Customer> {
  const res = await fetchWithAuth(`/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear cliente");
  return res.json();
}