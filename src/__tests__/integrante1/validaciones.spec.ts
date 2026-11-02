import {
  limpiarRun,
  calcularDigitoVerificador,
  formatearRun,
  validarRun,
  obtenerMensajeErrorRun,
  validarCorreo,
  validarPassword
} from '../../utils/validaciones'

describe('Integrante 1 - Test 1: Utilidades de validación', () => {
  describe('validarRun() y cálculo de dígito verificador', () => {
    it('debe calcular correctamente el dígito verificador módulo 11 (números, K y 0)', () => {
      expect(calcularDigitoVerificador('12345678')).toBe('5')
      expect(calcularDigitoVerificador('98765432')).toBe('5')
      expect(calcularDigitoVerificador('11222333')).toBe('9')
      expect(calcularDigitoVerificador('20111333')).toBe('4')
      expect(calcularDigitoVerificador('76543210')).toBe('3')
      expect(calcularDigitoVerificador('11111112')).toBe('K')
      expect(calcularDigitoVerificador('11111117')).toBe('0')
    })

    it('debe aceptar RUNs chilenos válidos sin formato y con puntos/guión', () => {
      expect(validarRun('123456785')).toBeTrue()
      expect(validarRun('12345678-5')).toBeTrue()
      expect(validarRun('12.345.678-5')).toBeTrue()
      expect(validarRun('987654325')).toBeTrue()
      expect(validarRun('112223339')).toBeTrue()
      expect(validarRun('201113334')).toBeTrue()
      expect(validarRun('11.111.112-K')).toBeTrue()
      expect(validarRun('11111112k')).toBeTrue()
      expect(validarRun('11.111.117-0')).toBeTrue()
      expect(validarRun('9.876.543-3')).toBeTrue()
    })

    it('debe rechazar RUNs sin dígito verificador (cuerpo de 7 u 8 dígitos sin DV)', () => {
      expect(validarRun('12345678')).toBeFalse()
      expect(validarRun('12345674')).toBeFalse()
      expect(validarRun('12.345.678')).toBeFalse()
      expect(validarRun('12.345.674')).toBeFalse()
      expect(validarRun('12345678-')).toBeFalse()
      expect(validarRun('9876543')).toBeFalse()
      expect(obtenerMensajeErrorRun('12345678')).toContain('Falta el dígito verificador')
      expect(obtenerMensajeErrorRun('12345678')).toContain('-5')
    })

    it('debe rechazar RUNs con dígito verificador incorrecto e informar el DV correcto', () => {
      expect(validarRun('123456780')).toBeFalse()
      expect(validarRun('123456789')).toBeFalse()
      expect(validarRun('12.345.678-K')).toBeFalse()
      expect(validarRun('76.543.210-K')).toBeFalse()
      expect(obtenerMensajeErrorRun('123456780')).toContain('-5')
    })

    it('debe rechazar RUNs con longitud inválida o caracteres no numéricos en el cuerpo', () => {
      expect(validarRun('')).toBeFalse()
      expect(validarRun('123')).toBeFalse()
      expect(validarRun('123456789012')).toBeFalse()
      expect(validarRun('ABCDEFGH5')).toBeFalse()
      expect(validarRun('12-3456785')).toBeFalse()
    })

    it('debe limpiar y formatear correctamente un RUN', () => {
      expect(limpiarRun('12.345.678-k')).toBe('12345678K')
      expect(formatearRun('123456785')).toBe('12.345.678-5')
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
