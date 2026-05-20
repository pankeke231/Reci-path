# Arquitectura — S.E.A Residuos Urbanos

**Sistema Inteligente de Gestión y Recolección de Residuos Urbanos**

## 1. Visión general

Aplicación móvil multi-rol (ciudadano, recolector, administrador) construida con **React Native + Expo** y backend **Supabase (PostgreSQL + Auth + Realtime)**.

```
┌─────────────────────────────────────────────────────────────┐
│                     App móvil (Expo)                        │
│  ┌──────────┐  ┌────────────┐  ┌────────────────────────┐ │
│  │ Features │→ │   Hooks    │→ │ Services (Supabase API)│ │
│  └──────────┘  └────────────┘  └────────────────────────┘ │
│         ↑              ↑                    ↓               │
│  ┌──────────┐  ┌────────────┐      ┌──────────────────┐  │
│  │ UI / Nav │  │ AuthContext│      │ Supabase Cloud   │  │
│  └──────────┘  └────────────┘      │ Auth + Postgres  │  │
│                                     └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 2. Estructura de carpetas (Feature-First)

```
src/
├── config/          # Variables de entorno
├── constants/       # Roles, estados, tablas, colores
├── models/          # Formas de datos y factories
├── services/        # Acceso a datos (Supabase CRUD)
├── store/           # Estado global (AuthContext)
├── hooks/           # Lógica reutilizable por feature
├── navigation/      # Navegadores por rol
├── features/        # Módulos de negocio
│   ├── auth/
│   ├── orders/
│   ├── profile/
│   ├── routes/
│   └── dashboard/
├── ui/              # Design system (componentes + theme)
└── utils/           # Validadores, formatters, errores
```

## 3. Flujo de datos

1. **Pantalla** dispara acción (ej. crear pedido).
2. **Hook** (`useOrders`) orquesta estado local y llama al servicio.
3. **Service** (`ordersService`) ejecuta query Supabase.
4. **PostgreSQL** valida con RLS según rol del JWT.
5. Respuesta actualiza estado → UI se re-renderiza.

### Autenticación

```
LoginScreen → useAuth.signIn → authService → Supabase Auth
                    ↓
            AuthContext actualiza session + profile
                    ↓
            RootNavigator elige Citizen | Collector | Admin
```

## 4. Responsabilidades por módulo

| Módulo | Responsabilidad |
|--------|-----------------|
| `features/*` | UI y flujos por dominio (sin llamar Supabase directo) |
| `hooks/*` | Estado de pantalla, fetching, side effects |
| `services/*` | Contratos de API, queries, CRUD genérico |
| `store/AuthContext` | Sesión global, bootstrap, sign in/out |
| `navigation/*` | Rutas, tabs y stacks por rol |
| `models/*` | Tipos de dominio y normalización |
| `ui/*` | Componentes visuales sin lógica de negocio |

## 5. Modelo de datos

- **profiles** — Usuario extendido (rol, contacto, geo opcional).
- **waste_types** — Catálogo de residuos.
- **orders** — Solicitudes de recolección con estado y coordenadas.
- **routes** — Rutas asignadas a recolectores (GeoJSON futuro).
- **route_orders** — Orden de paradas en una ruta.

Ver `supabase/schema.sql` para DDL y políticas RLS.

## 6. Decisiones técnicas

| Decisión | Motivo |
|----------|--------|
| Feature-First | Escalabilidad y equipos paralelos por dominio |
| Context API para auth | Suficiente para MVP; migrable a Zustand/Redux |
| `createCrudService` | DRY para tablas CRUD simples |
| Variables `EXPO_PUBLIC_*` | Estándar Expo para secrets públicos (anon key) |
| Navegación por rol | UX distinta por actor sin condicionales masivos |
| RLS en Supabase | Seguridad en backend, no solo en cliente |

## 7. Extensiones preparadas

| Funcionalidad | Punto de extensión |
|---------------|-------------------|
| **Realtime** | `supabase.channel()` en `ordersService.subscribeToOrders()` |
| **Dijkstra / VRP** | `routesService.planRoute()` → Edge Function |
| **Push** | Expo Notifications + tabla `device_tokens` |
| **Analytics** | `utils/analytics.js` → Segment / Firebase |
| **Mapas** | `expo-location` + `react-native-maps` en `routes` feature |

## 8. Configuración local

```bash
cd inicial-app
cp .env.example .env
# Editar EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY
npm install
# Ejecutar supabase/schema.sql en el dashboard
npm start
```

## 9. Roles y pantallas

| Rol | Pantallas principales |
|-----|------------------------|
| Ciudadano | Dashboard, crear/ver pedidos, perfil |
| Recolector | Dashboard operativo, rutas, pedidos, perfil |
| Admin | Dashboard métricas, todos los pedidos/rutas, perfil |

---

*Documento vivo — actualizar al agregar sprints o integraciones.*
