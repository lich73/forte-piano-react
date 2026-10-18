import { validarRun, validarCorreo, validarPassword } from '../../utils/validaciones'

describe('Integrante 1 - Test 1: Utilidades de validación', () => {
  describe('validarRun()', () => {
    it('debe aceptar RUNs chilenos válidos con algoritmo módulo 11', () => {
      // Casos válidos reales del sistema (seed)
      expect(validarRun('123456785')).toBeTrue()
      expect(validarRun('987654325')).toBeTrue()
      expect(validarRun('112223339')).toBeTrue()
      expect(validarRun('201113334')).toBeTrue()
    })

    it('debe rechazar RUNs con dígito verificador incorrecto', () => {
      expect(validarRun('123456780')).toBeFalse()
      expect(validarRun('123456789')).toBeFalse()
    })

    it('debe rechazar RUNs con longitud inválida o caracteres no numéricos en el cuerpo', () => {
      expect(validarRun('')).toBeFalse()
      expect(validarRun('123')).toBeFalse()
      expect(validarRun('123456789012')).toBeFalse()
      expect(validarRun('ABCDEFGH5')).toBeFalse()
    })
  })

  describe('validarCorreo()', () => {
    it('debe aceptar correos con dominios permitidos (@duoc.cl, @profesor.duoc.cl, @gmail.com)', () => {
      expect(validarCorreo('alumno@duoc.cl')).toBeTrue()
      expect(validarCorreo('profesor@profesor.duoc.cl')).toBeTrue()
      expect(validarCorreo('usuario@gmail.com')).toBeTrue()
    })

    it('debe rechazar correos con otros dominios no permitidos', () => {
      expect(validarCorreo('usuario@hotmail.com')).toBeFalse()
      expect(validarCorreo('usuario@yahoo.com')).toBeFalse()
      expect(validarCorreo('usuario@outlook.com')).toBeFalse()
    })

    it('debe rechazar correos vacíos o que superen 100 caracteres', () => {
      expect(validarCorreo('')).toBeFalse()
      const correoLargo = `${'a'.repeat(95)}@gmail.com`
      expect(validarCorreo(correoLargo)).toBeFalse()
    })
  })

  describe('validarPassword()', () => {
    it('debe validar contraseñas de longitud entre 4 y 10 caracteres', () => {
      expect(validarPassword('1234')).toBeTrue()
      expect(validarPassword('admin123')).toBeTrue()
      expect(validarPassword('1234567890')).toBeTrue()
    })

    it('debe rechazar contraseñas con menos de 4 o más de 10 caracteres', () => {
      expect(validarPassword('123')).toBeFalse()
      expect(validarPassword('')).toBeFalse()
      expect(validarPassword('12345678901')).toBeFalse()
    })
  })
})
