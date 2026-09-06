/**
 * Node 26 expone un `localStorage` experimental que vale `undefined` si no se
 * arranca con `--localstorage-file`, y tapa al que provee jsdom. Se instala una
 * implementación en memoria para que los tests puedan usar el almacenamiento
 * del navegador sin depender de la versión de Node.
 */

function crearAlmacenamientoEnMemoria(): Storage {
  const datos = new Map<string, string>()

  return {
    get length() {
      return datos.size
    },
    clear() {
      datos.clear()
    },
    getItem(clave: string) {
      return datos.get(clave) ?? null
    },
    key(indice: number) {
      return Array.from(datos.keys())[indice] ?? null
    },
    removeItem(clave: string) {
      datos.delete(clave)
    },
    setItem(clave: string, valor: string) {
      datos.set(clave, String(valor))
    },
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: crearAlmacenamientoEnMemoria(),
  writable: true,
  configurable: true,
})
