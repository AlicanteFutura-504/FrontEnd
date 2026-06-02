/**
 * @fileoverview Definición de tipos compartidos para el módulo de citas/reservas.
 * @module lib/types
 */

/**
 * Estados posibles de una cita en el sistema.  
 */
export type BookingStatus = "pending" | "confirmed" | "paid";

/**
 * Representa una cita/reserva tal como se almacena en la base de datos.
 */
export interface Booking {
  id: number;
  date: string;
  time: string;
  status: BookingStatus;
  customerId: number;
  businessId: number;
  serviceName: string;
  payment?: Pick<Payment, "amount" | "status" | "type"> | null;
}

export interface CreateBookingDto {
  date: string;
  time: string;
  status: BookingStatus;
  customerId: number;
  businessId: number;
  serviceName: string;
}

export interface UpdateBookingDto {
  date?: string;
  time?: string;
  status?: BookingStatus;
  customerId?: number;
  businessId?: number;
  serviceName?: string;
}

export type PaymentStatus = "pagado" | "pendiente";
export type PaymentTypeEnum = "tarjeta" | "efectivo" | "bizum" | "transferencia" | "pendiente";

export interface Payment {
  id: number;
  status: PaymentStatus;
  type: PaymentTypeEnum;
  clientName: string;
  businessName: string;
  amount: number;
  date?: string;
  bookingId?: number;
  customerId?: number;
  businessId?: number;
}

export interface CreatePaymentDtoReq {
  status: PaymentStatus;
  type: PaymentTypeEnum;
  clientName?: string;
  businessName?: string;
  amount: number;
  date?: string;
  bookingId?: number;
  customerId?: number;
  businessId?: number;
}

export interface UpdatePaymentDtoReq {
  status?: PaymentStatus;
  type?: PaymentTypeEnum;
  clientName?: string;
  businessName?: string;
  amount?: number;
  date?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'superadmin' | 'admin' | 'business';
  nombreCompleto?: string;
  dni?: string;
  profilePicture?: string;
  /** ID del negocio asociado. Solo presente cuando role === 'business'. */
  businessId?: number | null;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  nombreCompleto?: string;
  dni?: string;
  contrasena?: string;
  profilePicture?: string;
}

export interface Business {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  usuarioId: number;
  businessUserId?: number;
  usuario?: User;
}

export type BusinessPayload = Partial<
  Pick<Business, "nombre" | "direccion" | "telefono" | "usuarioId" | "businessUserId">
>;

export interface Customer {
  id: number;
  name: string;
  surname?: string;
  email: string;
  phone?: string;
  businessId?: number;
}
