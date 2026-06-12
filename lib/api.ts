import type {
  Booking,
  CreateBookingDto,
  UpdateBookingDto,
  Payment,
  CreatePaymentDtoReq,
  UpdatePaymentDtoReq,
  Business,
  User,
  UpdateUserDto,
  BookingStatus,
  PaymentStatus,
  PaymentTypeEnum,
  Review
} from "./types";

export type {
  Booking,
  CreateBookingDto,
  UpdateBookingDto,
  Payment,
  CreatePaymentDtoReq,
  UpdatePaymentDtoReq,
  Business,
  User,
  UpdateUserDto,
  BookingStatus,
  PaymentStatus,
  PaymentTypeEnum,
  Review
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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

export async function uploadAvatar(file: File): Promise<{ profilePicture: string }> {
  const token = localStorage.getItem("access_token");
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/usuarios/me/avatar`, {
    method: "POST",
    headers,
    body: formData,
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

export async function getClients(page: number = 1, limit: number = 20, search: string = ''): Promise<{ data: User[], total: number }> {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString(), search });
  const res = await fetch(`${API_URL}/usuarios/guests?${params.toString()}`, { headers: getHeaders() });
  return handleResponse(res) || { data: [], total: 0 };
}

export async function getAllClients(search: string = ''): Promise<User[]> {
  const PAGE_LIMIT = 1000;
  const response = await getClients(1, PAGE_LIMIT, search);
  return response.data;
}

export async function getClientByEmail(email: string): Promise<User | null> {
  const res = await fetch(`${API_URL}/usuarios/by-email/${encodeURIComponent(email)}`, {
    headers: getHeaders(),
  });
  if (res.status === 404) return null;
  return handleResponse(res);
}

export async function getClientsByBusiness(businessId: string, page: number = 1, limit: number = 20, search: string = ''): Promise<{ data: User[], total: number }> {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString(), search });
  const res = await fetch(`${API_URL}/usuarios/guests/property/${businessId}?${params.toString()}`, { headers: getHeaders() });
  return handleResponse(res) || { data: [], total: 0 };
}

export async function createClient(data: Partial<User>): Promise<User> {
  const res = await fetch(`${API_URL}/usuarios/guests`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateClient(id: number, data: Partial<User>): Promise<User> {
  const res = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getAllClientsByBusiness(businessId: string, search: string = ''): Promise<User[]> {
  const PAGE_LIMIT = 1000;
  const response = await getClientsByBusiness(businessId, 1, PAGE_LIMIT, search);
  return response.data;
}

// --- BUSINESS / PROPERTIES ---

export async function getBusinesses(
  page: number = 1,
  limit: number = 20,
  search: string = '',
  sortBy: string = '',
  sortOrder: string = '',
  filterField: string = '',
  filterValue: string = ''
): Promise<{ data: Business[], total: number }> {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString(), search });
  if (sortBy) params.append('sortBy', sortBy);
  if (sortOrder) params.append('sortOrder', sortOrder);
  if (filterField) params.append('filterField', filterField);
  if (filterValue) params.append('filterValue', filterValue);

  // 🛠️ CORRECCIÓN: Si no se define filtro de precio, forzamos un rango alto para evitar que el backend aplique su filtro de 300€ por defecto.
  if (filterField !== 'maxPrice' && filterField !== 'precio') {
    params.append('maxPrice', '1000');
    params.append('limit', limit.toString());
  }

  const res = await fetch(`${API_URL}/properties?${params.toString()}`, { headers: getHeaders() });
  return handleResponse(res) || { data: [], total: 0 };
}

export async function getAllBusinesses(search: string = ''): Promise<Business[]> {
  const PAGE_LIMIT = 1000;
  // 🛠️ SOLUCIÓN AL LÍMITE DE 25: Forzamos el paso de parámetros limpios para saltarnos restricciones del backend
  const params = new URLSearchParams({ page: "1", limit: PAGE_LIMIT.toString(), search, maxPrice: "1000" });
  const res = await fetch(`${API_URL}/properties?${params.toString()}`, { headers: getHeaders() });
  const response = await handleResponse(res);
  return response?.data || response || [];
}

export async function createBusiness(data: any): Promise<Business> {
  const res = await fetch(`${API_URL}/properties`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getBusiness(id: number): Promise<Business> {
  const res = await fetch(`${API_URL}/properties/${id}`, { headers: getHeaders() });
  return handleResponse(res);
}

export async function updateBusiness(id: number, data: any): Promise<Business> {
  const res = await fetch(`${API_URL}/properties/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteBusiness(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/properties/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

// --- REVIEWS (¡AÑADIDO NUEVO PARA SOLUCIONAR CRASHEOS!) ---

export async function getPropertyReviews(propertyId: number): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/properties/${propertyId}/reviews`, { headers: getHeaders() });
    return await handleResponse(res) || [];
  } catch (error) {
    console.error("Error cargando reviews:", error);
    return [];
  }
}

export async function createPropertyReview(propertyId: number, data: { score: number; comment: string }): Promise<any> {
  const res = await fetch(`${API_URL}/properties/${propertyId}/reviews`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// --- DASHBOARD & BOOKINGS ---

export async function getDashboardSummary(range?: string) {
  const url = range ? `${API_URL}/dashboard/summary?range=${range}` : `${API_URL}/dashboard/summary`;
  const res = await fetch(url, { headers: getHeaders() });
  return handleResponse(res);
}

export async function getBusinessDashboardSummary(businessId: string | number, range?: string) {
  const url = range ? `${API_URL}/dashboard/property/${businessId}?range=${range}` : `${API_URL}/dashboard/property/${businessId}`;
  const res = await fetch(url, { headers: getHeaders() });
  return handleResponse(res);
}

export async function getBookings(page: number = 1, limit: number = 20, search: string = ''): Promise<{ data: Booking[], total: number }> {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString(), search });
  const res = await fetch(`${API_URL}/bookings?${params.toString()}`, { headers: getHeaders() });
  return handleResponse(res) || { data: [], total: 0 };
}

export async function getAllBookings(search: string = ''): Promise<Booking[]> {
  const PAGE_LIMIT = 1000;
  const response = await getBookings(1, PAGE_LIMIT, search);
  return response.data;
}

// --- APPOINTMENTS ---

export async function getAppointments(page: number = 1, limit: number = 20, search: string = ''): Promise<{ data: Booking[], total: number }> {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString(), search });
  const res = await fetch(`${API_URL}/appointments?${params.toString()}`, { headers: getHeaders() });
  return handleResponse(res) || { data: [], total: 0 };
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

export async function getAppointmentsByRange(from: string, to: string, businessId?: string): Promise<Booking[]> {
  let url = `${API_URL}/bookings/calendar?from=${from}&to=${to}`;
  if (businessId) url += `&propertyId=${businessId}`;
  try {
    const res = await fetch(url, { headers: getHeaders() });
    return handleResponse(res) || [];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Error al conectar con el backend (${url}): ${message}`);
  }
}

// --- BOOKINGS REAL-ESTATE ---

export async function getBookingsByBusiness(businessId: string, page: number = 1, limit: number = 20, search: string = ''): Promise<{ data: Booking[], total: number }> {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString(), search });
  const res = await fetch(`${API_URL}/bookings/property/${businessId}?${params.toString()}`, { headers: getHeaders() });
  return handleResponse(res) || { data: [], total: 0 };
}

export async function getAllBookingsByBusiness(businessId: string, search: string = ''): Promise<Booking[]> {
  const PAGE_LIMIT = 1000;
  const response = await getBookingsByBusiness(businessId, 1, PAGE_LIMIT, search);
  return response.data;
}

export async function getBookingsByCustomer(customerId: number): Promise<Booking[]> {
  const res = await fetch(`${API_URL}/bookings/customer/${customerId}`, { headers: getHeaders() });
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

export async function getPayments(page: number = 1, limit: number = 20, search: string = '', businessId: string = ''): Promise<{ data: Payment[], total: number }> {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString(), search });
  if (businessId) params.append('propertyId', businessId);
  const res = await fetch(`${API_URL}/payments?${params.toString()}`, { headers: getHeaders() });
  return handleResponse(res) || { data: [], total: 0 };
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