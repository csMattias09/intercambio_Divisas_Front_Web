import { api } from '@/boot/axios'

export function login(payload) {
  return api.post('/auth/login', payload)
}

export function register(payload) {
  return api.post('/auth/register', payload)
}

export function logout(token = sessionStorage.getItem('xchang_token')) {
  return api.post('/auth/logout', { token })
}

export function refresh(token) {
  return api.post('/auth/refresh', { token })
}

export function getMe() {
  return api.get('/auth/me')
}

export function getMenu() {
  return api.get('/auth/menu')
}

export function forgotPassword(payload) {
  return api.post('/auth/forgot-password', payload)
}

export function resetPassword(payload) {
  return api.post('/auth/reset-password', payload)
}

export function verificarCorreo(payload) {
  return api.post('/auth/verificar-correo', payload)
}

export function reenviarVerificacion(payload) {
  return api.post('/auth/reenviar-verificacion', payload)
}
