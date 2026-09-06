import { describe, it, expect, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ListadoTurnosView from '../ListadoTurnosView.vue'
import { useTurnosStore } from '@/stores/turnos'
import { fechaDeHoy } from '@/domain/turno'
import type { Turno } from '@/domain/turno'
import type { TipoTurnoId } from '@/domain/tipoTurno'

function turno(numero: number, tipo: TipoTurnoId, nombre = 'Ana'): Turno {
  return {
    numero,
    nombre,
    apellido: 'Gómez',
    documento: `3012345${numero}`,
    tipo,
    fecha: fechaDeHoy(),
  }
}

function montar() {
  return mount(ListadoTurnosView, {
    global: { stubs: { RouterLink: RouterLinkStub } },
  })
}

describe('ListadoTurnosView', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('avisa que no hay turnos y ofrece ir a solicitar uno', () => {
    const wrapper = montar()

    expect(wrapper.text()).toContain('Todavía no hay turnos registrados.')
    expect(wrapper.findComponent(RouterLinkStub).props().to).toBe('/')
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('muestra los datos de cada turno registrado', () => {
    const store = useTurnosStore()
    store.turnos = [turno(1, 'tipo-1', 'Ana')]

    const wrapper = montar()
    const fila = wrapper.find('tbody tr')

    expect(fila.text()).toContain('1')
    expect(fila.text()).toContain('Ana')
    expect(fila.text()).toContain('Gómez')
    expect(fila.text()).toContain('30123451')
    expect(fila.text()).toContain('Tipo 1')
  })

  it('ordena las filas de forma ascendente por número de turno', () => {
    const store = useTurnosStore()
    store.turnos = [turno(3, 'tipo-1'), turno(1, 'tipo-2'), turno(2, 'tipo-3')]

    const wrapper = montar()
    const numeros = wrapper.findAll('tbody .numero').map((celda) => celda.text())

    expect(numeros).toEqual(['1', '2', '3'])
  })

  it('no agrupa por tipo: mantiene el orden con tipos intercalados', () => {
    const store = useTurnosStore()
    store.turnos = [turno(1, 'tipo-3'), turno(2, 'tipo-1'), turno(3, 'tipo-3'), turno(4, 'tipo-2')]

    const wrapper = montar()
    const tipos = wrapper.findAll('tbody .etiqueta-tipo').map((etiqueta) => etiqueta.text())

    expect(tipos).toEqual(['Tipo 3', 'Tipo 1', 'Tipo 3', 'Tipo 2'])
  })

  it('identifica cada tipo con su color y con su nombre en texto', () => {
    const store = useTurnosStore()
    store.turnos = [turno(1, 'tipo-1'), turno(2, 'tipo-2'), turno(3, 'tipo-3')]

    const wrapper = montar()
    const etiquetas = wrapper.findAll('tbody .etiqueta-tipo')

    expect(etiquetas.map((etiqueta) => etiqueta.text())).toEqual(['Tipo 1', 'Tipo 2', 'Tipo 3'])
    expect(etiquetas.map((etiqueta) => etiqueta.attributes('style'))).toEqual([
      expect.stringContaining('rgb(198, 40, 40)'),
      expect.stringContaining('rgb(249, 168, 37)'),
      expect.stringContaining('rgb(46, 125, 50)'),
    ])
  })

  it('refleja un turno registrado a través del store sin recargar', async () => {
    const store = useTurnosStore()
    const wrapper = montar()

    expect(wrapper.find('table').exists()).toBe(false)

    store.registrar({ nombre: 'Luis', apellido: 'Pérez', documento: '28987654', tipo: 'tipo-2' })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('tbody tr').text()).toContain('Luis')
  })
})
