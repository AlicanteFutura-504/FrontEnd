import type {
  Booking, CreateBookingDto, UpdateBookingDto,
  Customer, CreateCustomerDto, UpdateCustomerDto,
  Business, CreateBusinessDto, UpdateBusinessDto,
  Service, CreateServiceDto, UpdateServiceDto,
  Employee, CreateEmployeeDto, UpdateEmployeeDto,
  Payment, CreatePaymentDto, UpdatePaymentDto,
} from './types';

export type {
  Booking, BookingStatus, CreateBookingDto, UpdateBookingDto,
  Customer, CreateCustomerDto, UpdateCustomerDto,
  Business, CreateBusinessDto, UpdateBusinessDto,
  Service, CreateServiceDto, UpdateServiceDto,
  Employee, CreateEmployeeDto, UpdateEmployeeDto,
  Payment, CreatePaymentDto, UpdatePaymentDto,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// ─── HELPER ────────────────────────────────────────────────────────────────────

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: 'no-store', ...options });
  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Sin respuesta');
    throw new Error(`Error ${res.status}: ${errorText}`);
  }
  return res.json();
}

const json = (data: unknown) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

const patch = (data: unknown) => ({
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

// ─── APPOINTMENTS ──────────────────────────────────────────────────────────────

export const getAppointments = () =>
  request<Booking[]>(`${API_URL}/appointments`);

export const createAppointment = (data: CreateBookingDto) =>
  request<Booking>(`${API_URL}/appointments`, json(data));

export const updateAppointment = (id: number, data: UpdateBookingDto) =>
  request<Booking>(`${API_URL}/appointments/${id}`, patch(data));

export const deleteAppointment = (id: number) =>
  request<{ message: string }>(`${API_URL}/appointments/${id}`, { method: 'DELETE' });

// ─── CUSTOMERS ─────────────────────────────────────────────────────────────────

export const getCustomers = () =>
  request<Customer[]>(`${API_URL}/customers`);

export const createCustomer = (data: CreateCustomerDto) =>
  request<Customer>(`${API_URL}/customers`, json(data));

export const updateCustomer = (id: number, data: UpdateCustomerDto) =>
  request<Customer>(`${API_URL}/customers/${id}`, patch(data));

export const deleteCustomer = (id: number) =>
  request<{ message: string }>(`${API_URL}/customers/${id}`, { method: 'DELETE' });

// ─── BUSINESSES ────────────────────────────────────────────────────────────────

export const getBusinesses = () =>
  request<Business[]>(`${API_URL}/businesses`);

export const createBusiness = (data: CreateBusinessDto) =>
  request<Business>(`${API_URL}/businesses`, json(data));

export const updateBusiness = (id: number, data: UpdateBusinessDto) =>
  request<Business>(`${API_URL}/businesses/${id}`, patch(data));

export const deleteBusiness = (id: number) =>
  request<{ message: string }>(`${API_URL}/businesses/${id}`, { method: 'DELETE' });

// ─── SERVICES ──────────────────────────────────────────────────────────────────

export const getServices = () =>
  request<Service[]>(`${API_URL}/services`);

export const getServicesByBusiness = (businessId: number) =>
  request<Service[]>(`${API_URL}/services/business/${businessId}`);

export const createService = (data: CreateServiceDto) =>
  request<Service>(`${API_URL}/services`, json(data));

export const updateService = (id: number, data: UpdateServiceDto) =>
  request<Service>(`${API_URL}/services/${id}`, patch(data));

export const deleteService = (id: number) =>
  request<{ message: string }>(`${API_URL}/services/${id}`, { method: 'DELETE' });

// ─── EMPLOYEES ─────────────────────────────────────────────────────────────────

export const getEmployees = () =>
  request<Employee[]>(`${API_URL}/employees`);

export const getEmployeesByBusiness = (businessId: number) =>
  request<Employee[]>(`${API_URL}/employees/business/${businessId}`);

export const createEmployee = (data: CreateEmployeeDto) =>
  request<Employee>(`${API_URL}/employees`, json(data));

export const updateEmployee = (id: number, data: UpdateEmployeeDto) =>
  request<Employee>(`${API_URL}/employees/${id}`, patch(data));

export const deleteEmployee = (id: number) =>
  request<{ message: string }>(`${API_URL}/employees/${id}`, { method: 'DELETE' });

// ─── PAYMENTS ──────────────────────────────────────────────────────────────────

export const getPayments = () =>
  request<Payment[]>(`${API_URL}/payments`);

export const createPayment = (data: CreatePaymentDto) =>
  request<Payment>(`${API_URL}/payments`, json(data));

export const updatePayment = (id: number, data: UpdatePaymentDto) =>
  request<Payment>(`${API_URL}/payments/${id}`, patch(data));

export const deletePayment = (id: number) =>
  request<{ message: string }>(`${API_URL}/payments/${id}`, { method: 'DELETE' });
