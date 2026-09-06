import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import SolicitudTurnoView from '../SolicitudTurnoView.vue'
import { useTurnosStore } from '@/stores/turnos'

function montar() {
  return mount(SolicitudTurnoView)
}

async function completarFormulario(
  wrapper: ReturnType<typeof montar>,
  datos: { nombre?: string; apellido?: string; documento?: string; tipo?: string },
) {
  if (datos.nombre !== undefined) await wrapper.find('#nombre').setValue(datos.nombre)
  if (datos.apellido !== undefined) await wrapper.find('#apellido').setValue(datos.apellido)
  if (datos.documento !== undefined) await wrapper.find('#documento').setValue(datos.documento)
  if (datos.tipo !== undefined) await wrapper.find(`input[value="${datos.tipo}"]`).setValue()
}

describe('SolicitudTurnoView', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('ofrece las tres opciones de tipo de turno', () => {
    const wrapper = montar()

    const opciones = wrapper.findAll('input[name="tipo"]')

    expect(opciones).toHaveLength(3)
    expect(wrapper.text()).toContain('Tipo 1')
    expect(wrapper.text()).toContain('Tipo 2')
    expect(wrapper.text()).toContain('Tipo 3')
  })

  it('no registra el turno ni consume número cuando faltan datos', async () => {
    const wrapper = montar()
    const store = useTurnosStore()

    await wrapper.find('form').trigger('submit')

    expect(store.turnos).toHaveLength(0)
    expect(wrapper.findAll('.error').length).toBeGreaterThan(0)
  })

  it('indica el campo que falta completar', async () => {
    const wrapper = montar()

    await completarFormulario(wrapper, { apellido: 'Gómez', documento: '30123456', tipo: 'tipo-1' })
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Ingresá el nombre.')
  })

  it('rechaza un documento con formato inválido', async () => {
    const wrapper = montar()
    const store = useTurnosStore()

    await completarFormulario(wrapper, {
      nombre: 'Ana',
      apellido: 'Gómez',
      documento: '30.123',
      tipo: 'tipo-1',
    })
    await wrapper.find('form').trigger('submit')

    expect(store.turnos).toHaveLength(0)
    expect(wrapper.text()).toContain('entre 6 y 10 dígitos')
  })

  it('registra el turno y muestra el número asignado con su tipo', async () => {
    const wrapper = montar()
    const store = useTurnosStore()

    await completarFormulario(wrapper, {
      nombre: 'Ana',
      apellido: 'Gómez',
      documento: '30123456',
      tipo: 'tipo-2',
    })
    await wrapper.find('form').trigger('submit')

    expect(store.turnos).toHaveLength(1)
    const confirmacion = wrapper.find('.confirmacion')
    expect(confirmacion.exists()).toBe(true)
    expect(confirmacion.text()).toContain('1')
    expect(confirmacion.text()).toContain('Tipo 2')
  })

  it('vacía los campos para la siguiente persona', async () => {
    const wrapper = montar()

    await completarFormulario(wrapper, {
      nombre: 'Ana',
      apellido: 'Gómez',
      documento: '30123456',
      tipo: 'tipo-2',
    })
    await wrapper.find('form').trigger('submit')

    expect((wrapper.find('#nombre').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#apellido').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#documento').element as HTMLInputElement).value).toBe('')
    expect(wrapper.findAll('input[name="tipo"]:checked')).toHaveLength(0)
  })

  it('permite cargar dos solicitudes seguidas con números correlativos', async () => {
    const wrapper = montar()
    const store = useTurnosStore()

    await completarFormulario(wrapper, {
      nombre: 'Ana',
      apellido: 'Gómez',
      documento: '30123456',
      tipo: 'tipo-1',
    })
    await wrapper.find('form').trigger('submit')

    await completarFormulario(wrapper, {
      nombre: 'Luis',
      apellido: 'Pérez',
      documento: '28987654',
      tipo: 'tipo-3',
    })
    await wrapper.find('form').trigger('submit')

    expect(store.turnos.map((turno) => turno.numero)).toEqual([1, 2])
    expect(wrapper.find('.confirmacion').text()).toContain('2')
  })

  it('guarda los datos sin los espacios sobrantes', async () => {
    const wrapper = montar()
    const store = useTurnosStore()

    await completarFormulario(wrapper, {
      nombre: '  Ana  ',
      apellido: '  Gómez  ',
      documento: '30123456',
      tipo: 'tipo-1',
    })
    await wrapper.find('form').trigger('submit')

    expect(store.turnos[0]?.nombre).toBe('Ana')
    expect(store.turnos[0]?.apellido).toBe('Gómez')
  })
})
