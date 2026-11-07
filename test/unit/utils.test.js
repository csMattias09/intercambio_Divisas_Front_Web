import { describe, expect, it } from 'vitest'
import {
  normalizarMensajeError,
  validarCorreo,
  validarMonto,
  validarPassword,
} from '@/utils/validaciones'
import { urlBandera } from '@/utils/monedaBandera'

// Pruebas unitarias: funciones puras, sin red ni estado compartido.
describe('utilidades del frontend', () => {
  it('validarCorreo acepta un correo valido y rechaza formatos incorrectos', () => {
    expect(validarCorreo('mattias@ue.edu.pe')).toBe(true)
    expect(validarCorreo('sin-arroba.com')).toBe('Correo inválido')
    expect(validarCorreo('a@b')).toBe('Mínimo 5 caracteres')
  })

  it('validarPassword exige mayuscula, numero y caracter especial cuando se pide complejidad', () => {
    expect(validarPassword('corta')).toBe('Mínimo 8 caracteres')
    expect(validarPassword('solominusculas', { exigirComplejidad: true })).toBe(
      'La contraseña debe contener una mayúscula, un número y un carácter especial',
    )
    expect(validarPassword('Segura123!', { exigirComplejidad: true })).toBe(true)
  })

  it('validarMonto rechaza vacios, negativos y montos sobre el maximo', () => {
    expect(validarMonto('')).toBe('Monto inválido')
    expect(validarMonto(-5)).toBe('El monto debe ser mayor a 0')
    expect(validarMonto(1_000_001)).toBe('Monto máximo excedido')
    expect(validarMonto('250.50')).toBe(true)
  })

  it('normalizarMensajeError traduce los mensajes del backend a textos para el usuario', () => {
    const error401 = { response: { data: { mensaje: 'Credenciales inválidas' } } }
    expect(normalizarMensajeError(error401)).toBe('Credenciales inválidas')
    expect(normalizarMensajeError({ response: { data: { mensaje: 'Saldo no disponible' } } })).toBe(
      'Saldo insuficiente',
    )
    expect(normalizarMensajeError({}, 'Error genérico')).toBe('Error genérico')
  })

  it('urlBandera devuelve la bandera del pais de la moneda o null si no existe', () => {
    expect(urlBandera('pen')).toBe('https://flagcdn.com/w40/pe.png')
    expect(urlBandera('USD', 80)).toBe('https://flagcdn.com/w80/us.png')
    expect(urlBandera('XXX')).toBeNull()
  })
})
