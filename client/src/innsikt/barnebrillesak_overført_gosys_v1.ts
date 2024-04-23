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
      type: 'enkeltvalg',
      tekst: 'Hvorfor overfører du saken til Gosys?',
      beskrivelse: 'Brukes kun internt av teamet som utvikler Hotsak og vises ikke i Gosys.',
      svar: [
        'Behandlingsbriller/linser ordinære vilkår',
        'Behandlingsbriller/linser særskilte vilkår',
        {
          type: 'oppfølgingsspørsmål',
          tekst: 'Annet',
          spørsmål: [
            {
              type: 'fritekst',
              tekst: 'Hva er grunnen til at du vil overføre saken? Ikke skriv personopplysninger.',
              påkrevd: true,
            },
          ],
        },
      ],
      påkrevd: true,
    },
  ],
}
