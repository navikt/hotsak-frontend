import { ChevronDownIcon } from '@navikt/aksel-icons'
import { HStack } from '@navikt/ds-react'
import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'

type Props = {
  title: string
  children: React.ReactNode
  //className?: string
  open?: boolean
  spacing?: boolean
}

const ShowMore = ({ title, children, /*, className,*/ open /*, spacing*/ }: Props) => {
  const detailsRef = React.useRef<HTMLDetailsElement>(null)

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && detailsRef.current) {
      detailsRef.current.open = false // Close the details element
    }
  }, [])

  useEffect(() => {
    const currentDetailsRef = detailsRef.current
    if (currentDetailsRef) {
      currentDetailsRef.addEventListener('keyup', handleKeyUp)
    }
    return () => {
      if (currentDetailsRef) {
        currentDetailsRef.removeEventListener('keyup', handleKeyUp)
      }
    }
  }, [handleKeyUp])

  return (
    <PostionDiv open={open} /*className={classNames(className, { spacing })}*/ ref={detailsRef}>
      <HStack as="summary" justify="space-between">
        {title}
        <div className="chevron-wrapper">
          <ChevronDownIcon fontSize="1.7rem" aria-hidden />
        </div>
      </HStack>
      <DropdownContainer>{children}</DropdownContainer>
    </PostionDiv>
  )
}

const PostionDiv = styled.details`
  height: fit-content;
  position: relative;
`

const DropdownContainer = styled.div`
  border: 1px solid var(--a-border-divider);
  top: 48px;
  border-top: none;
  border-radius: 0 0 4px 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: absolute;
  left: 0;
  background-color: white;
  width: 100%;
  z-index: 4;
  padding: 10px;
  padding-top: var(--a-spacing-4);
  padding-bottom: var(--a-spacing-6);
`

export default ShowMore
