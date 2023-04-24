import { rest } from 'msw'

import { StoreHandlersFactory } from '../data'

const endringslogg = [
  {
    id: '9',
    dato: '2022-12-05',
    tittel: 'Flere får tilgang til den digitale søknaden',
    innhold:
      '5\\. desember 2022 lanseres et nytt godkjenningskurs for bestillere på Kunnskapsbanken som alle som skal bestille\nhjelpemidler må ta. Samtidig åpner vi den digitale søknaden for ansatte i kommunen som ikke er "erfaren kommunal\nformidler". Personen som skal bestille må:\n\n* Ta godkjenningskurs for bestillingsordningen på kunnskapsbanken (nytt 5. desember 2022)\n* Registrere kurset hos NAV via ID-porten\n* Første gang kommunal bestiller sender inn en digital bestilling, må personen krysse av for at deres leder ønsker at de\n  skal være bestillere.\n\nAndre forutsetninger:\n\n* Kommunen de er ansatt i må være registrert som bruker av våre digitale løsninger. Fremgangsmåten står i punkt 2 i\n  fremgangsmåten på nav.no. Per 5. desember er det 341 kommuner.\n* Vi sjekker automatisk at vilkår for å kunne bruke bestilling er oppfylt. Dette er tidligere vedtak og/eller utlån til\n  innbygger.\n* Bestillerne vil kun få tilgang til å kunne bestille de hjelpemidler som ligger på bestillingslisten, og kun tilbehør\n  til hjelpemidler oppført i samme bestilling.\n* Bestiller kan kun bestille til innbygger i kommunen man er ansatt i.\n\nDet er ikke mulig å legge til fritekst for bestillerne i denne førsteversjonen av løsningen. De får derfor ikke opp valg\nfor å begrunne når de velger mer enn en av ett produkt, slik formidlerne får.\n',
    lest: null,
  },
  {
    id: '8',
    dato: '2022-10-03',
    tittel: 'Endre artikkelnummer på bestilling av hjelpemidler som ikke er på rammeavtale',
    innhold:
      'Det er nå mulig å endre artikkelnummer på hjelpemidler i en bestilling som ikke lenger ligger i hjelpemiddeldatabasen. Hvis artikkelnummeret ikke finnes i hjelpemiddeldatabasen, henter vi informasjon om hjelpemidlet fra OEBS.\n',
    lest: null,
  },
  {
    id: '7',
    dato: '2022-09-05',
    tittel: 'Endre artikkelnummer på en bestilling fra HOTSAK',
    innhold:
      'Det er nå mulig å endre artikkelnummer på en bestilling før ordren opprettes i OeBS. Dette har vi utviklet på bakgrunn av at en har behov for å tømme lager for tilsvarende hjelpemidler. Dette kan f.eks. være nødvendig på grunn av gjenbruk eller endringer i rammeavtaler der en har lagerbeholdning på forrige produkt. Foreløpig gjelder dette kun hovedhjelpemidler og ikke tilbehør. Det jobber vi med, og vil varsle når det er klart.\n',
    lest: '2022-09-05T22:52:39.329645Z',
  },
  {
    id: '6',
    dato: '2022-08-18',
    tittel: 'Ny funksjon i digital behovsmelding',
    innhold:
      'I dag har vi lansert en funksjon i digital behovsmelding der kommunal formidler må begrunne behovet for mer enn 1 stk. av et produkt. Begrunnelsen for behovet vil også være synlig i HOTSAK.\n',
    lest: '2022-08-18T11:51:31.500851Z',
  },
  {
    id: '5',
    dato: '2022-06-10',
    tittel: 'Flere saker inn i HOTSAK: Institusjon/sykehjem',
    innhold:
      'Vi har nå åpnet for at digitale søknader hvor formidler har krysset av for at innbygger bor på institusjon/sykehjem nå vil kunne rutes til HOTSAK. Det forutsetter at ikke andre kriterier vi holder utenfor trer inn (f.eks. søknad om lavere rangert hjelpemiddel).\n\nVi minner om at søknader i HOTSAK fortsatt må saksbehandles på lik linje som saker som går til Gosys/Infotrygd, da det ikke er noen begrensninger i digital søknad på hvilke artikler en kan søke på til bruk på institusjon. Vi gjør foreløpig ingen sjekk i HOTSAK på at innbygger faktisk bor på institusjon - opplysningen er hentet fra det formidler har oppgitt i søknaden.\n',
    lest: '2022-03-25T15:05:25.135916Z',
  },
  {
    id: '4',
    dato: '2022-05-30',
    tittel: 'Enkel kopiering av formidlers navn og telefonnummer',
    innhold:
      'Etter tilbakemeldinger har vi satt opp kopiering av formidlers navn og telefonnummer i venstrekolonnen (ikon) for å spare tastetrykk når dere skal ta denne informasjonen med videre.\n\nArtikkelnummer i hovedbildet vil nå vises i fet skrift (bold).\n',
    lest: '2022-03-25T15:05:25.084342Z',
  },
  {
    id: '3',
    dato: '2022-04-08',
    tittel: 'Første versjon av søkefunksjon og personoversikt',
    innhold:
      'Søket henter navn og telefonnummer fra Persondataløsningen i NAV (PDL).\nBrukernummer og utlånshistorikk hentes fra OEBS.\nSaker som viser på personoversikten hentes foreløpig kun fra HOTSAK.\nHvis bruker har kode 6, 7 eller er egen ansatt, får man melding om at du ikke har tilgang til å søke opp bruker. Da vises verken personlinja eller saks-/utlånsoversikten.\nDet er også lagt inn en sjekk mot brukers geografiske tilknytning slik at saksbehandler kun får lov til å slå opp brukere tilknyttet den sentralen saksbehandler jobber på.\n\n\nVi mangler foreløpig en validering på at man søker på gyldig fødselsnummer. Hvis man søker på noe som ikke er et fødselsnummer (f.eks. navn eller brukernummer), vil man få en melding om at bruker ikke finnes. Dette er noe som vi vil jobbe videre med.\nI tillegg til å søke opp en person med fødselsnummer, kan en også gå til personoversikten ved å klikke på navnet til personen i personlinja når man er inne på en sak.\n',
    lest: '2022-03-25T15:05:25.0401Z',
  },
  {
    id: '2',
    dato: '2022-04-05',
    tittel: 'Vi har fjernet varselet "Tilleggsinformasjon i søknaden"',
    innhold:
      'Vi har fjernet varselet "Tilleggsinformasjon i søknaden" som var markert med et oransje varsel og utropstegn under "Greit å vite"-informasjonen til venstre i saksbildet.\nEtter tidligere diskusjon med pilotsentralene ble vi enig om at det holder med den blå markeringen i margen foran fritekst/avkrysninger i hovedbildet der formidler har lagt til dette i søknaden.\nDette gjelder for nye søknader som kommer inn. Varselet under "Greit å vite" vil fortsatt vises på saker som er registrert før denne endringen.\n',
    lest: '2022-03-29T11:07:56.078417Z',
  },
  {
    id: '1',
    dato: '2022-04-05',
    tittel: 'Hotsak har fått endringslogg!',
    innhold:
      'Her vil du få varsler når vi gjør endringer i HOTSAK som vi ønsker å gjøre deg oppmerksom på. Når en har åpnet meldinger og de har vært synlig på skjermen i 5 sekunder, vil varselet forsvinne.\n',
    lest: '2022-03-29T11:07:56.345531Z',
  },
]

const endringsloggKopi: Array<{
  id: string
  dato: string
  tittel: string
  innhold: string
  lest?: string | null
}> = endringslogg.map((innslag) => ({
  ...innslag,
}))

export const endringsloggHandlers: StoreHandlersFactory = () => [
  rest.post<{ endringslogginnslagId: string }>('/api/endringslogg/leste', (req, res, ctx) => {
    const innslag = endringsloggKopi.find(({ id }) => id === req.body.endringslogginnslagId)
    if (innslag) {
      innslag.lest = new Date().toISOString()
    }
    return res(ctx.status(204))
  }),
  rest.get('/api/endringslogg', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(endringsloggKopi))
  }),
]
