# Chivas Rumberas La 80 — Frontend

<div align="center">

  <img src="public/icons/logo-chiva-ia.svg" alt="Logo Chivas Rumberas Booking" width="200">

  <p>
    <a href="https://chivas-rumberas-la80-ten.vercel.app/" target="_blank">Chivas Rumberas La 80</a>
  </p>

</div>

Aplicación web para la presentación de las experiencias de Chivas Rumberas La 80 y la gestión del proceso de reservas. El proyecto ofrece una experiencia pública para consultar chivas y recorridos, verificar disponibilidad y crear reservas, además de un panel interno para administrar reservas y el estado de las chivas.

Construida con **Next.js**, **React**, **TypeScript** y **Tailwind CSS**. El frontend consume la API REST del backend y utiliza rutas API de Next.js como intermediarias para las operaciones administrativas.

---

## Tabla de Contenidos

- [Características Principales](#características-principales)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura de la Aplicación](#arquitectura-de-la-aplicación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Configuración](#configuración)
- [Instalación y Desarrollo](#instalación-y-desarrollo)
- [Scripts Disponibles](#scripts-disponibles)
- [Rutas de la Aplicación](#rutas-de-la-aplicación)
- [Integración con el Backend](#integración-con-el-backend)
- [Construcción y Producción](#construcción-y-producción)

---

## Características Principales

- **Página pública de presentación**: hero, experiencia, beneficios, estadísticas, momentos y catálogo de chivas.
- **Catálogo de chivas**: consulta de chivas disponibles, capacidad, precio por hora, características e imágenes.
- **Recorridos turísticos**: presentación de los recorridos ofrecidos y sus principales detalles.
- **Formulario de reservas**: selección de chiva, recorrido, fecha, horario, duración y datos del cliente.
- **Consulta de disponibilidad**: validación de horarios ocupados antes de enviar una reserva.
- **Confirmación de reserva**: página de confirmación después de crear una reserva.
- **Panel administrativo**: consulta de reservas, detalle de una reserva y actualización de estados.
- **Gestión de chivas**: actualización del estado operativo de cada chiva.
- **Autenticación administrativa**: inicio de sesión mediante la API y sesión protegida con cookie `admin_token`.
- **Diseño responsive**: navegación de escritorio y móvil, tema claro/oscuro y componentes reutilizables.

---

## Stack Tecnológico

| Componente | Tecnología |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) 16 |
| **Interfaz** | [React](https://react.dev/) 19 |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) |
| **Estilos** | [Tailwind CSS](https://tailwindcss.com/) 4 |
| **Iconos** | [Animate Icons](https://animateicons.in//) |
| **Utilidades** | [clsx](https://github.com/lukeed/clsx) |
| **Linting** | [ESLint](https://eslint.org/) 9 con `eslint-config-next` |
| **Backend** | API REST de Chivas Rumberas La 80 |

---

## Arquitectura de la Aplicación

El proyecto utiliza el App Router de Next.js y separa la interfaz, el acceso a datos y los tipos compartidos:

1. **Rutas y layouts**: las páginas se organizan en grupos `(public)` y `(admin)` para separar el sitio público del panel interno.
2. **Componentes**: la interfaz se divide en componentes de página, layout, reserva, iconos y controles reutilizables.
3. **Capa de API**: `src/lib/api` contiene funciones tipadas para consumir chivas, recorridos, reservas y autenticación.
4. **Rutas API administrativas**: `src/app/api/admin` reenvía las operaciones protegidas al backend usando el token almacenado en la cookie de sesión.
5. **Proxy de autenticación**: `src/proxy.ts` protege todas las rutas bajo `/gestion-interna`, excepto la página de inicio de sesión.

Las consultas públicas se realizan desde el servidor cuando es posible y utilizan las opciones de caché y revalidación de Next.js. Las operaciones de disponibilidad y reservas se ejecutan sin caché para mantener los datos actualizados.

---

## Estructura del Proyecto

```text
chivas-rumberas-frontend/
├── public/
│   ├── icons/                 # Iconos y logotipos
│   ├── images/                # Imágenes de chivas y hero
│   └── videos/                # Recursos audiovisuales
├── src/
│   ├── app/
│   │   ├── (public)/          # Página pública y confirmación de reservas
│   │   ├── (admin)/           # Panel interno y login administrativo
│   │   ├── api/admin/         # Rutas API protegidas del frontend
│   │   ├── components/        # Componentes compartidos de la aplicación
│   │   ├── globals.css        # Estilos globales
│   │   └── layout.tsx         # Layout raíz
│   ├── components/
│   │   ├── booking/           # Componentes del formulario de reserva
│   │   ├── home/              # Secciones de la página principal
│   │   ├── icons/             # Iconos de la aplicación
│   │   ├── layout/            # Navbar, footer, menú móvil y tema
│   │   └── ui/                # Componentes básicos reutilizables
│   ├── lib/
│   │   ├── api/               # Clientes tipados para la API REST
│   │   ├── types/             # Tipos de dominio y DTOs
│   │   └── utils/             # Utilidades comunes
│   └── proxy.ts               # Protección de rutas administrativas
├── next.config.ts             # Configuración de Next.js
├── package.json               # Dependencias y scripts
├── tailwind.config.mjs        # Configuración de Tailwind
└── tsconfig.json              # Configuración de TypeScript
```

---

## Requisitos Previos

- [Node.js](https://nodejs.org/) 20 o superior.
- npm.
- Una instancia disponible del backend de Chivas Rumberas La 80.

---

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_HOST=http://localhost:3001
```

`NEXT_PUBLIC_API_HOST` debe apuntar a la URL base del backend REST. El frontend utiliza esta variable tanto para las consultas públicas como para las rutas administrativas que funcionan como proxy.

No agregues credenciales ni tokens al repositorio. La sesión administrativa se guarda en una cookie `admin_token` gestionada por las rutas del frontend.

---

## Instalación y Desarrollo

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

Para iniciar sesión en el panel administrativo, visita `/gestion-interna/login` y utiliza las credenciales configuradas en el backend.

---

## Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo de Next.js. |
| `npm run lint` | Ejecuta ESLint sobre el proyecto. |
| `npm run build` | Genera la compilación optimizada para producción. |
| `npm run start` | Inicia la aplicación compilada en modo producción. |

---

## Rutas de la Aplicación

### Rutas públicas

| Ruta | Descripción |
| :--- | :--- |
| `/` | Página principal con catálogo y formulario de reservas. |
| `/confirmacion` | Confirmación de una reserva creada. |

### Rutas administrativas

| Ruta | Descripción |
| :--- | :--- |
| `/gestion-interna/login` | Inicio de sesión del equipo administrativo. |
| `/gestion-interna` | Resumen y gestión interna. |
| `/gestion-interna/reservas` | Listado de reservas. |
| `/gestion-interna/reservas/:id` | Detalle y acciones de una reserva. |
| `/gestion-interna/chivas` | Gestión del estado de las chivas. |

Las rutas administrativas requieren una sesión válida. Si no existe la cookie `admin_token`, el proxy redirige al usuario a `/gestion-interna/login`.

---

## Integración con el Backend

La capa de API del frontend consume los siguientes recursos:

| Recurso | Operaciones |
| :--- | :--- |
| **Autenticación** | Inicio de sesión administrativo. |
| **Chivas** | Listado, detalle y actualización de estado. |
| **Recorridos** | Listado de recorridos turísticos. |
| **Reservas** | Consulta de disponibilidad, creación, listado, detalle y actualización de estado. |

Las funciones de acceso están disponibles en:

```text
src/lib/api/auth.ts
src/lib/api/bookings.ts
src/lib/api/chivas.ts
src/lib/api/travels.ts
```

Los tipos de las respuestas y solicitudes se encuentran en `src/lib/types`.

---

## Construcción y Producción

Genera la compilación:

```bash
npm run build
```

Inicia la aplicación:

```bash
npm run start
```

Antes de desplegar, configura `NEXT_PUBLIC_API_HOST` con la URL pública del backend y verifica que el backend permita las solicitudes desde el dominio del frontend.

---