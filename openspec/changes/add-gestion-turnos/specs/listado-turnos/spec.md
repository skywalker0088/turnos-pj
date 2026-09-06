## Purpose

Muestra en pantalla los turnos ya registrados en su orden de atención, permitiendo al personal de la Defensoría saber a quién sigue atender e identificar de un vistazo el tipo de atención que requiere cada persona.

## ADDED Requirements

### Requirement: Datos visibles de cada turno

El listado SHALL mostrar, para cada turno registrado, su número, el nombre, el apellido, el documento y el tipo de turno de la persona.

#### Scenario: Un turno registrado aparece con todos sus datos

- **WHEN** existe al menos un turno registrado y se abre el listado
- **THEN** se muestra una fila por turno con su número, nombre, apellido, documento y tipo de turno

#### Scenario: Un turno recién registrado aparece sin recargar

- **WHEN** se registra una nueva solicitud y luego se abre el listado
- **THEN** el turno recién registrado aparece en la lista

### Requirement: Orden de atención por número de turno

El listado SHALL ordenar los turnos de forma ascendente por número de turno, de modo que la posición en la lista refleje el orden de atención.

El orden SHALL ser independiente del tipo de turno: un tipo determinado no adelanta ni retrasa la posición de una persona.

#### Scenario: Los turnos se muestran en orden ascendente

- **WHEN** existen varios turnos registrados
- **THEN** se muestran ordenados del número más bajo al más alto

#### Scenario: El tipo de turno no altera el orden

- **WHEN** existen turnos de distintos tipos intercalados
- **THEN** el orden de la lista sigue siendo el de los números de turno y no se agrupa por tipo

### Requirement: Identificación visual por color

El listado SHALL asociar a cada turno el color de su tipo, de manera que el tipo de atención se distinga de un vistazo: rojo para Tipo 1, amarillo para Tipo 2 y verde para Tipo 3.

El color SHALL acompañarse siempre del nombre del tipo en texto, de modo que la información no dependa únicamente de la percepción del color.

#### Scenario: Cada tipo se muestra con su color

- **WHEN** se muestran turnos de Tipo 1, Tipo 2 y Tipo 3
- **THEN** los de Tipo 1 se identifican con rojo, los de Tipo 2 con amarillo y los de Tipo 3 con verde

#### Scenario: El tipo también se comunica en texto

- **WHEN** se muestra un turno de cualquier tipo
- **THEN** junto al color se muestra el nombre del tipo de turno como texto legible

### Requirement: Listado sin turnos

Cuando no hay turnos registrados, el listado SHALL informar explícitamente esa situación en lugar de mostrar una pantalla vacía sin explicación.

#### Scenario: No hay turnos cargados

- **WHEN** se abre el listado y no existe ningún turno registrado
- **THEN** se muestra un mensaje que indica que todavía no hay turnos
- **AND** se ofrece la forma de ir a registrar una nueva solicitud

### Requirement: Navegación entre solicitud y listado

El sistema SHALL permitir moverse entre la pantalla de solicitud de turno y la de listado, y cada una SHALL tener una dirección propia que pueda abrirse directamente.

#### Scenario: Se navega entre ambas pantallas

- **WHEN** una persona está en cualquiera de las dos pantallas
- **THEN** puede pasar a la otra desde la navegación de la aplicación

#### Scenario: Se abre el listado directamente por su dirección

- **WHEN** se accede directamente a la dirección del listado
- **THEN** se muestra el listado de turnos sin pasar antes por la pantalla de solicitud
