import MockAdapter from 'axios-mock-adapter'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import iniciarAxios, { api } from '@/boot/axios'
import { useAuthStore } from '@/stores/auth'
import { useBilleteraStore } from '@/stores/billetera'
import { normalizarMensajeError } from '@/utils/validaciones'

vi.mock('quasar', () => ({ Dark: { set: vi.fn() } }))

// Pruebas de integracion: store de Pinia + servicio + instancia real de Axios.
// Solo se simula la respuesta HTTP del backend (axios-mock-adapter).
describe('stores conectados a la API', () => {
  let http

  const respuestaLogin = {
    token: 'token-de-prueba',
    expira: '2026-12-31T00:00:00Z',
    usuario: {
      usuarioId: 1,
      nombreUsuario: 'angel',
      rol: 'Usuario',
      temaVisual: 'Claro',
      estado: 'Activo',
    },
  }

  beforeAll(() => {
    // Registra los interceptores reales (header Authorization y manejo de 401)
    iniciarAxios({
      app: { config: { globalProperties: {} } },
      router: { currentRoute: { value: { name: 'mercado' } }, push: vi.fn() },
    })
  })

  beforeEach(() => {
    setActivePinia(createPinia())
    sessionStorage.clear()
    localStorage.clear()
    http = new MockAdapter(api)
  })

  afterEach(() => {
    http.restore()
  })

  it('login guarda el token y el usuario en el store y en sessionStorage', async () => {
    http.onPost('/auth/login').reply(200, respuestaLogin)
    const auth = useAuthStore()

    await auth.login({ identificadorAcceso: 'angel', password: 'ClaveSegura123' })

    expect(JSON.parse(http.history.post[0].data)).toEqual({
      identificadorAcceso: 'angel',
      password: 'ClaveSegura123',
    })
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.temaVisual).toBe('Claro')
    expect(sessionStorage.getItem('xchang_token')).toBe('token-de-prueba')
  })

  it('login rechazado (401) no guarda sesion y el mensaje se muestra como credenciales invalidas', async () => {
    http.onPost('/auth/login').reply(401, { mensaje: 'Credenciales inválidas' })
    const auth = useAuthStore()

    const error = await auth.login({ identificadorAcceso: 'angel', password: 'mala' }).catch((e) => e)

    expect(error.response.status).toBe(401)
    expect(normalizarMensajeError(error)).toBe('Credenciales inválidas')
    expect(auth.isAuthenticated).toBe(false)
    expect(sessionStorage.getItem('xchang_token')).toBeNull()
  })

  it('logout avisa al backend y limpia la sesion y la billetera', async () => {
    http.onPost('/auth/login').reply(200, respuestaLogin)
    http.onPost('/auth/logout').reply(204)
    const auth = useAuthStore()
    const billetera = useBilleteraStore()
    await auth.login({ identificadorAcceso: 'angel', password: 'ClaveSegura123' })
    billetera.saldos = [{ codigoISO: 'PEN', saldoDisponible: 100 }]

    await auth.logout()

    const peticionLogout = http.history.post.find((p) => p.url === '/auth/logout')
    expect(peticionLogout.headers.Authorization).toBe('Bearer token-de-prueba')
    expect(JSON.parse(peticionLogout.data)).toEqual({ token: 'token-de-prueba' })
    expect(auth.isAuthenticated).toBe(false)
    expect(sessionStorage.getItem('xchang_token')).toBeNull()
    expect(billetera.saldos).toEqual([])
  })

  it('la billetera carga los saldos desde GET /Billetera', async () => {
    const saldos = [
      { monedaId: 2, codigoISO: 'PEN', nombre: 'Sol peruano', saldoDisponible: 150 },
      { monedaId: 1, codigoISO: 'USD', nombre: 'Dolar', saldoDisponible: 0 },
    ]
    http.onGet('/Billetera').reply(200, { saldos })
    const billetera = useBilleteraStore()

    await billetera.cargar()

    expect(billetera.saldos).toEqual(saldos)
    expect(billetera.cargado).toBe(true)
    expect(billetera.cargando).toBe(false)
  })
})
