import { defineBoot } from '#q-app'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.API_URL,
})

export default defineBoot(({ app, router }) => {
  api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('xchang_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const isAuthRoute = ['/auth/login', '/auth/register', '/auth/refresh'].some((path) =>
        error.config?.url?.includes(path),
      )

      if (error.response?.status === 401 && !isAuthRoute) {
        sessionStorage.removeItem('xchang_token')
        sessionStorage.removeItem('xchang_user')
        if (router.currentRoute.value.name !== 'login') {
          router.push({ name: 'login' })
        }
      }

      return Promise.reject(error)
    },
  )

  app.config.globalProperties.$api = api
})

export { api }
