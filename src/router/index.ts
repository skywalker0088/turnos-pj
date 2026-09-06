import { createRouter, createWebHistory } from 'vue-router'
import SolicitudTurnoView from '../views/SolicitudTurnoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'solicitud',
      component: SolicitudTurnoView,
    },
    {
      path: '/turnos',
      name: 'listado',
      component: () => import('../views/ListadoTurnosView.vue'),
    },
  ],
})

export default router
