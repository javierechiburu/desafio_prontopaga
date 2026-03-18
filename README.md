# Desafio 3 - Tabla de Movimientos Bancarios

Aplicacion React + TypeScript construida sobre Vite para visualizar el historial de transacciones de un banco digital. Incluye un shell transversal con sidebar y topbar, filtros sincronizados con la URL, paginacion server-side simulada, exportacion CSV, Suspense por secciones y tests unitarios.

## Stack

- React 19
- Zustand
- TypeScript estricto
- Vite 8
- Vitest + Testing Library
- Suspense + Error Boundaries

## Como correr el proyecto

```bash
npm install
npm run dev
```

Scripts disponibles:

- `npm run dev`: inicia la app en desarrollo
- `npm run build`: compila TypeScript y genera build de produccion
- `npm run lint`: ejecuta ESLint
- `npm test`: corre la suite de Vitest

## Que incluye

- 260 transacciones mock tipadas y deterministicas
- Formateo de monto por moneda con `Intl.NumberFormat`
- Filtros por fecha, tipo, estado, moneda, rango de monto y busqueda con debounce de 300ms
- Sincronizacion completa con `URLSearchParams`
- Paginacion simulada con delay de 600ms y error aleatorio del 10%
- Exportacion CSV usando solo los registros filtrados
- Ordenamiento por fecha y monto
- Store con Zustand y persistencia de `pageSize` / visibilidad de filtros
- Shell transversal reutilizable para el sitio
- Suspense independiente para resumen, filtros y tabla
- Skeleton loaders, empty state y retry state

## Arquitectura

La solucion esta organizada por modulos:

- `src/modules/shell`: shell transversal del sitio
- `src/modules/shared`: boundaries y componentes reutilizables
- `src/modules/transactions`: dominio, store, recursos async y UI del modulo

- `domain`: tipos, contratos y constantes del modulo
- `data`: dataset mock y servidor simulado
- `state`: store con Zustand y persistencia
- `hooks`: `useTransactions`, que centraliza filtros, URL sync, recursos async y exportacion
- `lib`: helpers de formateo, CSV, query params y recursos para Suspense
- `components`: composicion visual del modulo

Esta separacion busca mantener una frontera clara entre reglas de negocio, acceso a datos y UI.

## Consideraciones de implementacion

- El servidor mock aplica filtros y ordenamiento antes de paginar para emular un backend real.
- Cuando cambia un filtro o el orden, la pagina vuelve a `1`.
- El export CSV no toma solo la pagina actual: exporta todos los movimientos que coinciden con los filtros activos.
- Las secciones de resumen, filtros y tabla cargan de forma independiente con Suspense.
- El error aleatorio del 10% es intencional para probar la resiliencia de la UI.

## Tests incluidos

- Helper `formatTransactionAmount`
- Hook `useTransactions`

## Validacion realizada

- `npm run lint`
- `npm test`
- `npm run build`
