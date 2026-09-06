import type { Turno } from '@/domain/turno'
import { esTipoTurnoId } from '@/domain/tipoTurno'

/**
 * Acceso al almacenamiento de turnos. Es la única parte que conoce
 * `localStorage`: reemplazarlo por una API sólo debería cambiar este módulo.
 */

const CLAVE_ALMACENAMIENTO = 'turnos:v1'

function esTurno(valor: unknown): valor is Turno {
  if (typeof valor !== 'object' || valor === null) {
    return false
  }

  const candidato = valor as Record<string, unknown>

  return (
    typeof candidato.numero === 'number' &&
    Number.isInteger(candidato.numero) &&
    candidato.numero > 0 &&
    typeof candidato.nombre === 'string' &&
    typeof candidato.apellido === 'string' &&
    typeof candidato.documento === 'string' &&
    typeof candidato.fecha === 'string' &&
    esTipoTurnoId(candidato.tipo)
  )
}

/**
 * Devuelve los turnos almacenados. Ante datos ilegibles o con forma
 * inesperada devuelve una lista vacía: un dato corrupto no debe dejar la
 * aplicación inutilizable.
 */
export function cargarTurnos(): Turno[] {
  try {
    const crudo = localStorage.getItem(CLAVE_ALMACENAMIENTO)
    if (crudo === null) {
      return []
    }

    const analizado: unknown = JSON.parse(crudo)
    if (!Array.isArray(analizado)) {
      return []
    }

    return analizado.filter(esTurno)
  } catch {
    return []
  }
}

export function guardarTurnos(turnos: readonly Turno[]): void {
  try {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(turnos))
  } catch {
    // Sin backend no hay dónde reintentar: se prioriza que la aplicación siga
    // usable en memoria antes que interrumpir la atención al público.
  }
}
