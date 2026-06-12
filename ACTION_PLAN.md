# Plan de Acción: Actualización de la Plataforma Vacacional (Airbnb Clone)

Este documento contiene el plan de ejecución paso a paso para cumplir con todos los requerimientos y reglas globales del proyecto. Según las reglas, la ejecución se detendrá tras cada fase para solicitar confirmación explícita.

**Estado Actual:**
- **Esquema de BD:** Completado (Entidades `Property`, `Review`, `GuestRating` implementadas en Backend).
- **Lógica de Negocio y Dashboard Anfitrión:** Completado (Dashboard, Puntuaciones, Formularios).
- **Ramas:** Trabajando actualmente en la nueva rama `feature/final-phases` unificada para Back y Front.

---

## FASE 1: Esquema de Base de Datos y Seeding Relacional
- [x] Refactorizar `property.entity.ts` (Property): Añadidos `city` y `address`.
- [x] Crear nuevas entidades `review.entity.ts` y `guest-rating.entity.ts`.
- [x] Modificar seeders (`seed_dev.js` y `seed_massive.js`).

## FASE 2: Lógica de Negocio (Algoritmo de Puntuación, Estado y Promociones)
- [x] Implementar el "Guest Trust Score" y Estados (Promotor, Neutral, Detractor).
- [x] Implementar la puntuación de Propiedad y Promociones.

## FASE 3: Dashboard del Anfitrión - Calendario Interactivo y Lista de Reservas
- [x] Actualizar formulario de Propiedad con `city` y `address`.
- [x] Refactorizar el Calendario y lógica "Read-Only".

## FASE 4: Experiencia del Huésped - Búsqueda, Reseñas y Flujo de Reserva
- [x] Refactorizar la vista de inicio del huésped (estilo Airbnb).
- [x] Implementar búsqueda y feed (Filtrado por coincidencia en `city`).
- [ ] Crear página de Vista Detallada de Propiedad (Pendiente integrar calendario bloqueado y mapa).
- [ ] Regla de Privacidad de Dirección: Ocultar `address` a usuarios generales, mostrar únicamente tras reserva confirmada y pagada.

## FASE 5: Backend & System Integrations (Maps, Notifications, Payments)
- [x] **Geolocalización (Maps)**: Añadir `latitude`/`longitude` a `Property`, integrar geocodificación en `properties.service.ts` y filtrado por proximidad.
- [x] **Sistema de Notificaciones Dual**: Crear `Notification` entity/module, acoplar con `MailerService` (Notificaciones en BD + Email mock).
- [x] **Booking Flow Updates**: Integrar lógica de "Pending Host Approval" tras pago y crear endpoint `PATCH /bookings/:id/host-decision` (con `cancelReason`).
- [x] **Payment/Mock Gateway**: Endpoint `POST /payments/mock-checkout`, e integrar descuento 10% si Trust Score del Guest es Promotor.
- [x] **Seed Updates**: Actualizados `seed_dev.js` y `seed_massive.js` con propiedades en diferentes ciudades de España, coordenadas geográficas, y simulación lógica de Promotores/Detractores.
- [x] **Notification Tracking DB**: Expandida la tabla de notificaciones para guardar referencias (`bookingId`, `reviewId`, `link`) e implementados endpoints de historial, marcado como leído y borrado.
*(Requires Explicit User Confirmation before moving to Phase 6)*

## FASE 6: Guest Profile & Layout Refactoring (Frontend)
- [x] **Profile Page Fixes**: Ocultar rol de DB. Mantener visible el Guest Score. Arreglar carga de teléfono de DB. Botón toggle "Editar Perfil" (read-only hasta hacer click). Validación de contraseña actual requerida para cambiar contraseña.
- [x] **Explore Screen UI**: Remover barra de búsqueda redundante en el header global de esta pantalla. Expandir márgenes laterales del contenedor principal para mejor uso de espacio.

## FASE 7: Property View & Booking Flow (Frontend)
- [x] **Routing & Images**: Arreglar botón "Ver Propiedad" en la lista para rutear bien a la Property Page. Asegurar correcto renderizado de imágenes.
- [x] **Availability Calendar**: Reemplazar date picker genérico con librería react (ej. `react-datepicker`) bloqueando explícitamente fechas no disponibles.
- [x] **Interactive Map**: Añadir Google Map a la Property Page con área circular sombreada (sin pin exacto).
- [x] **Reviews Security**: Forzar que SOLO guests con reserva 'completed' y 'pagado' puedan dejar reseña en la propiedad. Lectura pública global.

## FASE 8: Refinamientos Finales MVP
- [x] Completado exitosamente.

## FASE 9: UX Polish, Booking States & Advanced Capabilities
- [x] **Notification Dropdown UI Fix**: Aumentar la opacidad/fondo sólido o añadir `backdrop-blur` al `NotificationDropdown` para evitar que el contenido subyacente dificulte la lectura.
- [x] **Toast Notifications & Error Handling (UX)**: Eliminar llamadas nativas `alert()` y `confirm()`. Implementar una librería de Toast moderna (`sonner` o `react-hot-toast`). Capturar y mostrar errores personalizados (ej. fechas no disponibles) con estos Toasts respetando la estética Premium y Modo Oscuro.
- [x] **Visual Calendar Blocking**: En el selector de fechas del huésped, obtener las reservas existentes para la propiedad y bloquear/deshabilitar visualmente las fechas que ya están reservadas para evitar solapamientos.
- [x] **New Booking Status ('Terminada')**: Actualizar los enums/types del estado de reserva tanto en Frontend como en Backend para incluir el estado `'Terminada'`.
- [x] **Review & Host Reply Logic**:
    - [x] Permitir que un Huésped deje una reseña SOLO si el estado de la reserva es exactamente `'Terminada'`.
    - [x] Añadir campo `hostReply` (texto) a la tabla `Review` en la BD.
    - [x] Permitir al Anfitrión publicar una respuesta a la reseña del Huésped desde su Dashboard.
- [x] **Refactor Property Editing (`properties/edit/[id]`)**: Rediseñar la página de edición de propiedades con inputs validados y un diseño premium. Permitir modificar libremente: `pricePerNight`, `maxGuests`, `amenities` (como tags interactivos/chips) y una `description` en formato rich text.
- [x] **Real Image Gallery Management**: Reemplazar las URLs de imágenes mock con un Gestor de Galería real en el Dashboard del Anfitrión usando almacenamiento de backend estático (como alternativa ante restricciones en API de Supabase). Permitir subir fotos reales, reordenarlas y eliminarlas.
- [x] **Seed Scripts Update**: Actualizar AMBOS scripts de base de datos (`seed_dev.js` y `seed_massive.js`) para incluir reservas con estado `'Terminada'`, y reseñas que incluyan el campo `hostReply`. Asegurar que ambos scripts compartan exactamente la misma lógica y solo varíe el volumen.

## FASE 10: Real Integrations & Advanced Features
- [x] **In-App Chat (Host <-> Guest)**: Crear módulo de mensajería ligero. Permitir mensajes entre Huésped y Anfitrión SOLO si hay una reserva activa/confirmada entre ellos. Crear tabla `Message` en la BD.
- [x] **Real Geolocation Search**: Actualizar la búsqueda principal por ciudad. Conectar la barra de búsqueda y los mapas a una lógica real basada en coordenadas (radio/distancia) usando las capacidades de PostGIS de Supabase y las coordenadas existentes (ahora implementado a través de Nominatim + Query Radius).
- [x] **Real Email Provider Integration**: Actualizar el `MailerService`. Conectarlo a un proveedor SMTP real (ej. Resend, SendGrid, o Nodemailer con credenciales estándar) para enviar correos electrónicos reales a los usuarios (Nodemailer configurado con variables ENV estandarizadas).

---
**Nota de Ejecución:** El proceso se detendrá tras completar cada fase (o al finalizar partes clave) para solicitar la confirmación explícita antes de continuar.
