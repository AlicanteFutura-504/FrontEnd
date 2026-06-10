# Plan de Acción: Actualización de la Plataforma Vacacional (Airbnb Clone)

Este documento contiene el plan de ejecución paso a paso para cumplir con todos los requerimientos y reglas globales del proyecto. Según las reglas, la ejecución se detendrá tras cada fase para solicitar confirmación explícita.

**Estado Actual:**
- **Esquema de BD:** Utilizamos TypeORM en NestJS. La entidad `Property` (`property.entity.ts`) actualmente tiene un campo `direccion`, el cual será refactorizado/ampliado a `city` y `address` según los requerimientos. Las tablas nuevas requerirán sus respectivas entidades TypeORM (`Review` y `GuestRating`).
- **Seed Scripts:** `seed_dev.js` y `seed_massive.js` están construidos con sentencias SQL puras usando `pg`. Deberán actualizarse para reflejar los nuevos campos y las nuevas tablas respetando la integridad relacional (solo reseñas entre usuarios que han tenido una reserva).

---

## FASE 1: Esquema de Base de Datos y Seeding Relacional
- [x] Refactorizar `property.entity.ts` (Property): Añadir campos `city` y `address` (tipo string). Sustituir o migrar el uso actual de `direccion`.
- [x] Crear nueva entidad `review.entity.ts`:
  - `id` (Primary Key)
  - `propertyId` (Relación ManyToOne con Property)
  - `guestId` (Relación ManyToOne con Usuario)
  - `score` (Int, 0 a 5)
  - `comment` (Varchar, max 300)
  - `createdAt` (Timestamp)
- [x] Crear nueva entidad `guest-rating.entity.ts`:
  - `id` (Primary Key)
  - `guestId` (Relación ManyToOne con Usuario)
  - `hostId` (Relación ManyToOne con Usuario)
  - `score` (Int, 0 a 5)
  - `createdAt` (Timestamp)
- [x] Actualizar el módulo NestJS (`app.module.ts` u otros módulos relevantes) para registrar estas nuevas entidades.
- [x] Modificar `seed_dev.js`:
  - Generar `city` y `address` (usando faker) para las propiedades.
  - Insertar registros en la tabla `review` basados en reservas (`booking`) existentes.
  - Insertar registros en la tabla `guest_rating` basados en reservas existentes entre huéspedes y anfitriones.
- [x] Modificar `seed_massive.js`:
  - Aplicar la misma lógica relacional para la inserción masiva asegurando el correcto manejo de los *chunks* (lotes).

## FASE 2: Lógica de Negocio (Algoritmo de Puntuación, Estado y Promociones)
- [x] Implementar el "Guest Trust Score" (0-100) en el backend (ej. `usuarios.service.ts`):
  - 50%: `(Promedio GuestRating / 5) * 50`
  - 30%: `(Reservas Completadas y Pagadas / Reservas Totales) * 30`
  - 20%: `(Reservas Totales / 5) * 20` (Máximo 20 puntos).
- [x] Implementar cálculo de Estado del Huésped:
  - Promotor (>= 80)
  - Neutral (40-79)
  - Detractor (< 40)
- [x] Implementar la puntuación de Propiedad (promedio simple de `Review.score`).
- [x] Implementar lógica de promociones:
  - Bandera de "Promocionado" para propiedades con score >= 4.5.
  - Aplicación automática de descuentos en el checkout para huéspedes "Promotor".

## FASE 3: Dashboard del Anfitrión - Calendario Interactivo y Lista de Reservas
- [x] Actualizar el formulario de Propiedad (`frontend/.../PropertyForm.tsx`):
  - Reemplazar `direccion` por los dos nuevos inputs `city` y `address`.
  - Validar los campos nuevos.
- [x] Refactorizar el Calendario (`Calendar.tsx` o similar):
  - Diferenciar visualmente (colores) reservas "Confirmadas", "Pendientes" y "Completadas".
  - Permitir crear una reserva haciendo click en una fecha libre.
  - Permitir editar una reserva haciendo click en una ocupada.
- [x] Implementar la regla de "Read-Only" en reservas:
  - Si `status` es 'completed', el pago es 'pagado' y ya existe una reseña (`review` o `guest_rating` asociado, o simplemente el status completed), no permitir su edición/borrado. Bloquear inputs en el modal.
- [x] Revisión UI/UX:
  - Todo el texto, botones (ej. "Guardar", "Cerrar", "Crear") y modales en perfecto Español.

## FASE 4: Experiencia del Huésped - Búsqueda, Reseñas y Flujo de Reserva
- [ ] Refactorizar la vista de inicio del huésped (estilo Airbnb).
- [ ] Implementar búsqueda y feed:
  - Filtrado por coincidencia de texto simple en `city`.
  - Ordenación por puntuación (propiedades "promocionadas" primero).
- [ ] Crear página de Vista Detallada de Propiedad:
  - Mostrar `city`, score promedio, reseñas públicas, comodidades, calendario de disponibilidad y flujo de reserva.
- [ ] Regla de Privacidad de Dirección:
  - Ocultar `address` a usuarios generales.
  - Mostrar `address` únicamente tras una reserva confirmada y pagada.

---
**Nota de Ejecución:** El proceso se detendrá tras completar cada fase (o al finalizar partes clave) para solicitar la confirmación explícita antes de continuar.
