import type {
  Booking,
  CreateBookingDto,
  UpdateBookingDto,
  Payment,
  CreatePaymentDtoReq,
  UpdatePaymentDtoReq,
  Business,
  Customer,
  User,
  UpdateUserDto,
  BookingStatus,
  PaymentStatus,
  PaymentTypeEnum
} from "./types";

export type {
  Booking,
  CreateBookingDto,
  UpdateBookingDto,
  Payment,
  CreatePaymentDtoReq,
  UpdatePaymentDtoReq,
  Business,
  Customer,
  User,
  UpdateUserDto,
  BookingStatus,
  PaymentStatus,
  PaymentTypeEnum
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Export refresh triggered to solve build issues

/**
 * Obtiene los headers necesarios para las peticiones, incluyendo el token de autenticación.
 */
function getHeaders(contentType: boolean = true) {
  const headers: Record<string, string> = {};
  
  if (contentType) {
    headers["Content-Type"] = "application/json";
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Maneja las respuestas de la API de forma centralizada.
 */
async function handleResponse(res: Response) {
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      // Redirigir al usuario al login automáticamente cuando su sesión caduque
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Error desconocido");
    let errorMessage = `Error (Status: ${res.status})`;
    try {
      const errorObj = JSON.parse(errorText);
      errorMessage = errorObj.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// --- AUTH ---

export async function loginUsuario(identifier: string, contrasena: string): Promise<{ access_token: string, user: User }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, contrasena }),
  });
  const data = await handleResponse(res);
  if (data?.access_token && typeof window !== "undefined") {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  return data;
}

export async function registerAdmin(data: { username: string, email: string, contrasena: string, nombreCompleto: string, dni: string }): Promise<User> {
  const res = await fetch(`${API_URL}/usuarios/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateMe(data: UpdateUserDto): Promise<User> {
  const res = await fetch(`${API_URL}/usuarios/me/update`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
  const res = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// --- BUSINESS ---

export async function getBusinesses(): Promise<Business[]> {
  const res = await fetch(`${API_URL}/business`, { headers: getHeaders() });
  return handleResponse(res) || [];
}

export async function createBusiness(data: any): Promise<Business> {
  const res = await fetch(`${API_URL}/business`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getBusiness(id: number): Promise<Business> {
  const res = await fetch(`${API_URL}/business/${id}`, { headers: getHeaders() });
  return handleResponse(res);
}

export async function updateBusiness(id: number, data: any): Promise<Business> {
  const res = await fetch(`${API_URL}/business/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteBusiness(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/business/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

// --- APPOINTMENTS ---

export async function getAppointments(): Promise<Booking[]> {
  const res = await fetch(`${API_URL}/appointments`, { headers: getHeaders() });
  return handleResponse(res) || [];
}

export async function createAppointment(data: CreateBookingDto): Promise<Booking> {
  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateAppointment(id: number, data: UpdateBookingDto): Promise<Booking> {
  const res = await fetch(`${API_URL}/appointments/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteAppointment(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/appointments/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

// --- BOOKINGS (NEW) ---

export async function getBookingsByBusiness(businessId: string): Promise<Booking[]> {
  const res = await fetch(`${API_URL}/bookings/business/${businessId}`, { headers: getHeaders() });
  return handleResponse(res) || [];
}

export async function createBooking(data: CreateBookingDto): Promise<Booking> {
  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateBooking(id: number, data: UpdateBookingDto): Promise<Booking> {
  const res = await fetch(`${API_URL}/bookings/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteBooking(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/bookings/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

// --- PAYMENTS ---

export async function getPayments(): Promise<Payment[]> {
  const res = await fetch(`${API_URL}/payments`, { headers: getHeaders() });
  return handleResponse(res) || [];
}

export async function createPayment(data: CreatePaymentDtoReq): Promise<Payment> {
  const res = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updatePayment(id: number, data: UpdatePaymentDtoReq): Promise<Payment> {
  const res = await fetch(`${API_URL}/payments/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deletePayment(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/payments/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

// --- CUSTOMERS ---

export async function getCustomers(): Promise<Customer[]> {
  const res = await fetch(`${API_URL}/customers`, { headers: getHeaders() });
  return handleResponse(res) || [];
}

export async function createCustomer(data: Partial<Customer>): Promise<Customer> {
  const res = await fetch(`${API_URL}/customers`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}