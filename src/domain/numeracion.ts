import type { Turno } from './turno'
import { fechaDeHoy } from './turno'

/**
 * Deriva el próximo número a partir de los turnos de la fecha indicada. No hay
 * contador persistido: al calcularlo desde la lista, la secuencia no puede
 * quedar desincronizada ni dejar huecos si una escritura falla.
 */
export function proximoNumero(turnos: readonly Turno[], fecha: string = fechaDeHoy()): number {
  const numerosDelDia = turnos.filter((turno) => turno.fecha === fecha).map((turno) => turno.numero)

  if (numerosDelDia.length === 0) {
    return 1
  }

  return Math.max(...numerosDelDia) + 1
}

export function ordenarPorNumero(turnos: readonly Turno[]): Turno[] {
  return [...turnos].sort((a, b) => a.numero - b.numero)
}
