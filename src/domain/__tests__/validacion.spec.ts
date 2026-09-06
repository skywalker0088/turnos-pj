import { describe, it, expect } from 'vitest'
import { validarSolicitud, hayErrores } from '../validacion'
import type { SolicitudTurno } from '../turno'

function solicitud(cambios: Partial<SolicitudTurno> = {}): SolicitudTurno {
  return {
    nombre: 'Ana',
    apellido: 'Gómez',
    documento: '30123456',
    tipo: 'tipo-2',
    ...cambios,
  }
}

describe('validarSolicitud', () => {
  it('no reporta errores cuando todos los datos son válidos', () => {
    const errores = validarSolicitud(solicitud())

    expect(errores).toEqual({})
    expect(hayErrores(errores)).toBe(false)
  })

  it('reporta el campo vacío que falta completar', () => {
    const errores = validarSolicitud(solicitud({ nombre: '' }))

    expect(errores.nombre).toBeDefined()
    expect(errores.apellido).toBeUndefined()
    expect(hayErrores(errores)).toBe(true)
  })

  it('trata un campo con solo espacios como vacío', () => {
    const errores = validarSolicitud(solicitud({ apellido: '   ' }))

    expect(errores.apellido).toBeDefined()
  })

  it('rechaza un documento con caracteres no numéricos', () => {
    const errores = validarSolicitud(solicitud({ documento: '30.123.456' }))

    expect(errores.documento).toBeDefined()
  })

  it('rechaza un documento de menos de 6 dígitos', () => {
    const errores = validarSolicitud(solicitud({ documento: '12345' }))

    expect(errores.documento).toBeDefined()
  })

  it('rechaza un documento de más de 10 dígitos', () => {
    const errores = validarSolicitud(solicitud({ documento: '12345678901' }))

    expect(errores.documento).toBeDefined()
  })

  it('acepta los documentos en los límites de 6 y 10 dígitos', () => {
    expect(validarSolicitud(solicitud({ documento: '123456' })).documento).toBeUndefined()
    expect(validarSolicitud(solicitud({ documento: '1234567890' })).documento).toBeUndefined()
  })

  it('exige elegir un tipo de turno', () => {
    const errores = validarSolicitud(solicitud({ tipo: '' }))

    expect(errores.tipo).toBeDefined()
  })

  it('rechaza un tipo de turno inexistente', () => {
    const errores = validarSolicitud(solicitud({ tipo: 'tipo-9' as SolicitudTurno['tipo'] }))

    expect(errores.tipo).toBeDefined()
  })
})
