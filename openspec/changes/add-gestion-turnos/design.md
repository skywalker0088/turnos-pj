## Context

Ver `proposal.md` — Why para la motivación, y las specs de `solicitud-turnos` y `listado-turnos` para el comportamiento exigible.

El proyecto es una SPA de Vue 3 recién generada con `create-vue`: Vite, TypeScript, Vue Router, Pinia, Vitest y ESLint/Prettier ya instalados, sin código de dominio propio. No hay backend, base de datos ni servicio de autenticación, y este cambio no incorpora ninguno. Eso condiciona todo el diseño: la fuente de verdad de los turnos vive en el navegador del equipo donde se cargan.

## Goals / Non-Goals

**Goals:**

- Concentrar la regla de numeración correlativa en un único punto del código, para que sea imposible que dos pantallas la calculen distinto.
- Mantener el catálogo de tipos de turno como un dato declarativo único, del que se derivan tanto la etiqueta como el color, evitando que el mapeo tipo→color quede repetido en las vistas.
- Dejar la lógica de dominio testeable sin montar componentes, de modo que las reglas de numeración y validación se cubran con tests rápidos.
- Aislar el acceso a `localStorage` para que sustituirlo por una API HTTP más adelante no obligue a tocar las vistas.

**Non-Goals:**

- Definir el esquema de una futura API o base de datos. Este diseño solo se asegura de no bloquear esa evolución.
- Sincronizar turnos entre varios equipos o pestañas. Fuera de alcance, ver Riesgos.
- Autenticación, roles o permisos: cualquiera que abra la aplicación puede registrar y ver turnos.
- Diseño visual acabado o sistema de design tokens. Se usan los estilos base del andamiaje.

## Decisions

### Un único store de Pinia como fuente de verdad

Todo el estado de turnos vive en un store de Pinia (`useTurnosStore`) que expone la lista, la acción de registrar y los turnos ordenados como getter. Las vistas no calculan números ni ordenan por su cuenta.

La alternativa era que cada vista leyera y escribiera `localStorage` directamente. Se descartó porque duplicaría la regla del correlativo en dos lugares y haría que el listado no se actualizara al registrar un turno sin recargar, algo que las specs exigen explícitamente.

### El correlativo se deriva del estado, no se guarda como contador aparte

El número del próximo turno se calcula como el máximo número existente entre los turnos del día en curso, más uno. No se persiste un contador independiente.

Se eligió así porque un contador separado puede desincronizarse de la lista: si la escritura del turno falla o los datos se editan a mano, quedan un contador y una lista que no coinciden, y aparecen huecos o números repetidos. Derivarlo hace que la invariante "sin huecos ni repetidos" se cumpla por construcción. El costo es recorrer la lista en cada alta, irrelevante para el volumen diario de una oficina de atención al público.

### El reinicio diario se resuelve guardando la fecha en cada turno

Cada turno guarda la fecha del día en que se registró. El cálculo del próximo número considera únicamente los turnos cuya fecha coincide con el día actual, de modo que el primero de cada jornada vuelve a ser 1 sin necesidad de una tarea programada ni de borrar datos.

La alternativa era vaciar el almacenamiento al detectar un cambio de día. Se descartó porque destruye el historial y porque el borrado depende de que alguien abra la aplicación en el momento justo.

### El catálogo de tipos es un dato, no una cadena de `if`

Los tres tipos se definen en un módulo de dominio como una estructura que asocia cada identificador con su etiqueta visible y su color. Las vistas iteran ese catálogo para armar el selector y lo consultan para pintar cada fila.

Esto evita el mapeo tipo→color repetido en el formulario y en el listado, que es donde suelen aparecer las inconsistencias. El tipo se persiste por su identificador, nunca por su color ni por su etiqueta, para que un cambio de paleta o de texto no invalide los datos ya guardados.

### La persistencia se encapsula detrás de un módulo propio

La lectura y escritura en `localStorage` queda en un módulo de repositorio con dos operaciones, cargar y guardar. El store lo usa sin conocer el mecanismo de almacenamiento.

Es la costura que permite reemplazar el almacenamiento local por llamadas a una API sin tocar vistas ni componentes. La lectura valida la forma de los datos y devuelve una lista vacía ante contenido inválido, como exige la spec, para que un dato corrupto no deje la aplicación inutilizable.

### Colores accesibles acompañados de texto

El color se aplica como indicador visual, pero el nombre del tipo se muestra siempre en texto. Es un requisito de la spec y responde a que aproximadamente uno de cada doce varones tiene alguna deficiencia en la percepción del rojo y el verde, justamente los dos colores que aquí distinguen Tipo 1 de Tipo 3.

## Risks / Trade-offs

- **Los datos viven en un solo navegador** → Es la consecuencia directa de no tener backend. Se acota encapsulando la persistencia detrás del repositorio, de modo que migrar a una API sea un cambio localizado. Debe quedar claro para la Defensoría que hoy los turnos se cargan y se consultan en el mismo equipo.
- **Borrar los datos del navegador elimina los turnos del día** → No hay copia de respaldo posible sin backend. Mitigación parcial: el listado es la vista de trabajo y está siempre a la vista, por lo que una pérdida se detecta de inmediato.
- **Dos pestañas abiertas pueden asignar el mismo número** → Cada pestaña mantiene su propio estado en memoria y no se entera de lo que escribe la otra. El uso previsto es un único puesto de carga, y el listado se ordena por número, con lo que un duplicado sería visible. Si el uso con varias pestañas se vuelve real, la solución es escuchar el evento `storage` o pasar a backend.
- **El reinicio diario depende del reloj del equipo** → Un reloj mal configurado altera la numeración. Se asume aceptable para un equipo de oficina, y el impacto se limita a la numeración de un día.
- **Se elimina código del andamiaje** → Quitar `HomeView`, `AboutView`, los componentes de bienvenida y el store `counter` deja el proyecto sin ese material de referencia. Es deliberado: son ejemplos generados, no código del proyecto, y su test asociado se reemplaza por tests reales de dominio.

## Migration Plan

No aplica migración de datos: no hay versiones previas ni datos existentes. El despliegue es el de una SPA estática (`npm run build` y publicación de `dist/`), y el rollback consiste en volver a publicar la versión anterior, sin efectos sobre datos porque los turnos residen en el navegador de cada equipo.
