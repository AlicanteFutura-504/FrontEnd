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
export type AppointmentStatus = "pending" | "confirmed" | "paid";

/**
 * Representa una cita/reserva tal como se almacena en la base de datos
 * y se devuelve desde la API del backend.
 */
export type Appointment = {
  /** Identificador único autoincremental de la cita. */
  id: number;
  /** Fecha de la cita en formato ISO 8601 (ej: `"2026-05-11"`). */
  date: string;
  /** Hora de la cita en formato `"HH:mm"` (ej: `"10:30"`). */
  time: string;
  /** Estado actual de la cita. */
  status: AppointmentStatus;
  /** ID del cliente que realizó la reserva. */
  customerId: number;
  /** ID del negocio donde se realiza el servicio. */
  businessId: number;
  /** Nombre descriptivo del servicio reservado. */
  serviceName: string;
};