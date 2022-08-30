import { createGlobalStyle } from 'styled-components'

export const hotsakTotalMinWidth = '1200px'
export const hotsaktVenstremenyWidth = '340px'
export const hotsakHistorikkWidth = '492px'

export const AppRoot = createGlobalStyle`
  body {
    font-family: 'Source Sans Pro', Helvetica, sans-serif;
    font-size: 1rem;
  }

  /* https://github.com/facebook/create-react-app/issues/11773 Løsning herfra på grunn av problemer med react scripts */
  iframe {
    pointer-events: none;
  }
`
