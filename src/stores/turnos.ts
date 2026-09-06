import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Turno, SolicitudTurno } from '@/domain/turno'
import { fechaDeHoy } from '@/domain/turno'
import type { TipoTurnoId } from '@/domain/tipoTurno'
import { proximoNumero, ordenarPorNumero } from '@/domain/numeracion'
import { cargarTurnos, guardarTurnos } from '@/repositories/turnosRepository'

export const useTurnosStore = defineStore('turnos', () => {
  const turnos = ref<Turno[]>(cargarTurnos())

  const turnosOrdenados = computed(() => ordenarPorNumero(turnos.value))

  /**
   * Registra la solicitud asignándole el número correlativo del día. El número
   * se calcula acá y en ningún otro lugar, para que no puedan convivir dos
   * secuencias distintas.
   */
  function registrar(solicitud: SolicitudTurno & { tipo: TipoTurnoId }): Turno {
    const fecha = fechaDeHoy()

    const turno: Turno = {
      numero: proximoNumero(turnos.value, fecha),
      nombre: solicitud.nombre.trim(),
      apellido: solicitud.apellido.trim(),
      documento: solicitud.documento.trim(),
      tipo: solicitud.tipo,
      fecha,
    }

    turnos.value = [...turnos.value, turno]
    guardarTurnos(turnos.value)

    return turno
  }

  return { turnos, turnosOrdenados, registrar }
})
