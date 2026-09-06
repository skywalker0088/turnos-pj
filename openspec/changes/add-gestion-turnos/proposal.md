## Why

La Defensoría del Chaco no cuenta con una forma sistemática de registrar a las personas que llegan a ser atendidas ni de mostrar el orden de atención, por lo que hoy el orden depende de la memoria del personal y del criterio del momento. Se necesita un sistema simple que registre cada solicitud, le asigne un número correlativo y muestre en pantalla los turnos pendientes diferenciados visualmente por tipo.

El repositorio hoy contiene únicamente el andamiaje inicial de Vue 3 generado por `create-vue` (vistas y componentes de bienvenida, un store `counter` de ejemplo), sin ninguna funcionalidad de dominio. Este es el primer cambio funcional del proyecto.

## What Changes

- Se agrega un formulario de solicitud de turno que captura nombre, apellido, documento y tipo de turno, con validación de los cuatro campos antes de permitir el envío.
- Se define el catálogo de tipos de turno con tres categorías fijas, cada una con su color asociado: Tipo 1 (rojo), Tipo 2 (amarillo) y Tipo 3 (verde).
- Al confirmar el formulario el sistema registra la solicitud y le asigna automáticamente un número de turno correlativo, sin intervención del operador.
- Se agrega una pantalla de listado que muestra los turnos registrados ordenados por número, con nombre, apellido, documento, tipo y el color correspondiente al tipo.
- Se agrega la persistencia de los turnos en el navegador para que el registro sobreviva a una recarga de página.
- Se reemplaza la navegación de ejemplo del andamiaje (`Home` / `About`) por las dos rutas reales del sistema, y se eliminan los componentes y el store de demostración que quedan sin uso.

### Supuestos

Estos puntos no estaban definidos en el pedido y se resolvieron con el criterio más simple que cumple el objetivo. Están aislados para que sean fáciles de revisar y cambiar:

- **Persistencia local.** No hay backend en el proyecto ni se incorpora en este cambio; los turnos se guardan en `localStorage`. Esto implica que el registro es por navegador y no se comparte entre equipos.
- **Correlativo diario.** La numeración se reinicia cada día, que es el comportamiento habitual en atención presencial al público. La alternativa sería un correlativo que nunca se reinicia.
- **Sin estado de atención.** El listado muestra todos los turnos del día en orden; no se incluye marcar un turno como atendido ni llamarlo. Queda como capacidad futura.

## Capabilities

### New Capabilities

- `solicitud-turnos`: registro de una solicitud de turno a partir de los datos de la persona y el tipo elegido, con validación de entrada y asignación automática del número correlativo.
- `listado-turnos`: visualización de los turnos registrados en orden de atención, con la identificación visual por color según el tipo de turno.

### Modified Capabilities

Ninguna. El proyecto no tiene specs previas en `openspec/specs/`.

## Impact

- **Código nuevo**: una vista de solicitud y una de listado en `src/views/`, un store de Pinia para los turnos en `src/stores/`, el catálogo de tipos y los tipos TypeScript del dominio, y los tests unitarios correspondientes.
- **Código modificado**: `src/router/index.ts` (rutas reales en lugar de las de ejemplo) y `src/App.vue` (navegación).
- **Código eliminado**: `HomeView`, `AboutView`, los componentes de bienvenida del andamiaje, el store `counter` y su test.
- **Dependencias**: ninguna nueva. Se resuelve con Vue, Vue Router y Pinia, ya instalados.
- **Datos**: se introduce una clave en `localStorage` con los turnos registrados; al no haber versiones previas, no hay migración.
- **Sin impacto** en APIs externas ni en sistemas de terceros: el alcance es enteramente frontend.
