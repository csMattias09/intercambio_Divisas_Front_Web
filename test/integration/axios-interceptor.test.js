import MockAdapter from 'axios-mock-adapter'
import { describe, expect, it, vi } from 'vitest'
import iniciarAxios, { api } from '@/boot/axios'
import { getMonedas } from '@/services/monedas'

// Prueba de integracion del boot de Axios: el interceptor de respuesta, el servicio
// y el router trabajan juntos cuando el backend responde 401 en una ruta protegida.
describe('boot de axios', () => {
  it('ante un 401 en una ruta protegida limpia la sesion local y redirige al login', async () => {
    const router = { currentRoute: { value: { name: 'mercado' } }, push: vi.fn() }
    iniciarAxios({ app: { config: { globalProperties: {} } }, router })
    const http = new MockAdapter(api)
    http.onGet('/Moneda').reply(401)
    sessionStorage.setItem('xchang_token', 'token-vencido')

    await expect(getMonedas()).rejects.toMatchObject({ response: { status: 401 } })

    expect(router.push).toHaveBeenCalledWith({ name: 'login' })
    expect(sessionStorage.getItem('xchang_token')).toBeNull()
    http.restore()
  })
})
