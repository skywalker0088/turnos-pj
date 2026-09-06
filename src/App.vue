<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <p class="organismo">Defensoría del Chaco</p>
    <nav>
      <RouterLink to="/">Solicitar turno</RouterLink>
      <RouterLink to="/turnos">Turnos registrados</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  padding: 1.5rem 0 1rem;
  border-bottom: 1px solid var(--color-border);
}

.organismo {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-heading);
}

nav {
  display: flex;
  gap: 0.5rem;
}

nav a {
  padding: 0.35rem 0.75rem;
  border-radius: 0.35rem;
}

nav a.router-link-exact-active {
  background-color: var(--color-background-mute);
  color: var(--color-heading);
}

main {
  padding: 2rem 0;
}
</style>
