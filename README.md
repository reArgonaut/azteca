# Guardianes del Equilibrio — Simulador de Impacto Ecológico

App Angular 20 demo para presentación ante jurado. Los estudiantes acumulan/pierden **"Carbonos"** (moneda virtual) según sus acciones ecológicas diarias.

## Stack

- **Angular 20** — standalone components, new control flow (`@if`, `@for`)
- **Bootstrap 5** — via CDN en `src/index.html` (sin npm)
- **localStorage** — persistencia, sin backend

## Comandos

```bash
npx ng serve          # dev server → http://localhost:4200
npx ng build --configuration development   # build
```

## Rutas

| Ruta | Descripción | Guard |
|------|-------------|-------|
| `/register` | Registro de nuevo usuario + lista de existentes | — |
| `/dashboard` | Acciones del día (rápidas + evidencias) | auth |
| `/balance` | Desglose diario de carbonos | auth |
| `/ranking` | Tabla de ranking grupal (pública) | — |
| `/viral` | Envío de contenido TikTok | auth |
| `/teacher` | Panel de validación docente | — |
| `/profile` | Perfil ecológico + historial | auth |

**Contraseña del panel docente:** `azteca2025`

## Arquitectura de archivos clave

```
src/app/
├── models/models.ts        # Interfaces: Student, Action, AppState, EcoLevel
├── data/data.ts            # Reglas del juego: transporte, niveles, acciones
├── data/seed.ts            # Datos demo (corre una vez al primer load)
├── services/
│   ├── storage.service.ts  # Lectura/escritura en localStorage
│   └── engine.service.ts   # Cálculo de carbonos, transporte, niveles
└── guards/auth.guard.ts    # Redirige a /register si no hay usuario activo
```

## Datos demo pre-cargados

| Alumno | Grupo |
|--------|-------|
| EcoMaria | Grupo A |
| CarlosVerde | Grupo B |
| AnaEco | Grupo A |

3 acciones pendientes de validación en el panel docente.

## Notas de desarrollo

- Los servicios Angular inyectados como `private` **no son accesibles desde templates** — usar `protected` o exponer propiedades computed.
- No hay backend ni autenticación real; todo vive en `localStorage`.
