/**
 * @fileoverview Definición de tipos compartidos para el módulo de citas/reservas.
 * @module lib/types
 */

/**
 * Estados posibles de una cita en el sistema.  
 * - `"pending"`   → La reserva está creada pero aún no ha sido confirmada.
 * - `"confirmed"` → El negocio ha confirmado la reserva.
 * - `"paid"`      → La reserva ha sido completada y cobrada.
 */
export type BookingStatus = "pending" | "confirmed" | "paid";

/**
 * Representa una cita/reserva tal como se almacena en la base de datos
 * y se devuelve desde la API del backend.
 */
export interface Booking {
  /** Identificador único autoincremental de la cita. */
  id: number;
  /** Fecha de la cita en formato ISO 8601 (ej: `"2026-05-11"`). */
  date: string;
  /** Hora de la cita en formato `"HH:mm"` (ej: `"10:30"`). */
  time: string;
  /** Estado actual de la cita. */
  status: BookingStatus;
  /** ID del cliente que realizó la reserva. */
  customerId: number;
  /** ID del negocio donde se realiza el servicio. */
  businessId: number;
  /** Nombre descriptivo del servicio reservado. */
  serviceName: string;
}

/**
 * Estructura de datos necesaria para crear una nueva reserva (POST).
 */
export interface CreateBookingDto {
  date: string;
  time: string;
  status: BookingStatus;
  customerId: number;
  businessId: number;
  serviceName: string;
}

/**
 * Estructura de datos opcionales para actualizar una reserva (PATCH).
 * Al usar el símbolo `?`, todos los parámetros son opcionales.
 */
export interface UpdateBookingDto {
  date?: string;
  time?: string;
  status?: BookingStatus;
  customerId?: number;
  businessId?: number;
  serviceName?: string;
}

/**
 * Estados posibles de un pago en el sistema.
 */
export type PaymentStatus = "pagado" | "pendiente";

/**
 * Tipos/métodos de pago posibles.
 */
export type PaymentTypeEnum = "tarjeta" | "efectivo" | "bizum" | "transferencia" | "pendiente";

/**
 * Representa un pago tal como se almacena en la base de datos.
 */
export interface Payment {
  id: number;
  status: PaymentStatus;
  type: PaymentTypeEnum;
  clientName: string;
  businessName: string;
  amount: number;
  date?: string;
}

/**
 * Estructura de datos necesaria para crear un pago (POST).
 */
export interface CreatePaymentDtoReq {
  status: PaymentStatus;
  type: PaymentTypeEnum;
  clientName: string;
  businessName: string;
  amount: number;
  date?: string;
}

/**
 * Estructura de datos opcionales para actualizar un pago (PATCH).
 */
export interface UpdatePaymentDtoReq {
  status?: PaymentStatus;
  type?: PaymentTypeEnum;
  clientName?: string;
  businessName?: string;
  amount?: number;
  date?: string;
}