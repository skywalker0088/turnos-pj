import type { TipoTurnoId } from './tipoTurno'

/** Un turno ya registrado, con su número de atención asignado. */
export interface Turno {
  numero: number
  nombre: string
  apellido: string
  documento: string
  tipo: TipoTurnoId
  /** Día de registro en formato AAAA-MM-DD; determina a qué correlativo pertenece. */
  fecha: string
}

/** Datos que ingresa la persona, antes de que el sistema asigne el número. */
export interface SolicitudTurno {
  nombre: string
  apellido: string
  documento: string
  tipo: TipoTurnoId | ''
}

export function fechaDeHoy(referencia: Date = new Date()): string {
  const anio = referencia.getFullYear()
  const mes = String(referencia.getMonth() + 1).padStart(2, '0')
  const dia = String(referencia.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}
