import { generatePageNumbers } from './sidetall'

describe('genererer sidetall', () => {
  test('uten ellipser for korte tallrekker', () => {
    expect(generatePageNumbers(1, 1)).toEqual([1])
    expect(generatePageNumbers(1, 3)).toEqual([1, 2, 3])
    expect(generatePageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5])
    expect(generatePageNumbers(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })
  test('med ellipse på høyre side for lange tallrekker med lavt sidetall', () => {
    expect(generatePageNumbers(1, 10)).toEqual([1, 2, 3, 4, 5, 6, 7, '...', 10])
    expect(generatePageNumbers(1, 50)).toEqual([1, 2, 3, 4, 5, 6, 7, '...', 50])
    expect(generatePageNumbers(2, 50)).toEqual([1, 2, 3, 4, 5, 6, 7, '...', 50])
    expect(generatePageNumbers(3, 50)).toEqual([1, 2, 3, 4, 5, 6, 7, '...', 50])
    expect(generatePageNumbers(4, 50)).toEqual([1, 2, 3, 4, 5, 6, 7, '...', 50])
    expect(generatePageNumbers(5, 50)).toEqual([1, 2, 3, 4, 5, 6, 7, '...', 50])
  })
  test('med ellipse på begge sider for lange tallrekker med middels stort sidetall', () => {
    expect(generatePageNumbers(6, 50)).toEqual([1, '...', 4, 5, 6, 7, 8, '...', 50])
    expect(generatePageNumbers(7, 50)).toEqual([1, '...', 5, 6, 7, 8, 9, '...', 50])
    expect(generatePageNumbers(8, 50)).toEqual([1, '...', 6, 7, 8, 9, 10, '...', 50])
    expect(generatePageNumbers(9, 50)).toEqual([1, '...', 7, 8, 9, 10, 11, '...', 50])
    expect(generatePageNumbers(10, 50)).toEqual([1, '...', 8, 9, 10, 11, 12, '...', 50])
    expect(generatePageNumbers(25, 50)).toEqual([1, '...', 23, 24, 25, 26, 27, '...', 50])
    expect(generatePageNumbers(45, 50)).toEqual([1, '...', 43, 44, 45, 46, 47, '...', 50])
  })
  test('med ellipse på venstre side for lange rallrekker med stort sidetall', () => {
    expect(generatePageNumbers(46, 50)).toEqual([1, '...', 44, 45, 46, 47, 48, 49, 50])
    expect(generatePageNumbers(47, 50)).toEqual([1, '...', 44, 45, 46, 47, 48, 49, 50])
    expect(generatePageNumbers(48, 50)).toEqual([1, '...', 44, 45, 46, 47, 48, 49, 50])
    expect(generatePageNumbers(49, 50)).toEqual([1, '...', 44, 45, 46, 47, 48, 49, 50])
    expect(generatePageNumbers(50, 50)).toEqual([1, '...', 44, 45, 46, 47, 48, 49, 50])
  })
})
