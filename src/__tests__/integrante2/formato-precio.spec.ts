import { formatearPrecio } from '../../utils/formato'

describe('Integrante 2 - Test 3: Formateo de Precios (CLP)', () => {
  it('debe formatear valores numéricos enteros con separador de miles chileno ($699.990)', () => {
    expect(formatearPrecio(699990)).toBe('$699.990')
    expect(formatearPrecio(3299000)).toBe('$3.299.000')
    expect(formatearPrecio(17990)).toBe('$17.990')
    expect(formatearPrecio(990)).toBe('$990')
  })

  it('debe manejar correctamente el valor 0 retornando $0', () => {
    expect(formatearPrecio(0)).toBe('$0')
    expect(formatearPrecio('0')).toBe('$0')
  })

  it('debe aceptar números entregados como cadenas de texto', () => {
    expect(formatearPrecio('699990')).toBe('$699.990')
    expect(formatearPrecio('25000')).toBe('$25.000')
  })

  it('debe manejar valores decimales y redondeados según moneda local', () => {
    expect(formatearPrecio(Math.round(1500.8))).toBe('$1.501')
    expect(formatearPrecio(Math.round(1500.2))).toBe('$1.500')
    expect(formatearPrecio(1500.5)).toBe('$1.500,5')
  })

  it('debe retornar $0 para entradas no válidas, vacías o NaN', () => {
    expect(formatearPrecio('texto_invalido')).toBe('$0')
    expect(formatearPrecio(NaN)).toBe('$0')
    expect(formatearPrecio('')).toBe('$0')
  })
})
