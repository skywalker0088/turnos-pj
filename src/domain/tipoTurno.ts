/**
 * Catálogo de tipos de turno.
 *
 * El identificador es lo único que se persiste: la etiqueta y el color se
 * derivan de acá, de modo que cambiar un texto o la paleta no invalida los
 * turnos ya registrados.
 */

export type TipoTurnoId = 'tipo-1' | 'tipo-2' | 'tipo-3'

export interface TipoTurno {
  id: TipoTurnoId
  etiqueta: string
  color: string
  colorTexto: string
}

export const TIPOS_TURNO: readonly TipoTurno[] = [
  { id: 'tipo-1', etiqueta: 'Tipo 1', color: '#c62828', colorTexto: '#ffffff' },
  { id: 'tipo-2', etiqueta: 'Tipo 2', color: '#f9a825', colorTexto: '#231f00' },
  { id: 'tipo-3', etiqueta: 'Tipo 3', color: '#2e7d32', colorTexto: '#ffffff' },
] as const

export function esTipoTurnoId(valor: unknown): valor is TipoTurnoId {
  return TIPOS_TURNO.some((tipo) => tipo.id === valor)
}

export function obtenerTipoTurno(id: TipoTurnoId): TipoTurno {
  const tipo = TIPOS_TURNO.find((candidato) => candidato.id === id)
  if (!tipo) {
    throw new Error(`Tipo de turno desconocido: ${id}`)
  }
  return tipo
}
