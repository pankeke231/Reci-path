# S.E.A — App móvil de reciclaje urbano

Sistema Inteligente de Gestión y Recolección de Residuos Urbanos (React Native + Expo + Supabase).

## Inicio rápido

```bash
npm install
cp .env.example .env
npm start
```

Configura Supabase ejecutando `supabase/schema.sql` en el SQL Editor.

Documentación de arquitectura: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## Estructura

Arquitectura **Feature-First** en `src/` con módulos `auth`, `orders`, `profile`, `routes` y `dashboard`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo Expo |
| `npm run android` | Abrir en Android |
| `npm run ios` | Abrir en iOS |
