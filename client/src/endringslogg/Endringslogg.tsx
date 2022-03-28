import { Ingress, Label } from '@navikt/ds-react'
import { Divider } from '@navikt/ds-react-internal'
import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components/macro'
import { ISO_DATOFORMAT } from '../utils/date'
import useOnScreen, { EndringsloggInnslag, MerkSomLestCallback } from './endringsloggHooks'

export const Endringslogg: React.VFC<{
  endringslogginnslag: ReadonlyArray<EndringsloggInnslag>
  merkSomLest: MerkSomLestCallback
}> = ({ endringslogginnslag, merkSomLest }) => {
  return (
    <>
      <Overskrift as="h2">Nytt i HOTSAK</Overskrift>
      <Liste>
        {endringslogginnslag.map((innslag) => (
          <Innslag key={innslag.id} innslag={innslag} merkSomLest={merkSomLest} />
        ))}
      </Liste>
    </>
  )
}

const Innslag: React.VFC<{ innslag: EndringsloggInnslag; merkSomLest: MerkSomLestCallback }> = ({
  innslag,
  merkSomLest,
}) => {
  const dato = dayjs(innslag.dato, ISO_DATOFORMAT).format('DD. MMMM YYYY')
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
    <>
      <dt>
        <Ulest fading={isFading}>{dato}</Ulest>
        <Label as="h3" spacing>
          {innslag.tittel}
        </Label>
      </dt>
      <dd ref={innslagRef}>
        <ReactMarkdown>{innslag.innhold}</ReactMarkdown>
        <Divider />
      </dd>
    </>
  )
}

const Overskrift = styled(Ingress)`
  margin: 0 !important;
  color: #fff;
  background-color: #000;
  padding: var(--navds-spacing-3) var(--navds-spacing-4);
  text-align: center;
`

const Liste = styled.dl`
  margin: var(--navds-spacing-3) var(--navds-spacing-6) !important;
`

const Ulest = styled.span<{ fading: boolean }>`
  position: relative;

  &:before {
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    left: -16px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: #ff9100;
    content: '';
    visibility: ${(props) => (props.fading ? 'hidden' : undefined)};
    opacity: ${(props) => (props.fading ? 0 : undefined)};
    transition: ${(props) => (props.fading ? 'visibility 0s 2s, opacity 2s linear' : undefined)};
  }
`
