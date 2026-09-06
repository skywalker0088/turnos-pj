## Purpose

Permite registrar a una persona que llega a ser atendida en la Defensoría, capturando sus datos identificatorios y el tipo de atención que necesita, y asignándole automáticamente un número que fija su orden de atención.

## ADDED Requirements

### Requirement: Catálogo de tipos de turno

El sistema SHALL ofrecer exactamente tres tipos de turno, cada uno con un color asociado fijo: Tipo 1 en rojo, Tipo 2 en amarillo y Tipo 3 en verde. La persona que solicita el turno SHALL elegir uno y solo uno de ellos.

El color SHALL ser un atributo derivado del tipo y no un dato que el usuario pueda elegir por separado.

#### Scenario: Los tres tipos están disponibles para elegir

- **WHEN** una persona abre el formulario de solicitud de turno
- **THEN** el sistema ofrece las tres opciones Tipo 1, Tipo 2 y Tipo 3
- **AND** cada opción se muestra junto a su color correspondiente (rojo, amarillo y verde respectivamente)

#### Scenario: No se puede solicitar un tipo inexistente

- **WHEN** se intenta registrar una solicitud con un tipo de turno distinto de Tipo 1, Tipo 2 o Tipo 3
- **THEN** el sistema rechaza la solicitud y no genera ningún número de turno

### Requirement: Datos obligatorios de la solicitud

El sistema SHALL requerir nombre, apellido, documento y tipo de turno para registrar una solicitud. Todos los campos SHALL ser obligatorios.

El nombre y el apellido SHALL tener al menos un carácter no vacío una vez descartados los espacios al inicio y al final. El documento SHALL contener entre 6 y 10 dígitos numéricos.

#### Scenario: Solicitud con todos los datos completos

- **WHEN** una persona completa nombre, apellido, un documento válido y elige un tipo de turno, y envía el formulario
- **THEN** el sistema registra la solicitud
- **AND** le asigna un número de turno

#### Scenario: Falta un campo obligatorio

- **WHEN** una persona envía el formulario con al menos uno de los cuatro campos vacío
- **THEN** el sistema no registra la solicitud
- **AND** muestra un mensaje que indica qué campo falta completar
- **AND** no consume ningún número de turno

#### Scenario: Documento con formato inválido

- **WHEN** una persona envía el formulario con un documento que contiene caracteres no numéricos, o que tiene menos de 6 o más de 10 dígitos
- **THEN** el sistema no registra la solicitud
- **AND** muestra un mensaje indicando que el documento no es válido

#### Scenario: Los espacios sobrantes no se guardan

- **WHEN** una persona ingresa nombre o apellido con espacios al principio o al final
- **THEN** el turno se registra con esos valores sin los espacios sobrantes

### Requirement: Asignación automática del número de turno

El sistema SHALL asignar el número de turno automáticamente al registrar la solicitud, sin que ninguna persona pueda elegirlo, editarlo ni repetirlo.

Los números SHALL ser enteros positivos correlativos sin huecos, comenzando en 1 para el primer turno de cada día y aumentando de a uno por cada solicitud registrada. El correlativo SHALL ser único dentro del día y compartido por todos los tipos de turno, de modo que el número refleje el orden real de llegada.

#### Scenario: El primer turno del día recibe el número 1

- **WHEN** se registra la primera solicitud de un día sin turnos previos
- **THEN** el turno registrado recibe el número 1

#### Scenario: Los turnos siguientes son correlativos

- **WHEN** ya existen turnos registrados en el día y se registra una nueva solicitud
- **THEN** el nuevo turno recibe el número siguiente al mayor número asignado ese día
- **AND** ningún número queda repetido ni salteado

#### Scenario: El correlativo no depende del tipo de turno

- **WHEN** se registran solicitudes de distintos tipos de turno de forma consecutiva
- **THEN** todas comparten la misma secuencia de numeración según su orden de registro

#### Scenario: El correlativo se reinicia cada día

- **WHEN** se registra la primera solicitud de un día y existen turnos registrados de días anteriores
- **THEN** el turno recibe el número 1
- **AND** los turnos de días anteriores conservan los números que ya tenían

### Requirement: Confirmación de la solicitud registrada

Al registrar una solicitud, el sistema SHALL informar a la persona el número de turno asignado, de forma que pueda retenerlo para esperar su atención.

#### Scenario: Se muestra el número asignado

- **WHEN** una solicitud se registra correctamente
- **THEN** el sistema muestra el número de turno asignado junto con el tipo de turno solicitado

#### Scenario: El formulario queda listo para la próxima persona

- **WHEN** una solicitud se registra correctamente
- **THEN** los campos del formulario se vacían
- **AND** es posible cargar una nueva solicitud sin recargar la página

### Requirement: Persistencia de los turnos registrados

El sistema SHALL conservar los turnos registrados de forma que sigan disponibles después de recargar o cerrar y volver a abrir la aplicación en el mismo navegador.

Si los datos almacenados no se pueden leer o están corruptos, el sistema SHALL iniciar con una lista vacía en lugar de impedir el uso de la aplicación.

#### Scenario: Los turnos sobreviven a una recarga

- **WHEN** se registran turnos y luego se recarga la aplicación
- **THEN** los turnos registrados siguen visibles con sus mismos números, datos y tipos

#### Scenario: Datos almacenados ilegibles

- **WHEN** la aplicación se inicia y los datos almacenados no tienen un formato válido
- **THEN** la aplicación arranca con la lista de turnos vacía
- **AND** permite registrar nuevas solicitudes normalmente
