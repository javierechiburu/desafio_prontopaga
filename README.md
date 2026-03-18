# Desafio 3 - Tabla de Movimientos Bancarios

Aplicacion React + TypeScript construida sobre Vite para visualizar el historial de transacciones de un banco digital. Incluye filtros sincronizados con la URL, paginacion server-side simulada, exportacion CSV, estados de carga/error/vacio y tests unitarios.

## Stack

- React 19
- TypeScript estricto
- Vite 8
- Vitest + Testing Library
- CSS modularizado por responsabilidad de pantalla

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
- Tooltip para visualizar la cuenta destino
- Persistencia de `pageSize` en `localStorage`
- Skeleton loaders, empty state y retry state

## Arquitectura

La solucion esta organizada por capas dentro de `src/modules/transactions`:

- `domain`: tipos, contratos y constantes del modulo
- `data`: dataset mock y servidor simulado
- `state`: reducer para filtros, busqueda y sorting
- `hooks`: `useTransactions`, que centraliza fetch, paginacion, URL sync y exportacion
- `lib`: helpers de formateo, CSV y query params
- `components`: composicion visual del modulo

Esta separacion busca mantener una frontera clara entre reglas de negocio, acceso a datos y UI.

## Consideraciones de implementacion

- El servidor mock aplica filtros y ordenamiento antes de paginar para emular un backend real.
- Cuando cambia un filtro o el orden, la pagina vuelve a `1`.
- El export CSV no toma solo la pagina actual: exporta todos los movimientos que coinciden con los filtros activos.
- El error aleatorio del 10% es intencional para probar la resiliencia de la UI.

## Tests incluidos

- Helper `formatTransactionAmount`
- Hook `useTransactions`

## Validacion realizada

- `npm run lint`
- `npm test`
- `npm run build`
