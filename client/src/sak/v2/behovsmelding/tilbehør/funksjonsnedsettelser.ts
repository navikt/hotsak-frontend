import { Funksjonsbeskrivelse, InnbyggersVarigeFunksjonsnedsettelse } from '../../../../types/BehovsmeldingTypes'

export const tekstByFunksjonsnedsettelse = (brukerFunksjon: Funksjonsbeskrivelse) => {
  const tekst: Record<keyof typeof InnbyggersVarigeFunksjonsnedsettelse, string> = {
    [InnbyggersVarigeFunksjonsnedsettelse.ALDERDOMSSVEKKELSE]: 'Innbygger har alderdomssvekkelse.',
    [InnbyggersVarigeFunksjonsnedsettelse.ANNEN_VARIG_DIAGNOSE]: `Innbygger har en varig diagnose: ${brukerFunksjon.diagnose}`,
    [InnbyggersVarigeFunksjonsnedsettelse.ANNEN_DIAGNOSE]: `Innbygger har en diagnose: ${brukerFunksjon.diagnose}`,
    [InnbyggersVarigeFunksjonsnedsettelse.UAVKLART]:
      'Det er uavklart om innbygger har en varig sykdom, skade eller lyte.',
    [InnbyggersVarigeFunksjonsnedsettelse.UAVKLART_V2]:
      'Det er uavklart om personen har en sykdom, skade eller lyte som har ført til varig og vesentlig nedsatt funksjonsevne.',
  }
  return tekst[brukerFunksjon.innbyggersVarigeFunksjonsnedsettelse]
}
