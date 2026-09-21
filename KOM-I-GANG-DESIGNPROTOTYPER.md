# Kom i gang med AI-prototyper i Hotsak

Denne veilederen er for designere som vil prøve ut ny funksjonalitet i Hotsak med AI. Målet er å se og teste en idé i en fungerende nettside, i stedet for å lage en skisse i Figma.

Prototypene er midlertidige. Ikke merge dem til `main`, og ikke bruk dem som produksjonskode uten at en utvikler har gjennomgått løsningen.

## Dette trenger du

Installer følgende før du starter:

- [Visual Studio Code](https://code.visualstudio.com/) (VS Code), som du bruker til å åpne prosjektet og snakke med AI-en.
- [Git](https://git-scm.com/downloads) eller [GitHub Desktop](https://desktop.github.com/), som du bruker til å hente prosjektet og lagre endringene dine på GitHub.
- Node.js 24 eller nyere, som trengs for å kjøre Hotsak lokalt. Velg LTS-versjonen på [nodejs.org](https://nodejs.org/).

Du trenger tilgang til GitHub-repoet `navikt/hotsak-frontend`. Spør teamet hvis du ikke kan åpne repoet i nettleseren.

## Hent Hotsak til maskinen din

### Med GitHub Desktop

1. Åpne GitHub Desktop og logg inn med GitHub-kontoen din.
2. Velg **File** > **Clone repository**.
3. Velg `navikt/hotsak-frontend`, eller lim inn denne adressen: `https://github.com/navikt/hotsak-frontend.git`.
4. Velg hvor på maskinen prosjektet skal ligge, og velg **Clone**.
5. Velg **Open in Visual Studio Code** når GitHub Desktop tilbyr det.

### Med Git

Åpne Terminal og kjør:

```bash
git clone https://github.com/navikt/hotsak-frontend.git
cd hotsak-frontend
code .
```

Kommandoen `code .` åpner prosjektet i VS Code. Hvis den ikke virker, åpner du VS Code og velger **File** > **Open Folder**. Velg mappa `hotsak-frontend`.

## Lag din egen branch

En branch er ditt eget arbeidsområde i prosjektet. Endringene dine påvirker ikke andres arbeid før noen aktivt velger å merge dem. Gi branchen et kort navn som forklarer prototypen, for eksempel `prototype-ny-knapp`.

### I GitHub Desktop

1. Klikk på navnet på gjeldende branch øverst i vinduet.
2. Velg **New Branch**.
3. Skriv `prototype-ny-knapp`.
4. Velg **Create Branch**.

### I VS Code eller Terminal

Åpne terminalen i VS Code med **Terminal** > **New Terminal**, og kjør:

```bash
git switch -c prototype-ny-knapp
```

Bytt ut `ny-knapp` med navnet på ideen din. Bruk små bokstaver og bindestreker. Unngå mellomrom, æ, ø og å i branch-navnet.

## Sett opp Nav Pilot

[Nav Pilot](https://min-copilot.ansatt.nav.no/kom-i-gang) er Navs oppsett for AI-assistanse i utviklingsarbeid. Følg siden for å installere, logge inn og sette opp tilgangen du trenger. Siden krever innlogging på Nav-nettverket.

Åpne deretter prosjektet i VS Code. Nav Pilot kan lese prosjektets regler og hjelpe deg å finne fram, foreslå endringer og gjøre endringer i filer.

## Copilot, Nav Pilot og `cplt`

Disse navnene brukes ofte om ulike deler av samme arbeidsflyt:

| Navn           | Hva det er                                                          | Hva du bruker det til                                                         |
| -------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| GitHub Copilot | GitHubs AI-tjeneste i blant annet VS Code                           | Skrive spørsmål og få hjelp med kode                                          |
| Nav Pilot      | Navs tilpassede AI-assistent for utviklingsarbeid                   | Jobbe i Hotsak med Navs oppsett og prosjektregler                             |
| `cplt`         | Et verktøy som starter en AI-assistent i et beskyttet arbeidsområde | Kjøre Copilot fra terminalen uten at assistenten får fri tilgang til maskinen |

Etter at du har fulgt oppsettet på Nav Pilot-siden, åpner du en terminal i VS Code og skriver:

```bash
nav-pilot
```

`nv-pilot` starter den konfigurerte AI-assistenten, vanligvis GitHub Copilot CLI, i et beskyttet arbeidsområde. Følg valgene i Nav Pilot-oppsettet hvis du blir bedt om å velge assistent. Be alltid assistenten om å forklare hva den vil endre før den gjør endringen. Da er det lettere å kontrollere prototypen.

## Start Hotsak lokalt

I terminalen i VS Code, kjør:

```bash
cd client
pnpm install
pnpm run dev
```

Første gang kan dette ta litt tid. Terminalen viser en lokal adresse, ofte `http://localhost:3000`. Åpne adressen i nettleseren. Hotsak bruker testdata lokalt, så du trenger ikke et ekte fagsystem for å prøve ut en prototype.

Du kan også be Nav Pilot om hjelp: «Start Hotsak lokalt og fortell meg hvilken nettadresse jeg skal åpne. Ikke endre kode.»

## Skriv en prompt som designer

Du trenger ikke kjenne filnavn eller tekniske uttrykk. Beskriv hva personen som bruker Hotsak skal se, gjøre og forstå. Nevn hvor i løsningen du ser for deg endringen. Legg gjerne ved et skjermbilde eller lenke til den aktuelle sida.

En prompt blir tydeligere når den svarer på dette:

- Hvor i Hotsak endringen skal vises.
- Hvem som bruker den.
- Hva brukeren skal kunne gjøre.
- Hva som skal skje når brukeren gjør det.
- Hvordan den skal se ut, for eksempel plassering, tekst, størrelse eller tilstand.
- At det er en prototype som ikke skal mergees til `main`.

Be først om en kort plan. Be så om endringen. Du kan for eksempel skrive:

> Jeg lager en visuell prototype, ikke produksjonskode. Finn sida der saksbehandleren ser en oppgave. Foreslå hvilke filer du vil endre for å legge til en knapp. Forklar kort planen og vent på godkjenning før du endrer noe.

### Eksempel: Legg til en enkel knapp

Kopier og tilpass denne prompten:

> Jeg vil lage en visuell prototype i Hotsak. På sida der saksbehandleren ser detaljene i en oppgave, legg til en sekundær knapp med teksten «Se forslag». Plasser den ved siden av de andre handlingene. Når brukeren velger knappen, skal det vises en enkel melding på sida: «Her kommer forslag til neste steg». Bruk komponenter og stil som allerede finnes i Hotsak. Dette er bare en prototype. Forklar først hvilke filer du vil endre og hvorfor. Vent på at jeg sier ja før du gjør endringen.

Dette er nok informasjon for en første prototype. Nav Pilot kan finne riktig side og eksisterende knapper for deg.

## Se hva AI-en endret

VS Code viser endringene før du lagrer dem på GitHub:

1. Velg **Source Control** i venstremenyen. Ikonet ligner en gren med tre prikker.
2. Under **Changes** ser du filene som er endret.
3. Klikk på en fil. VS Code viser gammel tekst til venstre og ny tekst til høyre.
4. Se etter pluss- og minustegn. Grønt er lagt til, rødt er fjernet.
5. Spør Nav Pilot om noe er uklart: «Forklar denne endringen med vanlige ord. Hva vil brukeren se annerledes?»

Du kan angre en enkelt fil ved å høyreklikke på den i **Changes** og velge **Discard Changes**. Dette fjerner bare endringer som ikke er sjekket inn ennå.

## Iterer på prototypen

Se den lokale nettsida etter hver endring. Beskriv hva som ikke stemmer, eller hva du vil prøve videre. Du trenger ikke foreslå den tekniske løsningen.

Eksempler på videre prompts:

- «Knappen tar for mye oppmerksomhet. Gjør den mindre tydelig enn hovedhandlingen, men lett å finne.»
- «Vis meldingen rett under knappen i stedet for øverst på sida. Den skal forsvinne når brukeren velger knappen en gang til.»
- «Denne handlingen passer ikke på små skjermer. Vis hvordan den ser ut på mobilbredde og foreslå en enklere plassering.»
- «Bruk samme ordvalg og knappevariant som lignende handlinger på denne sida.»
- «Forklar hvilke tilstander denne prototypen bør ha: før brukeren velger knappen, etter valget og når det ikke finnes forslag.»
- «Ikke endre mer kode. Oppsummer hva prototypen gjør og hvilke filer som er endret.»

Gode prototyper kommer ofte etter flere små runder. Be om én konkret endring om gangen. Bruk ord fra brukeropplevelsen, som «før», «etter», «skal vises», «skal være skjult», «når saksbehandleren velger» og «på mobil». Legg ved skjermbilder når plassering eller visuelt uttrykk er viktig.

Unngå vage beskjeder som «gjør dette bedre». Si heller hva som virker feil: «Det er vanskelig å se hva jeg skal gjøre først, fordi begge knappene ser like viktige ut.»

## Sjekk inn og push endringene

Når du vil dele prototypen din, lagrer du endringene i en commit og pusher branchen til GitHub. En commit er et lagringspunkt med en kort beskrivelse.

### Med GitHub Desktop

1. Åpne GitHub Desktop. Endringene vises i venstrekolonnen.
2. Kryss av filene som hører til prototypen.
3. Skriv en kort beskrivelse nederst, for eksempel `Legger til prototype for forslag-knapp`.
4. Velg **Commit to prototype-ny-knapp**.
5. Velg **Push origin** øverst.

### Med VS Code

1. Åpne **Source Control**.
2. Se gjennom filene, og velg **Stage Changes** på filene du vil ta med.
3. Skriv en kort beskrivelse i meldingsfeltet.
4. Velg **Commit**.
5. Velg **Sync Changes** eller **Publish Branch**.

Etter push åpner du GitHub-repoet i nettleseren. Der ser du branchen din og commit-en du nettopp lagde. Ikke opprett en pull request til `main` for en ren prototype, med mindre teamet har avtalt det.

## Fra push til test på egen URL

Prototypeflyten er tenkt slik:

1. Du pusher endringene til din egen branch, for eksempel `prototype-ny-knapp`.
2. GitHub starter en GitHub Action for branchen.
3. Actionen bygger en egen versjon av Hotsak og deployer den til Nais.
4. Nais gjør prototypen tilgjengelig på en egen ingress, vanligvis med branch-navnet som del av adressen.
5. Du åpner URL-en, tester prototypen og deler den med andre.

Denne branch-workflowen og ingressen er ikke satt opp i repoet ennå. Den nåværende deploy-workflowen kjører bare for `main` og en bestemt feature-branch. Når teamet har lagt til en egen workflow for prototype-brancher, kan du finne status og URL under **Actions** i GitHub. Vent til workflowen er grønn før du tester URL-en.

Hvis du ikke ser en URL i GitHub Action, spør teamet som setter opp deployen hvilken URL-regel som gjelder for branch-navn. Ikke gjett en URL, siden Nais-ingressen må være konfigurert for den aktuelle branchen.
