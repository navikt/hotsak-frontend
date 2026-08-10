import type { ISpørreundersøkelse } from './spørreundersøkelser'

export const journalføringsoppgave_barnebriller_overført_gosys_v1: ISpørreundersøkelse = {
  skjema: 'journalføringsoppgave_barnebriller_overført_gosys_v1',
  tittel: 'Vil du overføre oppgaven til Gosys?',
  beskrivelse: {
    header: 'Hva skjer med oppgaven hvis den overføres?',
    body: 'Hvis du overfører oppgaven til Gosys, vil den dukke opp som en vanlig journalføringsoppgave. Journalføring og videre saksbehandling må gjøres manuelt i Gosys og Infotrygd. Merk at det kan ta noen minutter før saken dukker opp i Gosys.',
  },
  spørsmål: [
    {
      type: 'enkeltvalg',
      tekst: 'Hvorfor overfører du oppgaven til Gosys?',
      beskrivelse: 'Årsaken du velger vil vises i Gosys. Eventuell fritekst vises ikke i Gosys, og brukes kun internt.',
      alternativer: [
        'Behandlingsbriller/linser ordinære vilkår',
        'Behandlingsbriller/linser særskilte vilkår',
        {
          type: 'oppfølgingsspørsmål',
          tekst: 'Annet',
          spørsmål: [
            {
              type: 'fritekst',
              tekst: 'Hva er grunnen til at du vil overføre oppgaven? Ikke skriv personopplysninger.',
              påkrevd: true,
            },
          ],
        },
      ],
      påkrevd: true,
    },
  ],
}
