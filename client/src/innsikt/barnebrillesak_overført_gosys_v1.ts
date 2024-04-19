import type { ISpørreundersøkelse } from './spørreundersøkelser'

export const barnebrillesak_overført_gosys_v1: ISpørreundersøkelse = {
  skjema: 'barnebrillesak_overført_gosys_v1',
  tittel: 'Vil du overføre saken til Gosys?',
  beskrivelse: {
    header: 'Hva skjer med saken hvis den overføres?',
    body: 'Hvis du overfører saken til Gosys, vil den dukke opp som en vanlig journalføringsoppgave. Journalføring og videre saksbehandling må gjøres manuelt i Gosys og Infotrygd. Merk at det kan ta noen minutter før saken dukker opp i Gosys.',
  },
  spørsmål: [
    {
      tekst: 'Hvorfor overfører du saken til Gosys?',
      beskrivelse: 'Brukes kun internt av teamet som utvikler Hotsak og vises ikke i Gosys.',
      type: 'enkeltvalg',
      svar: [
        'Behandlingsbriller/linser ordinære vilkår',
        'Behandlingsbriller/linser særskilte vilkår',
        {
          tekst: 'Annet',
          type: 'oppfølgingsspørsmål',
          spørsmål: {
            tekst: 'Gi en kort forklaring for hvorfor du ikke kan behandle saken. Unngå personopplysninger.',
            type: 'fritekst',
            påkrevd: true,
          },
        },
      ],
      påkrevd: true,
    },
  ],
}
