import React from 'react'
import styled from 'styled-components'

import { BodyLong, Label } from '@navikt/ds-react'

import { formaterDato } from '../../../utils/date'
import { capitalize } from '../../../utils/stringFormating'

import { Boble } from '../../../felleskomponenter/Boble'
import { Kolonne, Rad } from '../../../felleskomponenter/Flex'
import { Strek } from '../../../felleskomponenter/Strek'
import { BodyLongMedEllipsis } from '../../../felleskomponenter/TekstMedEllipsis'
import { TooltipWrapper } from '../../../felleskomponenter/TooltipWrapper'
import { HjelpemiddelArtikkel } from '../../../types/types.internal'
import { useSak } from '../../sakHook'
import { KolonneOppsett, KolonneTittel } from '../Høyrekolonne'
import { useHjelpemiddeloversikt } from './hjelpemiddeloversiktHook'

const HjelpemiddeloversiktContainer = styled.div`
  padding-top: 1rem;
`

const Artikkeloverskrift = styled(Label)`
  padding-top: 0.2rem;
`

const grupperPåKategori = (artikler: HjelpemiddelArtikkel[]) => {
  return artikler.reduce<Record<string, HjelpemiddelArtikkel[]>>((gruppe, artikkel) => {
    const { isoKategori, grunndataKategoriKortnavn } = artikkel

    const grupperingsNøkkel = grunndataKategoriKortnavn ? grunndataKategoriKortnavn : isoKategori

    if (!gruppe[grupperingsNøkkel]) {
      gruppe[grupperingsNøkkel] = []
    }
    gruppe[grupperingsNøkkel].push(artikkel)
    return gruppe
  }, {})
}

export const Hjelpemiddeloversikt: React.FC = () => {
  const { sak } = useSak()
  const { hjelpemiddelArtikler, isError, isLoading, isFromVedtak } = useHjelpemiddeloversikt(
    sak?.personinformasjon.fnr,
    sak?.vedtak?.vedtaksgrunnlag
  )

  if (isError) {
    return (
      <KolonneOppsett>
        <HjelpemiddeloversiktContainer>
          <BodyLong>Feil ved henting av brukers hjelpemiddeloversikt</BodyLong>
        </HjelpemiddeloversiktContainer>
      </KolonneOppsett>
    )
  }

  if (isLoading) {
    return (
      <KolonneOppsett>
        <HjelpemiddeloversiktContainer>
          <BodyLong>Henter brukers hjelpemiddeloversikt</BodyLong>
        </HjelpemiddeloversiktContainer>
      </KolonneOppsett>
    )
  }

  if (!hjelpemiddelArtikler || hjelpemiddelArtikler.length === 0) {
    return (
      <KolonneOppsett>
        <HjelpemiddeloversiktContainer>
          <BodyLong>Bruker har ingen hjelpemidler fra før</BodyLong>
        </HjelpemiddeloversiktContainer>
      </KolonneOppsett>
    )
  }

  const artiklerPrKategori = grupperPåKategori(hjelpemiddelArtikler)

  return (
    <KolonneOppsett>
      {isFromVedtak ? (
        <>
          <KolonneTittel>UTLÅNSOVERSIKT</KolonneTittel>
          <Rad>Per {formaterDato(sak?.vedtak.vedtaksdato)}, da vedtaket ble gjort </Rad>
        </>
      ) : (
        <>
          <KolonneTittel>UTLÅNSOVERSIKT</KolonneTittel>
        </>
      )}
      <HjelpemiddeloversiktContainer>
        {Object.keys(artiklerPrKategori)
          .sort()
          .map((kategori) => {
            return (
              <React.Fragment key={kategori}>
                <Artikkeloverskrift size="small">{kategori}</Artikkeloverskrift>
                <Artikler artikler={artiklerPrKategori[kategori]} />
                <Strek />
              </React.Fragment>
            )
          })}
      </HjelpemiddeloversiktContainer>
    </KolonneOppsett>
  )
}

interface ArtiklerProps {
  artikler: HjelpemiddelArtikkel[]
}

const Artikler: React.FC<ArtiklerProps> = ({ artikler }) => {
  return (
    <>
      {artikler.map((artikkel) => {
        const id = `${artikkel.hmsnr}${artikkel.datoUtsendelse}`
        const artikkelBeskrivelse = capitalize(artikkel.grunndataProduktNavn || artikkel.beskrivelse)
        return (
          <div key={id}>
            <Rad>
              <Kolonne width="85px">
                <BodyLong size="small">{formaterDato(artikkel.datoUtsendelse)}</BodyLong>
              </Kolonne>
              <Kolonne width="52px">
                <BodyLong size="small">{artikkel.hmsnr}</BodyLong>
              </Kolonne>
              <Kolonne width="230px" data-for={id} data-tip={artikkelBeskrivelse}>
                <TooltipWrapper visTooltip={artikkelBeskrivelse.length > 28} content={artikkelBeskrivelse}>
                  <BodyLongMedEllipsis size="small">{artikkelBeskrivelse}</BodyLongMedEllipsis>
                </TooltipWrapper>
              </Kolonne>
              <Kolonne width="50px" marginLeft="auto">
                <Boble>
                  <BodyLong size="small">{`${artikkel.antall} ${artikkel.antallEnhet.toLowerCase()}`}</BodyLong>
                </Boble>
              </Kolonne>
            </Rad>
          </div>
        )
      })}
    </>
  )
}
