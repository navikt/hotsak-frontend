import { UtsendingsInfo } from '../../../brev/brevTyper'

interface UtsendingsHendelse {
  id: string
  type: 'VARSEL_SENDT' | 'FYSISK_POST_SENDT' | 'DIGITAL_POST_SENDT'
  opprettet: string
  hendelse: string
  detaljer?: string
}

export function lagUtsendingsHendelser(utsendingsinfo: UtsendingsInfo, datoEkspedert: string): UtsendingsHendelse[] {
  const hendelser: UtsendingsHendelse[] = []

  if (utsendingsinfo.varselSendt) {
    utsendingsinfo.varselSendt.forEach((varsel, index) => {
      if (varsel.tidspunkt) {
        hendelser.push({
          id: `varsel-${index}`,
          type: 'VARSEL_SENDT',
          opprettet: varsel.tidspunkt,
          hendelse: `Varsel til bruker`,
          detaljer: `${varsel.type}: «${varsel.tittel}» sendt til ${varsel.adresse}`,
        })
      }
    })
  }

  if (utsendingsinfo.fysiskpostSendt) {
    hendelser.push({
      id: 'fysisk-post',
      type: 'FYSISK_POST_SENDT',
      opprettet: datoEkspedert,
      hendelse: `Vedtaksbrev sendt til bruker`,
      detaljer: `Brevet er sendt som fysisk post (sentral utskrift) til ${utsendingsinfo.fysiskpostSendt}`,
    })
  }

  if (utsendingsinfo.digitalpostSendt) {
    hendelser.push({
      id: 'digital-post',
      type: 'DIGITAL_POST_SENDT',
      opprettet: datoEkspedert,
      hendelse: `Vedtaksbrev sendt til bruker`,
      detaljer: `Brev sendt til digital postkasse`,
    })
  }

  return hendelser
}
