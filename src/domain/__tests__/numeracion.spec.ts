import { describe, it, expect } from 'vitest'
import { proximoNumero, ordenarPorNumero } from '../numeracion'
import type { Turno } from '../turno'
import type { TipoTurnoId } from '../tipoTurno'

const HOY = '2026-09-06'
const AYER = '2026-09-05'

function turno(numero: number, fecha: string = HOY, tipo: TipoTurnoId = 'tipo-1'): Turno {
  return {
    numero,
    nombre: 'Ana',
    apellido: 'Gómez',
    documento: '30123456',
    tipo,
    fecha,
  }
}

describe('proximoNumero', () => {
  it('devuelve 1 cuando no hay ningún turno', () => {
    expect(proximoNumero([], HOY)).toBe(1)
  })

  it('devuelve 1 cuando solo existen turnos de días anteriores', () => {
    const previos = [turno(1, AYER), turno(2, AYER), turno(3, AYER)]

    expect(proximoNumero(previos, HOY)).toBe(1)
  })

  it('sigue la secuencia sin huecos dentro del mismo día', () => {
    const turnos: Turno[] = []
    const numerosAsignados: number[] = []

    for (let i = 0; i < 4; i++) {
      const numero = proximoNumero(turnos, HOY)
      numerosAsignados.push(numero)
      turnos.push(turno(numero))
    }

    expect(numerosAsignados).toEqual([1, 2, 3, 4])
  })

  it('comparte la secuencia entre tipos de turno distintos', () => {
    const turnos = [turno(1, HOY, 'tipo-3'), turno(2, HOY, 'tipo-1')]

    expect(proximoNumero(turnos, HOY)).toBe(3)
  })

  it('ignora los turnos de otros días al calcular el máximo', () => {
    const turnos = [turno(87, AYER), turno(1, HOY)]

    expect(proximoNumero(turnos, HOY)).toBe(2)
  })
})

describe('ordenarPorNumero', () => {
  it('ordena de forma ascendente sin alterar la lista original', () => {
    const turnos = [turno(3), turno(1), turno(2)]

    const ordenados = ordenarPorNumero(turnos)

    expect(ordenados.map((t) => t.numero)).toEqual([1, 2, 3])
    expect(turnos.map((t) => t.numero)).toEqual([3, 1, 2])
  })

  it('no agrupa por tipo de turno', () => {
    const turnos = [turno(1, HOY, 'tipo-3'), turno(2, HOY, 'tipo-1'), turno(3, HOY, 'tipo-3')]

    expect(ordenarPorNumero(turnos).map((t) => t.tipo)).toEqual(['tipo-3', 'tipo-1', 'tipo-3'])
  })
})
