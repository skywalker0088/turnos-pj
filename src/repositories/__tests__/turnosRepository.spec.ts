import { describe, it, expect, beforeEach } from 'vitest'
import { cargarTurnos, guardarTurnos } from '../turnosRepository'
import type { Turno } from '@/domain/turno'

const CLAVE = 'turnos:v1'

const turnos: Turno[] = [
  {
    numero: 1,
    nombre: 'Ana',
    apellido: 'Gómez',
    documento: '30123456',
    tipo: 'tipo-1',
    fecha: '2026-09-06',
  },
  {
    numero: 2,
    nombre: 'Luis',
    apellido: 'Pérez',
    documento: '28987654',
    tipo: 'tipo-3',
    fecha: '2026-09-06',
  },
]

describe('turnosRepository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('devuelve lista vacía cuando no hay nada almacenado', () => {
    expect(cargarTurnos()).toEqual([])
  })

  it('recupera los turnos tal como fueron guardados', () => {
    guardarTurnos(turnos)

    expect(cargarTurnos()).toEqual(turnos)
  })

  it('devuelve lista vacía si el contenido no es JSON válido', () => {
    localStorage.setItem(CLAVE, 'esto no es json {{{')

    expect(() => cargarTurnos()).not.toThrow()
    expect(cargarTurnos()).toEqual([])
  })

  it('devuelve lista vacía si el JSON no es un arreglo', () => {
    localStorage.setItem(CLAVE, JSON.stringify({ numero: 1 }))

    expect(cargarTurnos()).toEqual([])
  })

  it('descarta los elementos con estructura inesperada', () => {
    localStorage.setItem(CLAVE, JSON.stringify([turnos[0], { numero: 'dos' }, null, 'texto']))

    expect(cargarTurnos()).toEqual([turnos[0]])
  })

  it('descarta los turnos con un tipo desconocido', () => {
    localStorage.setItem(CLAVE, JSON.stringify([{ ...turnos[0], tipo: 'tipo-9' }]))

    expect(cargarTurnos()).toEqual([])
  })
})
