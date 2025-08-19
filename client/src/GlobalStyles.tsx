import { createGlobalStyle } from 'styled-components'

export const hotsakTotalMinWidth = '1200px'
export const hotsakVenstremenyWidth = '340px'
export const hotsakRegistrerSøknadKolonne = '420px'
export const søknadsbildeHovedinnholdMaxWidth = '600px'
export const hovedInnholdMaxWidth = '1108px'
export const hotsakRegistrerSøknadHøyreKolonne = '300px'
// På sikt kan vi fjerne denne, må lande på hvordan vi skal gjøre det høyrekolonnen for barnebriller først
export const hotsakHistorikkMinWidth = '492px'
export const sidebarMinWidth = '350px'
export const hotsakHistorikkMaxWidth = '700px'
export const hotsakBarnebrilleHistorikkMaxWidth = '600px'
export const headerHøydeRem = '3'

export const headerHøyde = '48px'
export const personlinjeHøyde = headerHøyde
export const søknadslinjeHøyde = headerHøyde

export const textcontainerBredde = '38em'

export const AppRoot = createGlobalStyle`
 body {
    font-family: 'Source Sans Pro', Helvetica, sans-serif;
    font-size: 1rem;
   // color: var(--a-text-default)
  }
`
