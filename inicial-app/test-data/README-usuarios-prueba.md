# Usuarios de prueba — S.E.A

Archivo: `usuarios-prueba.csv`

## Uso rápido

1. **Ciudadano y recolector:** en la app → *Crear cuenta nueva* → usa email y contraseña del CSV.
2. **Admin:** registra `admin@sea-prueba.test` como ciudadano, luego en Supabase SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin', full_name = 'Ana Torres Administradora'
WHERE email = 'admin@sea-prueba.test';
```

3. Desactiva **Confirm email** en Supabase (Auth → Providers → Email) para probar sin confirmar correo.

## Contraseña común (todas las filas)

`SeaPrueba2026!`

## Importante

- Estos correos son ficticios (dominio `.test`). Si Supabase rechaza el dominio, usa por ejemplo `@gmail.com` y actualiza el CSV.
- No uses estas contraseñas en producción.
