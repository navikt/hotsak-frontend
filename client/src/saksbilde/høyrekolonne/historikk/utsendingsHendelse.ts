import { UtsendingsInfo } from '../../../brev/brevTyper'

enum UtsendingsHendelseType {
  VARSEL_SENDT = 'VARSEL_SENDT',
  FYSISK_POST_SENDT = 'FYSISK_POST_SENDT',
  DIGITAL_POST_SENDT = 'DIGITAL_POST_SENDT',
}

interface UtsendingsHendelse {
  id: string
  type: UtsendingsHendelseType
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
          type: UtsendingsHendelseType.VARSEL_SENDT,
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
      type: UtsendingsHendelseType.FYSISK_POST_SENDT,
      opprettet: datoEkspedert,
      hendelse: `Vedtaksbrev sendt til bruker`,
      detaljer: `Brevet er sendt som fysisk post (sentral utskrift) til ${utsendingsinfo.fysiskpostSendt}`,
    })
  }

  if (utsendingsinfo.digitalpostSendt) {
    hendelser.push({
      id: 'digital-post',
      type: UtsendingsHendelseType.DIGITAL_POST_SENDT,
      opprettet: datoEkspedert,
      hendelse: `Vedtaksbrev sendt til bruker`,
      detaljer: `Brev sendt til digital postkasse`,
    })
  }

  return hendelser
}
