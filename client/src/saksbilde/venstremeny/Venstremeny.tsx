import type { ReactNode } from 'react'
import styled from 'styled-components'

import { headerHøydeRem } from '../../GlobalStyles'

export interface VenstremenyProps {
  width?: string
}

export function Venstremeny({ width, children }: { width?: string; children: ReactNode }) {
  return <Container width={width}>{children}</Container>
}

const Container = styled.aside<VenstremenyProps>`
  border-right: 1px solid var(--a-border-subtle);
  display: flex;
  flex-direction: column;
  height: calc(100% - ${headerHøydeRem});
  padding: var(--a-spacing-4) var(--a-spacing-6) var(--a-spacing-6);
`
