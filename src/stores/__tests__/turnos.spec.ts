import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTurnosStore } from '../turnos'
import { cargarTurnos } from '@/repositories/turnosRepository'
import { fechaDeHoy } from '@/domain/turno'

describe('useTurnosStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('asigna el número 1 al primer turno del día', () => {
    const store = useTurnosStore()

    const turno = store.registrar({
      nombre: 'Ana',
      apellido: 'Gómez',
      documento: '30123456',
      tipo: 'tipo-1',
    })

    expect(turno.numero).toBe(1)
    expect(store.turnos).toHaveLength(1)
  })

  it('asigna números correlativos a las altas sucesivas', () => {
    const store = useTurnosStore()

    const numeros = [
      store.registrar({ nombre: 'Ana', apellido: 'G', documento: '30123456', tipo: 'tipo-1' }),
      store.registrar({ nombre: 'Luis', apellido: 'P', documento: '28987654', tipo: 'tipo-3' }),
      store.registrar({ nombre: 'Eva', apellido: 'R', documento: '33111222', tipo: 'tipo-2' }),
    ].map((turno) => turno.numero)

    expect(numeros).toEqual([1, 2, 3])
  })

  it('registra el turno con la fecha del día en curso', () => {
    const store = useTurnosStore()

    const turno = store.registrar({
      nombre: 'Ana',
      apellido: 'Gómez',
      documento: '30123456',
      tipo: 'tipo-1',
    })

    expect(turno.fecha).toBe(fechaDeHoy())
  })

  it('recorta los espacios sobrantes de los datos ingresados', () => {
    const store = useTurnosStore()

    const turno = store.registrar({
      nombre: '  Ana  ',
      apellido: '  Gómez ',
      documento: ' 30123456 ',
      tipo: 'tipo-2',
    })

    expect(turno.nombre).toBe('Ana')
    expect(turno.apellido).toBe('Gómez')
    expect(turno.documento).toBe('30123456')
  })

  it('persiste el alta en el repositorio', () => {
    const store = useTurnosStore()

    store.registrar({ nombre: 'Ana', apellido: 'G', documento: '30123456', tipo: 'tipo-1' })

    expect(cargarTurnos()).toHaveLength(1)
    expect(cargarTurnos()[0]?.nombre).toBe('Ana')
  })

  it('devuelve los turnos ordenados por número aunque el estado esté desordenado', () => {
    const store = useTurnosStore()
    const fecha = fechaDeHoy()

    store.turnos = [
      { numero: 3, nombre: 'C', apellido: 'C', documento: '30000003', tipo: 'tipo-3', fecha },
      { numero: 1, nombre: 'A', apellido: 'A', documento: '30000001', tipo: 'tipo-1', fecha },
      { numero: 2, nombre: 'B', apellido: 'B', documento: '30000002', tipo: 'tipo-2', fecha },
    ]

    expect(store.turnosOrdenados.map((turno) => turno.numero)).toEqual([1, 2, 3])
  })

  it('arranca con los turnos que ya estaban almacenados', () => {
    const fecha = fechaDeHoy()
    localStorage.setItem(
      'turnos:v1',
      JSON.stringify([
        { numero: 1, nombre: 'Ana', apellido: 'G', documento: '30123456', tipo: 'tipo-1', fecha },
      ]),
    )
    setActivePinia(createPinia())

    const store = useTurnosStore()

    expect(store.turnos).toHaveLength(1)
    expect(store.registrar({ nombre: 'Luis', apellido: 'P', documento: '28987654', tipo: 'tipo-2' }).numero).toBe(2)
  })
})
