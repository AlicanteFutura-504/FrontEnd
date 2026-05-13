// ─── ENUMS / STATUS ────────────────────────────────────────────────────────────

export type BookingStatus = 'pending' | 'confirmed' | 'paid';
export type PaymentStatus = 'pending' | 'confirmed' | 'paid';

// ─── CUSTOMER ──────────────────────────────────────────────────────────────────

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  createdAt: string;
}

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

// ─── BUSINESS ──────────────────────────────────────────────────────────────────

export interface Business {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  openTime: string;
  closeTime: string;
}

export interface CreateBusinessDto {
  name: string;
  address: string;
  phone: string;
  email: string;
  openTime?: string;
  closeTime?: string;
}

export interface UpdateBusinessDto extends Partial<CreateBusinessDto> {}

// ─── SERVICE ───────────────────────────────────────────────────────────────────

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  businessId: number;
  isActive: boolean;
}

export interface CreateServiceDto {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  businessId: number;
  isActive?: boolean;
}

export interface UpdateServiceDto extends Partial<CreateServiceDto> {}

// ─── EMPLOYEE ──────────────────────────────────────────────────────────────────

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty?: string;
  businessId: number;
  isActive: boolean;
}

export interface CreateEmployeeDto {
  name: string;
  email: string;
  phone: string;
  specialty?: string;
  businessId: number;
  isActive?: boolean;
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {}

// ─── BOOKING (APPOINTMENT) ─────────────────────────────────────────────────────

export interface Booking {
  id: number;
  date: string;
  time: string;
  status: BookingStatus;
  customerId: number;
  businessId: number;
  serviceName: string;
}

export interface CreateBookingDto {
  date: string;
  time: string;
  status: BookingStatus;
  customerId: number;
  businessId: number;
  serviceName: string;
}

export interface UpdateBookingDto extends Partial<CreateBookingDto> {}

// ─── PAYMENT ───────────────────────────────────────────────────────────────────

export interface Payment {
  id: number;
  date: string;
  time: string;
  status: PaymentStatus;
  customerId: number;
  businessId: number;
  serviceName: string;
}

export interface CreatePaymentDto {
  date: string;
  time: string;
  status: PaymentStatus;
  customerId: number;
  businessId: number;
  serviceName: string;
}

export interface UpdatePaymentDto extends Partial<CreatePaymentDto> {}
