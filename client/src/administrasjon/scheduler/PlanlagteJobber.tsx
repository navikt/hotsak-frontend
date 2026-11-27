import { Button, Dialog, Heading, InlineMessage, Table, VStack } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { useSWRConfig } from 'swr'

import { Feilmelding } from '../../felleskomponenter/feil/Feilmelding.tsx'
import { HttpError } from '../../io/HttpError.ts'
import { AnsattGruppe } from '../../tilgang/Ansatt.ts'
import { useInnloggetAnsatt } from '../../tilgang/useTilgang.ts'
import { useMiljø } from '../../utils/useMiljø.ts'
import { type SchedulerJob, type SchedulerJobStatus } from './schedulerTyper.ts'
import { scheduleJobNow, schedulerHistoryUrl, useSchedulerHistory, useSchedulerJobs } from './useScheduler.ts'
import classes from './PlanlagteJobber.module.css'

const datoFormatter = new Intl.DateTimeFormat('nb-NO', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export default function PlanlagteJobber() {
  const { erIkkeProd } = useMiljø()
  const { erMedlemAvEnAvGrupper } = useInnloggetAnsatt()

  if (!erIkkeProd && !erMedlemAvEnAvGrupper(AnsattGruppe.TEAMDIGIHOT)) {
    return <Feilmelding status={403} />
  }

  return <PlanlagteJobberInnhold />
}

function PlanlagteJobberInnhold() {
  const { mutate: muterNøkkel } = useSWRConfig()
  const { data, error, isLoading, mutate } = useSchedulerJobs()
  const [valgtHistorikk, setValgtHistorikk] = useState<SchedulerJob | null>(null)
  const [jobbSomSkalKjøres, setJobbSomSkalKjøres] = useState<SchedulerJob | null>(null)
  const [handlingPågår, setHandlingPågår] = useState(false)
  const [handlingsfeil, setHandlingsfeil] = useState<string | null>(null)
  const [suksessmelding, setSuksessmelding] = useState<string | null>(null)
  const handlingLåst = useRef(false)
  const avbrytRef = useRef<HTMLButtonElement>(null)
  const historikk = useSchedulerHistory(valgtHistorikk?.name)
  const miljø = window.appSettings.NAIS_CLUSTER_NAME ?? 'Ukjent'

  async function oppdaterData() {
    const oppdateringer: Promise<unknown>[] = [mutate()]
    if (valgtHistorikk) {
      oppdateringer.push(muterNøkkel(schedulerHistoryUrl(valgtHistorikk.name)))
    }
    await Promise.allSettled(oppdateringer)
  }

  function åpneKjøringsbekreftelse(job: SchedulerJob) {
    setHandlingsfeil(null)
    setSuksessmelding(null)
    setJobbSomSkalKjøres(job)
  }

  async function bekreftKjøring() {
    if (!jobbSomSkalKjøres || handlingLåst.current) return

    handlingLåst.current = true
    setHandlingPågår(true)
    setHandlingsfeil(null)

    try {
      await scheduleJobNow(jobbSomSkalKjøres.name)
      setSuksessmelding('Jobben er planlagt for kjøring nå')
      setJobbSomSkalKjøres(null)
      void oppdaterData()
    } catch (ukjentFeil: unknown) {
      const feil = HttpError.wrap(ukjentFeil)
      const melding = meldingForKjøringsfeil(feil)
      setHandlingsfeil(melding)
      if (feil.status === 404 || feil.status === 409) {
        void oppdaterData()
      }
    } finally {
      handlingLåst.current = false
      setHandlingPågår(false)
    }
  }

  function oppdaterOversikt() {
    void mutate().catch(() => undefined)
  }

  function oppdaterHistorikk() {
    void historikk.mutate().catch(() => undefined)
  }

  const kjørbarJobb = jobbSomSkalKjøres?.status === 'WAITING'

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <Heading level="1" size="large">
          Planlagte jobber
        </Heading>
        <Button variant="secondary" onClick={oppdaterOversikt} loading={isLoading}>
          Oppdater
        </Button>
      </header>

      {suksessmelding && (
        <InlineMessage role="status" status="success">
          {suksessmelding}
        </InlineMessage>
      )}
      {error && (
        <InlineMessage role="alert" status="error">
          {meldingForHentefeil(error)}
        </InlineMessage>
      )}

      {isLoading && !data ? (
        <p role="status">Henter planlagte jobber …</p>
      ) : (
        data && (
          <div className={classes.tableScroll}>
            <Table size="small" className={classes.jobsTable}>
              <caption className={classes.tableCaption}>Oversikt over planlagte jobber</caption>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Neste kjøring</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Siste suksess</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Siste feil</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Feil på rad</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Handlinger</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.jobs.length === 0 ? (
                  <Table.Row>
                    <Table.DataCell colSpan={7}>Ingen planlagte jobber</Table.DataCell>
                  </Table.Row>
                ) : (
                  data.jobs.map((job) => (
                    <Table.Row key={job.name}>
                      <Table.HeaderCell scope="row">{job.name}</Table.HeaderCell>
                      <Table.DataCell>{statusTekst[job.status]}</Table.DataCell>
                      <Table.DataCell>{formaterTidspunkt(job.nextExecution)}</Table.DataCell>
                      <Table.DataCell>{formaterTidspunkt(job.lastSuccess)}</Table.DataCell>
                      <Table.DataCell>{formaterTidspunkt(job.lastFailure)}</Table.DataCell>
                      <Table.DataCell>{job.consecutiveFailures ?? 'Ukjent'}</Table.DataCell>
                      <Table.DataCell>
                        <VStack gap="space-8" align="start">
                          <Button
                            variant="tertiary"
                            size="small"
                            aria-label={`Vis historikk for ${job.name}`}
                            aria-pressed={valgtHistorikk?.name === job.name}
                            onClick={() => setValgtHistorikk(job)}
                          >
                            Vis historikk
                          </Button>
                          <Button
                            variant="tertiary"
                            size="small"
                            aria-label={`Kjør ${job.name} nå`}
                            disabled={job.status !== 'WAITING' || handlingPågår}
                            aria-haspopup="dialog"
                            onClick={() => åpneKjøringsbekreftelse(job)}
                          >
                            Kjør nå
                          </Button>
                        </VStack>
                      </Table.DataCell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table>
          </div>
        )
      )}

      {valgtHistorikk && (
        <section className={classes.history} aria-labelledby="scheduler-history-heading">
          <div className={classes.historyHeader}>
            <Heading level="2" size="medium" id="scheduler-history-heading">
              Historikk: {valgtHistorikk.name}
            </Heading>
            <Button variant="secondary" size="small" onClick={oppdaterHistorikk} loading={historikk.isLoading}>
              Oppdater historikk
            </Button>
          </div>
          <InlineMessage status="warning">
            Historikken viser de siste 100 kjøringene på poden som svarer. Kjøringer på andre pods vises ikke.
            Historikken nullstilles når poden starter på nytt.
          </InlineMessage>
          {historikk.error && (
            <InlineMessage role="alert" status="error">
              {meldingForHentefeil(historikk.error)}
              <Button variant="tertiary" size="small" onClick={oppdaterHistorikk}>
                Prøv igjen
              </Button>
            </InlineMessage>
          )}
          {historikk.isLoading && !historikk.data && <p role="status">Henter historikk …</p>}
          {historikk.data && (
            <>
              <p>
                Pod: <strong>{historikk.data.pod}</strong>
                <br />
                Pod startet: <Tidspunkt tidspunkt={historikk.data.startedAt} />
              </p>
              {historikk.data.entries.length === 0 ? (
                <p>Ingen historikk er registrert for denne jobben på poden.</p>
              ) : (
                <div className={classes.tableScroll}>
                  <Table size="small" className={classes.historyTable}>
                    <caption className={classes.tableCaption}>Kjøringshistorikk for {valgtHistorikk.name}</caption>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Startet</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Fullført</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Varighet (ms)</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Resultat</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {historikk.data.entries.map((entry, index) => (
                        <Table.Row key={`${entry.startedAt}-${index}`}>
                          <Table.HeaderCell scope="row">{entry.name}</Table.HeaderCell>
                          <Table.DataCell>{formaterTidspunkt(entry.startedAt)}</Table.DataCell>
                          <Table.DataCell>{formaterTidspunkt(entry.finishedAt)}</Table.DataCell>
                          <Table.DataCell>{entry.durationMillis}</Table.DataCell>
                          <Table.DataCell>{entry.result}</Table.DataCell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              )}
            </>
          )}
        </section>
      )}

      <Dialog
        open={jobbSomSkalKjøres !== null}
        onOpenChange={(åpen) => {
          if (!åpen && !handlingPågår) setJobbSomSkalKjøres(null)
        }}
      >
        <Dialog.Popup
          role="alertdialog"
          closeOnOutsideClick={false}
          initialFocusTo={avbrytRef}
          aria-label="Bekreft kjøring av jobb"
        >
          <Dialog.Header>
            <Dialog.Title>Kjør jobb nå?</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <p>
              Bekreft at jobben <strong>{jobbSomSkalKjøres?.name}</strong> skal kjøres i miljøet{' '}
              <strong>{miljø}</strong>.
            </p>
            {handlingsfeil && (
              <InlineMessage role="alert" status="error">
                {handlingsfeil}
              </InlineMessage>
            )}
          </Dialog.Body>
          <Dialog.Footer>
            <Button
              ref={avbrytRef}
              variant="secondary"
              disabled={handlingPågår}
              onClick={() => setJobbSomSkalKjøres(null)}
            >
              Avbryt
            </Button>
            <Button
              variant="primary"
              loading={handlingPågår}
              disabled={!kjørbarJobb || handlingPågår}
              onClick={bekreftKjøring}
            >
              Kjør nå
            </Button>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog>
    </div>
  )
}

function Tidspunkt({ tidspunkt }: { tidspunkt: string }) {
  return <time dateTime={tidspunkt}>{formaterTidspunkt(tidspunkt)}</time>
}

function formaterTidspunkt(tidspunkt: string | null): string {
  return tidspunkt ? datoFormatter.format(new Date(tidspunkt)) : 'Ingen'
}

function meldingForKjøringsfeil(error: HttpError): string {
  switch (error.status) {
    case 401:
      return 'Økten er utløpt. Logg inn på nytt før du prøver igjen.'
    case 403:
      return 'Kjøringen ble avvist fordi du ikke har tilgang.'
    case 404:
      return 'Jobben er ikke lenger planlagt. Oversikten oppdateres.'
    case 409:
      return 'Jobben kjører allerede. Oversikten oppdateres.'
    default:
      return 'Kunne ikke bekrefte at jobben ble planlagt. Oppdater status før du prøver igjen.'
  }
}

function meldingForHentefeil(error: HttpError): string {
  switch (error.status) {
    case 401:
      return 'Økten er utløpt. Logg inn på nytt for å hente data.'
    case 403:
      return 'Du har ikke tilgang til å hente disse dataene.'
    default:
      return 'Kunne ikke hente data. Prøv å oppdatere.'
  }
}

const statusTekst: Record<SchedulerJobStatus, string> = {
  WAITING: 'Venter',
  RUNNING: 'Kjører',
  NOT_SCHEDULED: 'Ikke planlagt',
}
