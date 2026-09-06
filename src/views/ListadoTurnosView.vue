<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { obtenerTipoTurno } from '@/domain/tipoTurno'
import { useTurnosStore } from '@/stores/turnos'

const turnosStore = useTurnosStore()
</script>

<template>
  <section class="listado">
    <h1>Turnos registrados</h1>

    <p v-if="turnosStore.turnosOrdenados.length === 0" class="vacio">
      Todavía no hay turnos registrados.
      <RouterLink to="/">Solicitar el primero</RouterLink>
    </p>

    <table v-else>
      <thead>
        <tr>
          <th scope="col">N°</th>
          <th scope="col">Nombre</th>
          <th scope="col">Apellido</th>
          <th scope="col">Documento</th>
          <th scope="col">Tipo</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="turno in turnosStore.turnosOrdenados"
          :key="turno.numero"
          :style="{ borderLeftColor: obtenerTipoTurno(turno.tipo).color }"
        >
          <td class="numero">{{ turno.numero }}</td>
          <td>{{ turno.nombre }}</td>
          <td>{{ turno.apellido }}</td>
          <td>{{ turno.documento }}</td>
          <td>
            <span
              class="etiqueta-tipo"
              :style="{
                backgroundColor: obtenerTipoTurno(turno.tipo).color,
                color: obtenerTipoTurno(turno.tipo).colorTexto,
              }"
            >
              {{ obtenerTipoTurno(turno.tipo).etiqueta }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
table {
  width: 100%;
  margin-top: 1.5rem;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

td {
  padding: 0.6rem 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

tbody tr {
  border-left: 6px solid transparent;
}

.numero {
  font-size: 1.15rem;
  font-weight: 700;
  padding-left: 0.75rem;
}

.etiqueta-tipo {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  white-space: nowrap;
}

.vacio {
  margin-top: 1.5rem;
}
</style>
