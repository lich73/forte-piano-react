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
      // Caso donde resto = 10 -> K (ej: 11111112 -> 2*2+1*3+1*4+1*5+1*6+1*7+1*2+1*3 = 34; 34%11=1; 11-1=10 -> K)
      expect(calcularDigitoVerificador('11111112')).toBe('K')
      // Caso donde resto = 11 -> 0 (ej: 11111117 -> 7*2+3+4+5+6+7+2+3 = 44; 44%11=0; 11-0=11 -> 0)
      expect(calcularDigitoVerificador('11111117')).toBe('0')
    })

    it('debe aceptar RUNs chilenos válidos sin formato y con puntos/guión', () => {
      // Casos válidos reales del sistema (seed)
      expect(validarRun('123456785')).toBeTrue()
      expect(validarRun('12345678-5')).toBeTrue()
      expect(validarRun('12.345.678-5')).toBeTrue()
      expect(validarRun('987654325')).toBeTrue()
      expect(validarRun('112223339')).toBeTrue()
      expect(validarRun('201113334')).toBeTrue()
      expect(validarRun('11.111.112-K')).toBeTrue()
      expect(validarRun('11111112k')).toBeTrue()
      expect(validarRun('11.111.117-0')).toBeTrue()
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
