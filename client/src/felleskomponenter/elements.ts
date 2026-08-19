import { type ReactNode } from 'react'

export function joinElements(elements: ReactNode[], separator: ReactNode): ReactNode[] {
  return elements.flatMap((element, index) => (index === 0 ? [element] : [separator, element]))
}
