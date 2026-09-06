<script setup lang="ts">
import { ref, reactive } from 'vue'
import { TIPOS_TURNO, obtenerTipoTurno } from '@/domain/tipoTurno'
import type { TipoTurnoId } from '@/domain/tipoTurno'
import type { SolicitudTurno, Turno } from '@/domain/turno'
import { validarSolicitud, hayErrores } from '@/domain/validacion'
import type { ErroresSolicitud } from '@/domain/validacion'
import { useTurnosStore } from '@/stores/turnos'

const turnosStore = useTurnosStore()

const formulario = reactive<SolicitudTurno>({
  nombre: '',
  apellido: '',
  documento: '',
  tipo: '',
})

const errores = ref<ErroresSolicitud>({})
const turnoAsignado = ref<Turno | null>(null)

function enviar() {
  const erroresDetectados = validarSolicitud(formulario)
  errores.value = erroresDetectados

  if (hayErrores(erroresDetectados)) {
    turnoAsignado.value = null
    return
  }

  turnoAsignado.value = turnosStore.registrar({
    ...formulario,
    tipo: formulario.tipo as TipoTurnoId,
  })

  formulario.nombre = ''
  formulario.apellido = ''
  formulario.documento = ''
  formulario.tipo = ''
}
</script>

<template>
  <section class="solicitud">
    <h1>Solicitar turno</h1>

    <p
      v-if="turnoAsignado"
      class="confirmacion"
      role="status"
      :style="{
        borderColor: obtenerTipoTurno(turnoAsignado.tipo).color,
      }"
    >
      Turno asignado:
      <strong class="numero-asignado">{{ turnoAsignado.numero }}</strong>
      <span
        class="etiqueta-tipo"
        :style="{
          backgroundColor: obtenerTipoTurno(turnoAsignado.tipo).color,
          color: obtenerTipoTurno(turnoAsignado.tipo).colorTexto,
        }"
      >
        {{ obtenerTipoTurno(turnoAsignado.tipo).etiqueta }}
      </span>
    </p>

    <form novalidate @submit.prevent="enviar">
      <div class="campo">
        <label for="nombre">Nombre</label>
        <input id="nombre" v-model="formulario.nombre" type="text" autocomplete="given-name" />
        <span v-if="errores.nombre" class="error">{{ errores.nombre }}</span>
      </div>

      <div class="campo">
        <label for="apellido">Apellido</label>
        <input id="apellido" v-model="formulario.apellido" type="text" autocomplete="family-name" />
        <span v-if="errores.apellido" class="error">{{ errores.apellido }}</span>
      </div>

      <div class="campo">
        <label for="documento">Documento</label>
        <input id="documento" v-model="formulario.documento" type="text" inputmode="numeric" />
        <span v-if="errores.documento" class="error">{{ errores.documento }}</span>
      </div>

      <fieldset class="campo">
        <legend>Tipo de turno</legend>
        <label v-for="tipo in TIPOS_TURNO" :key="tipo.id" class="opcion-tipo">
          <input v-model="formulario.tipo" type="radio" name="tipo" :value="tipo.id" />
          <span class="muestra-color" :style="{ backgroundColor: tipo.color }" aria-hidden="true" />
          {{ tipo.etiqueta }}
        </label>
        <span v-if="errores.tipo" class="error">{{ errores.tipo }}</span>
      </fieldset>

      <button type="submit">Solicitar turno</button>
    </form>
  </section>
</template>

<style scoped>
.solicitud {
  max-width: 32rem;
}

form {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

.campo {
  display: grid;
  gap: 0.35rem;
}

fieldset.campo {
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem 1rem;
}

input[type='text'] {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 0.35rem;
  background-color: var(--color-background);
  color: var(--color-text);
  font: inherit;
}

.opcion-tipo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.2rem 0;
  cursor: pointer;
}

.muestra-color {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}

.error {
  color: #c62828;
  font-size: 0.875rem;
}

button {
  justify-self: start;
  padding: 0.55rem 1.25rem;
  border: 0;
  border-radius: 0.35rem;
  background-color: var(--color-text);
  color: var(--color-background);
  font: inherit;
  cursor: pointer;
}

.confirmacion {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border: 2px solid;
  border-radius: 0.5rem;
}

.numero-asignado {
  font-size: 1.5rem;
}

.etiqueta-tipo {
  padding: 0.15rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}
</style>
