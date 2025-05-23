import { Fragment, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'

import { ActionMenu, Box, Heading } from '@navikt/ds-react'
import { EndringsloggInnslag, MerkSomLestCallback } from './useEndringslogg'
import { format } from 'date-fns'
import { useOnScreen } from './useOnScreen'

export function Endringslogg({
  endringslogginnslag,
  merkSomLest,
}: {
  endringslogginnslag: ReadonlyArray<EndringsloggInnslag>
  merkSomLest: MerkSomLestCallback
}) {
  return (
    <>
      <Box marginBlock="space-8" marginInline="space-16">
        <Heading level="2" size="small" spacing>
          Nytt i Hotsak
        </Heading>
      </Box>
      {endringslogginnslag.map((innslag, index) => (
        <Fragment key={innslag.id}>
          <Innslag innslag={innslag} merkSomLest={merkSomLest} />
          {index + 1 < endringslogginnslag.length && <ActionMenu.Divider />}
        </Fragment>
      ))}
    </>
  )
}

function Innslag({ innslag, merkSomLest }: { innslag: EndringsloggInnslag; merkSomLest: MerkSomLestCallback }) {
  const dato = format(innslag.dato, 'PPP')
  const ulest = !innslag.lest
  const timeoutRef = useRef<number | null>(null)
  const innslagRef = useRef<HTMLElement>(null)
  const isOnScreen = useOnScreen(innslagRef)
  const [isFading, setIsFading] = useState(!ulest)

  useEffect(() => {
    if (isOnScreen && ulest) {
      timeoutRef.current = window.setTimeout(() => {
        merkSomLest(innslag.id)
          .then(() => {
            setIsFading(true)
          })
          .catch((err) => {
            console.warn(err)
          })
      }, 5_000)
    }
  }, [isOnScreen, ulest, merkSomLest, innslag])

  useEffect(() => {
    if (!isOnScreen && timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [isOnScreen])

  return (
    <Box margin="space-16">
      <header ref={innslagRef}>
        <Ulest $fading={isFading}>{dato}</Ulest>
        <Heading level="3" size="xsmall" spacing>
          {innslag.tittel}
        </Heading>
      </header>
      <div>
        <ReactMarkdown
          components={{
            a: (props) => (
              <a href={props.href} target="_blank">
                {props.children}
              </a>
            ),
          }}
        >
          {innslag.innhold}
        </ReactMarkdown>
      </div>
    </Box>
  )
}

const Ulest = styled.span<{ $fading: boolean }>`
  position: relative;

  &:before {
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    left: -16px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: var(--a-icon-warning);
    content: '';
    visibility: ${(props) => (props.$fading ? 'hidden' : undefined)};
    opacity: ${(props) => (props.$fading ? 0 : undefined)};
    transition: ${(props) => (props.$fading ? 'visibility 0s 2s, opacity 2s linear' : undefined)};
  }
`
