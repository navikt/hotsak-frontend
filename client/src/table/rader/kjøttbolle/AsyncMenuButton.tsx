import styled from '@emotion/styled'
import React, { useState } from 'react'

import { Knapp, KnappBaseProps } from 'nav-frontend-knapper'

const Button = styled(Knapp)`
  all: unset;
  height: 30px;
  min-width: 180px;
  font-size: 1rem;
  white-space: nowrap;
  text-align: left;
  padding: 0.25rem 1rem;
  width: 100%;
  box-sizing: border-box;

  &:hover,
  &:focus {
    background: var(--speil-light-hover);
    color: var(--navds-primary-text);
    cursor: pointer;
  }

  &:disabled {
    &,
    &:hover {
      background-color: transparent;
      color: var(--navds-color-text-disabled);
    }
  }
`

interface AsyncMenuButtonProps extends KnappBaseProps {
  asyncOperation: () => Promise<any>
  onSuccess?: (result?: any) => void
  onFail?: (error: Error) => void
  swallorErrors?: boolean
}

export const AsyncMenuButton = ({
  children,
  asyncOperation,
  onSuccess,
  onFail,
  swallorErrors = true,
  ...rest
}: AsyncMenuButtonProps) => {
  const [isPerformingAsyncOperation, setIsPerformingAsyncOperation] = useState(false)

  const onClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsPerformingAsyncOperation(true)
    asyncOperation()
      .then((result) => {
        setIsPerformingAsyncOperation(false)
        onSuccess?.(result)
        return Promise.resolve(result)
      })
      .catch((error) => {
        onFail?.(error)
        return swallorErrors ? Promise.resolve() : Promise.reject(error)
      })
  }

  return (
    <Button spinner={isPerformingAsyncOperation} onClick={onClick} {...rest}>
      {children}
    </Button>
  )
}
