# Bookings Frontend

Frontend para gestión de reservas, construido con **Next.js App Router** y **React**. Incluye una interfaz administrativa con secciones de dashboard, reservas, clientes y cobros, y está preparado para conectarse al backend NestJS mediante peticiones HTTP.

## Visión general

Este repositorio contiene la parte frontend del proyecto de gestión de reservas. La aplicación ofrece una estructura de panel administrativo con navegación lateral, cabecera compartida y páginas independientes para las principales áreas funcionales.

## Stack técnico

- **Next.js** con App Router.
- **React** como librería de interfaz.
- **TypeScript** para tipado.
- Estructura de dashboard con `layout.tsx`, navegación lateral y páginas por sección.

## Estructura principal

```text
bookings-frontend-develop/
├─ app/
│  ├─ (admin)/
│  │  ├─ bookings/
│  │  ├─ customers/
│  │  ├─ dashboard/
│  │  ├─ payments/
│  │  └─ layout.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  └─ layout/
│     ├─ Header.tsx
│     └─ Sidebar.tsx
├─ public/
├─ package.json
└─ tsconfig.json
```

## Funcionalidades actuales

El frontend tiene una base visual ya montada con estas rutas:

- `/dashboard` → vista general del panel.
- `/bookings` → pantalla de reservas.
- `/customers` → pantalla de clientes.
- `/payments` → pantalla de cobros.

La raíz `/` redirige a `/dashboard`, y el layout del área admin comparte `Sidebar` y `Header`.

## Requisitos previos

Antes de arrancar el proyecto, asegúrate de tener instalado:

- **Node.js 18 o superior**
- **npm**
- **Git**

Puedes comprobarlo con:

```bash
node -v
npm -v
git --version
```

## Cómo descargar el proyecto

### Opción 1: clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd bookings-frontend-develop
```

### Opción 2: descargar ZIP

1. En GitHub, pulsa **Code**.
2. Pulsa **Download ZIP**.
3. Descomprime el proyecto.
4. Entra en la carpeta `bookings-frontend-develop`.

## Instalación

Ejecuta:

```bash
npm install
```

Esto instalará Next, React, TypeScript y las dependencias del proyecto.

## Cómo ejecutar el frontend

### Modo desarrollo

```bash
npm run dev
```

Por defecto, Next intentará arrancar en:

```text
http://localhost:3000
```

### Recomendación si también usas el backend local

Como el backend Nest suele ejecutarse en `http://localhost:3000`, es recomendable arrancar el frontend en otro puerto, por ejemplo `3001`:

```bash
npm run dev -- --port 3001
```

Así podrás tener al mismo tiempo:

- backend en `http://localhost:3000`
- frontend en `http://localhost:3001`

## URL de acceso

Si lo ejecutas en el puerto recomendado, abre:

```text
http://localhost:3001
```

Rutas principales:

- `http://localhost:3001/dashboard`
- `http://localhost:3001/bookings`
- `http://localhost:3001/customers`
- `http://localhost:3001/payments`

## Configuración para conectar con el backend

Lo recomendable es crear un archivo `.env.local` en la raíz del frontend para definir la URL de la API.

Crea este archivo:

```text
bookings-frontend-develop/.env.local
```

Contenido recomendado:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Si modificas `.env.local`, reinicia el servidor de desarrollo.

## Cómo funciona la conexión con el backend

El frontend puede consumir la API NestJS con `fetch`.

Ejemplo típico:

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const res = await fetch(`${API_URL}/appointments`, {
  cache: 'no-store',
});
```

Con esto se puede:

- listar reservas reales
- crear reservas mediante `POST`
- mantener la información sincronizada con el backend

## Navegación y layout

El panel administrativo usa un layout compartido en `app/(admin)/layout.tsx`, que renderiza:

- `Sidebar` con las secciones principales
- `Header` con el título general
- el contenido principal de cada página

El sidebar utiliza `usePathname()` para marcar la ruta activa.

## Páginas principales

### Dashboard

Pantalla de resumen con métricas, próximas reservas y bloques informativos.

### Bookings

Pantalla dedicada a la gestión de reservas, pensada para listar información y servir como punto de entrada al flujo principal de la aplicación.

### Customers

Pantalla de clientes con tarjetas y buscador visual.

### Payments

Pantalla de cobros y pagos con resumen y listado.

## Cómo probar la aplicación conectada

Una vez backend y frontend estén levantados:

1. Entra en `http://localhost:3001/bookings`.
2. Comprueba si aparecen reservas reales de la API.
3. Si existe formulario conectado, crea una nueva reserva.
4. Verifica que aparece en el listado.

## Cómo ver los datos reales

El frontend no guarda datos por sí mismo; los datos viven en el backend SQLite. Para comprobarlos puedes:

- mirar la tabla desde `/bookings`
- llamar al backend con Swagger en `http://localhost:3000/api`
- abrir el archivo SQLite del backend con una herramienta externa

## Scripts disponibles

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

## Problemas frecuentes

### El frontend no arranca

Revisa:

- que has ejecutado `npm install`
- que estás dentro de la carpeta correcta
- que tu versión de Node es suficientemente reciente

### Conflicto de puertos

Si el puerto `3000` ya está ocupado por el backend, arranca el frontend así:

```bash
npm run dev -- --port 3001
```

### No carga datos del backend

Revisa:

- que el backend esté corriendo en `http://localhost:3000`
- que `.env.local` tenga la URL correcta
- que el backend tenga CORS habilitado para `http://localhost:3001`

## Flujo de trabajo recomendado

### Terminal 1: backend

```bash
cd bookings-backend-Base/backend
npm install
npm run start:dev
```

### Terminal 2: frontend

```bash
cd bookings-frontend-develop
npm install
npm run dev -- --port 3001
```

Después abre `http://localhost:3001` en el navegador.

## Estado actual del proyecto

Este frontend ofrece una estructura clara de panel administrativo y una base sólida para trabajar con navegación, tablas, formularios y consumo de API desde Next.js App Router.