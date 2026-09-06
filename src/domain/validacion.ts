import type { SolicitudTurno } from './turno'
import { esTipoTurnoId } from './tipoTurno'

export interface ErroresSolicitud {
  nombre?: string
  apellido?: string
  documento?: string
  tipo?: string
}

const DOCUMENTO_VALIDO = /^\d{6,10}$/

export function validarSolicitud(solicitud: SolicitudTurno): ErroresSolicitud {
  const errores: ErroresSolicitud = {}

  if (solicitud.nombre.trim() === '') {
    errores.nombre = 'Ingresá el nombre.'
  }

  if (solicitud.apellido.trim() === '') {
    errores.apellido = 'Ingresá el apellido.'
  }

  const documento = solicitud.documento.trim()
  if (documento === '') {
    errores.documento = 'Ingresá el documento.'
  } else if (!DOCUMENTO_VALIDO.test(documento)) {
    errores.documento = 'El documento debe tener entre 6 y 10 dígitos, sin letras ni puntos.'
  }

  if (!esTipoTurnoId(solicitud.tipo)) {
    errores.tipo = 'Elegí un tipo de turno.'
  }

  return errores
}

export function hayErrores(errores: ErroresSolicitud): boolean {
  return Object.keys(errores).length > 0
}
