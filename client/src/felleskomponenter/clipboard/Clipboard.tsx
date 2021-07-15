import styled from '@emotion/styled'
//import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactChild, useEffect, useRef, useState } from 'react'

import { Normaltekst } from 'nav-frontend-typografi'

import { Flex } from '../Flex'
import { ClipboardIcon } from './icons/ClipboardIcon'
import { copyContentsToClipboard } from './util'

const Button = styled.button`
  position: relative;
  background: none;
  cursor: pointer;
  padding: 2px 4px 0;
  margin-left: 0.25rem;
  border: none;
  border-radius: 1px;

  &:hover {
    background: var(--navds-color-hover);
  }

  &:focus,
  &:active,
  &:hover {
    outline: none;
  }
`

const Popover = styled(Normaltekst)`
  position: absolute;
  padding: 6px 8px;
  border: 1px solid var(--navds-color-border);
  background: white;
  border-radius: 2px;
  white-space: nowrap;
  z-index: 1000;

  &:before {
    position: absolute;
    content: '';
    background: white;
    border-top: 1px solid var(--navds-color-border);
    border-left: 1px solid var(--navds-color-border);
    transform: rotate(45deg);
    height: 10px;
    width: 10px;
    top: -6px;
    left: 8px;
  }
`

const Container = styled(Flex)`
  position: relative;
`

interface Props {
  children: ReactChild
  copySource?: React.RefObject<HTMLElement>
  preserveWhitespace?: boolean
  copyMessage?: string
}

export const Clipboard = ({ children, copySource, preserveWhitespace = true, copyMessage }: Props) => {
  const [didCopy, setDidCopy] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const copy = async () => {
    if (!didCopy) {
      setDidCopy(
        copySource?.current
          ? await copyContentsToClipboard(copySource.current, preserveWhitespace)
          : await copyContentsToClipboard(contentRef?.current?.firstChild as HTMLElement, preserveWhitespace)
      )
    }
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout | null | number = null
    if (didCopy) {
      timeout = setTimeout(() => setDidCopy(false), 3000)
    }
    return () => {
      timeout && clearTimeout(timeout as NodeJS.Timeout)
    }
  }, [didCopy])

  return (
    <Container as="span" alignItems="center">
      <div ref={contentRef}>{children}</div>
      <Button onClick={copy}>
        <ClipboardIcon />
        {didCopy && <Popover>{copyMessage ?? 'Kopiert!'}</Popover>}
      </Button>
    </Container>
  )
}
