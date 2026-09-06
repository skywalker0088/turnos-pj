## 1. Modelo de dominio y catálogo de tipos

- [x] 1.1 Crear `src/domain/tipoTurno.ts` con los tres tipos y su etiqueta y color asociados, exportando el catálogo y el tipo TypeScript del identificador; verificar que `npm run type-check` pasa y que el identificador solo admite los tres valores válidos
- [x] 1.2 Crear `src/domain/turno.ts` con el tipo `Turno` (número, nombre, apellido, documento, tipo e ISO de la fecha de registro); verificar con `npm run type-check`
- [x] 1.3 Implementar en `src/domain/validacion.ts` la validación de nombre, apellido y documento (no vacíos tras recortar espacios; documento de 6 a 10 dígitos) devolviendo los errores por campo
- [x] 1.4 Agregar `src/domain/__tests__/validacion.spec.ts` cubriendo campo vacío, campo con solo espacios, documento no numérico, documento de 5 y de 11 dígitos, y un caso válido; verificar que pasan con `npm run test:unit`

## 2. Numeración correlativa

- [x] 2.1 Implementar en `src/domain/numeracion.ts` el cálculo del próximo número como el máximo de los turnos de la fecha actual más uno, devolviendo 1 cuando no hay turnos de ese día
- [x] 2.2 Agregar `src/domain/__tests__/numeracion.spec.ts` cubriendo lista vacía (devuelve 1), secuencia correlativa sin huecos, numeración compartida entre tipos distintos, y reinicio a 1 cuando solo existen turnos de días anteriores; verificar con `npm run test:unit`

## 3. Persistencia

- [x] 3.1 Crear `src/repositories/turnosRepository.ts` con las operaciones de cargar y guardar contra `localStorage` bajo una clave propia, validando la forma de los datos al leer y devolviendo lista vacía ante contenido inválido
- [x] 3.2 Agregar `src/repositories/__tests__/turnosRepository.spec.ts` verificando el ida y vuelta de guardar y cargar, y que un JSON corrupto o con estructura inesperada devuelve lista vacía sin lanzar excepción; verificar con `npm run test:unit`

## 4. Store de turnos

- [x] 4.1 Crear `src/stores/turnos.ts` con el store de Pinia que inicializa desde el repositorio, expone los turnos ordenados por número como getter y la acción de registrar que asigna el correlativo y persiste
- [x] 4.2 Agregar `src/stores/__tests__/turnos.spec.ts` verificando que registrar agrega el turno con el número esperado, que el getter devuelve orden ascendente independientemente del orden de alta, y que el alta persiste en el repositorio; verificar con `npm run test:unit`

## 5. Pantalla de solicitud de turno

- [x] 5.1 Crear `src/views/SolicitudTurnoView.vue` con el formulario de nombre, apellido, documento y selector de los tres tipos con su color, tomando las opciones del catálogo
- [x] 5.2 Conectar el envío al store: bloquear el alta si hay errores de validación, mostrar el mensaje por campo y no consumir número de turno cuando la validación falla
- [x] 5.3 Mostrar la confirmación con el número asignado y el tipo solicitado, y limpiar los campos para la siguiente persona sin recargar la página
- [x] 5.4 Agregar `src/views/__tests__/SolicitudTurnoView.spec.ts` verificando que un envío inválido no registra turno y muestra el error, y que un envío válido registra y muestra el número asignado; verificar con `npm run test:unit`

## 6. Pantalla de listado

- [x] 6.1 Crear `src/views/ListadoTurnosView.vue` mostrando número, nombre, apellido, documento y tipo de cada turno, en orden ascendente por número
- [x] 6.2 Aplicar el color del tipo como indicador visual acompañado siempre de la etiqueta del tipo en texto, derivando ambos del catálogo
- [x] 6.3 Mostrar el mensaje de listado vacío con un acceso a la pantalla de solicitud cuando no hay turnos registrados
- [x] 6.4 Agregar `src/views/__tests__/ListadoTurnosView.spec.ts` verificando el orden ascendente con tipos intercalados, la presencia de la etiqueta de tipo en texto, y el mensaje de lista vacía; verificar con `npm run test:unit`

## 7. Rutas y limpieza del andamiaje

- [x] 7.1 Reemplazar las rutas de ejemplo en `src/router/index.ts` por `/` hacia la solicitud y `/turnos` hacia el listado, verificando que ambas direcciones abren directamente en el navegador
- [x] 7.2 Actualizar `src/App.vue` con la navegación entre ambas pantallas y quitar el logo y el encabezado de bienvenida del andamiaje
- [x] 7.3 Eliminar `HomeView.vue`, `AboutView.vue`, `TheWelcome.vue`, `WelcomeItem.vue`, `HelloWorld.vue`, los iconos de ejemplo, `stores/counter.ts` y `components/__tests__/HelloWorld.spec.ts`; verificar que `npm run build` sigue compilando sin referencias rotas

## 8. Verificación final

- [x] 8.1 Ejecutar `npm run type-check`, `npm run lint` y `npm run test:unit` y confirmar que los tres pasan sin errores
- [ ] 8.2 Recorrer el flujo completo en `npm run dev`: registrar turnos de los tres tipos, comprobar la numeración correlativa y los colores en el listado, recargar la página y confirmar que los turnos siguen presentes con sus mismos números
