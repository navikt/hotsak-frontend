import { useInnloggetAnsatt } from '../tilgang/useTilgang'
import { UMAMI_TAKSONOMI } from './umamiTaksonomi'

export function useUmami() {
  const { gjeldendeEnhet } = useInnloggetAnsatt()
  const enhetsnavn = gjeldendeEnhet.navn

  const logUmamiHendelse = (navn: UMAMI_TAKSONOMI, data: object) => {
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track(navn, {
        appnavn: 'hotsak',
        enhetsnavn,
        ...data,
      })
    }
  }

  const logKnappKlikket = (data: object) => {
    logUmamiHendelse(UMAMI_TAKSONOMI.KNAPP_KLIKKET, data)
  }

  const logSkjemaFullført = (data: object) => {
    logUmamiHendelse(UMAMI_TAKSONOMI.SKJEMA_FULLFØRT, data)
  }

  const logModalÅpnet = (data: object) => {
    logUmamiHendelse(UMAMI_TAKSONOMI.MODAL_ÅPNET, data)
  }

  return { logUmamiHendelse, logKnappKlikket, logSkjemaFullført, logModalÅpnet }
}
