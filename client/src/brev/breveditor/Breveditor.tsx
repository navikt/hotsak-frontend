import {
  BoldPlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  H4Plugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@platejs/basic-nodes/react'
import { ListPlugin } from '@platejs/list-classic/react'
import { MarkdownPlugin, remarkMdx } from '@platejs/markdown'
import { KEYS } from 'platejs'
import { Plate, PlateContainer, PlateContent, usePlateEditor } from 'platejs/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePerson } from '../../personoversikt/usePerson.ts'
import { useBehovsmelding } from '../../saksbilde/useBehovsmelding.ts'
import { type Behovsmelding } from '../../types/BehovsmeldingTypes.ts'
import { formaterDatoLang } from '../../utils/dato.ts'
import { formaterNavn } from '../../utils/formater.ts'
import { useBrevContext } from '../BrevContext.ts'
import { Mottakertype, type Målform } from '../brevTyper.ts'
import { useBrevmottakere } from '../useBrev.ts'
import { useSerienummer } from '../useSerienummer.ts'
import './Breveditor.less'
import { BreveditorContext } from './BreveditorContext.ts'
import { type BreveditorState } from './breveditorTyper.ts'
import { useBeforeUnload } from './hooks.ts'
import { byggFullHtml, hentMålformTekster, type StilarkVersjon } from './html/byggDokument.ts'
import { FlytendeLinkVerktøylinjeKit } from './plugins/flytende-link-verktøylinje/FlytendeLinkVerktøylinjeKit.tsx'
import {
  EMPTY_CHAR,
  SpesiellePlaceholdere,
  type PlaceholderSpesielleVerdier,
} from './plugins/placeholder/parseTekstMedPlaceholders.ts'
import { ELEMENT_PLACEHOLDER, type PlaceholderElement } from './plugins/placeholder/PlaceholderElement.ts'
import { PlaceholderErrorSummary } from './plugins/placeholder/PlaceholderErrorSummary/PlaceholderErrorSummary.tsx'
import { PlaceholderPlugin } from './plugins/placeholder/PlaceholderPlugin'
import { TabSyncPlugin } from './plugins/tab-sync/TabSyncPlugin.tsx'
import { transformerPlaceholders } from './transformerPlaceholders.ts'
import { useEditorScale } from './useEditorScale.ts'
import { useLagreBrev } from './useLagreBrev.ts'
import { Verktøylinje } from './verktøylinje/Verktøylinje.tsx'

export interface Metadata {
  brukersNavn: string
  brukersFødselsnummer: string
  saksnummer: number
  brevOpprettet: string
  saksbehandlerNavn: string
  attestantsNavn?: string
  hjelpemiddelsentral: string
}

export interface BreveditorProps {
  brevId?: string
  metadata: Metadata
  templateMarkdown?: string
  initialState?: BreveditorState
  initialSerienummer?: number
  stilarkVersjon: StilarkVersjon
  målform?: Målform
  onStateChange?(newState: BreveditorState): void
  onLagreBrev?(newState: BreveditorState, serienummer: number): Promise<void>
  placeholder?: string
  spesiellePlaceholderVerdier?: PlaceholderSpesielleVerdier
  formidlerErMottaker?: boolean
}

const EMPTY_CHAR_REGEX = new RegExp(EMPTY_CHAR, 'g')

function hentSynligTekst(text: string): string {
  return text.replace(EMPTY_CHAR_REGEX, '')
}

export function Breveditor(props: BreveditorProps) {
  const {
    brevId,
    metadata,
    templateMarkdown,
    initialState,
    initialSerienummer,
    stilarkVersjon,
    målform,
    onStateChange,
    onLagreBrev,
    placeholder,
    spesiellePlaceholderVerdier,
    formidlerErMottaker = false,
  } = props
  const { datoSoknadMottatt, hjelpemidlerSøktOm, flushLagringRef } = useBrevContext()
  const { personInfo, isLoading: personLaster } = usePerson(metadata.brukersFødselsnummer)
  const { data, isLoading: mottakereLaster } = useBrevmottakere(brevId)
  const formidlerMedKopi = data?.brevmottakere.find((mottaker) => mottaker.mottakertype === Mottakertype.FORMIDLER)
  const { personInfo: formidler, isLoading: formidlerLaster } = usePerson(formidlerMedKopi?.fnr)
  const { behovsmelding } = useBehovsmelding<Behovsmelding>()
  const formidlerNavn = formidler ? formaterNavn(formidler.navn) : (formidlerMedKopi?.navn ?? '')
  const formidlerStilling = behovsmelding?.isDigitalBehovsmelding
    ? (behovsmelding.levering.hjelpemiddelformidler.stilling ?? '')
    : undefined

  const spesielleVerdier: PlaceholderSpesielleVerdier = {
    auto_dato_soknad_mottatt: datoSoknadMottatt
      ? new Date(datoSoknadMottatt).toLocaleDateString('no-NB', { day: '2-digit', month: 'long', year: 'numeric' })
      : undefined,
    auto_bruker_navn: metadata.brukersNavn,
    auto_dato_soknad_innsendt: behovsmelding?.innsendingsdato
      ? formaterDatoLang(behovsmelding.innsendingsdato)
      : undefined,
    auto_formidler_stilling: formidlerStilling?.toLowerCase() || undefined,
    auto_hjelpemidler_innvilget: hjelpemidlerSøktOm,
    auto_hjelpemidler_avslått: hjelpemidlerSøktOm,
    auto_hjelpemidler_avslått_inline: hjelpemidlerSøktOm,
    auto_leveringstid: 'fem uker',
    ...spesiellePlaceholderVerdier,
    auto_formidler_navn: formidlerMedKopi?.navn || formidlerNavn || undefined,
  }
  const editor = usePlateEditor(
    {
      enabled: true as const,
      plugins: [
        ...[
          MarkdownPlugin.configure({
            options: {
              remarkPlugins: [remarkMdx],
            },
          }),
        ],
        ...[
          H1Plugin,
          H2Plugin,
          H3Plugin,
          H4Plugin,
          ItalicPlugin,
          UnderlinePlugin,
          BoldPlugin,
          ListPlugin.configure({
            inject: {
              targetPlugins: [KEYS.p],
            },
          }),
          // Våre egne breveditor plugins
          ...[
            ...FlytendeLinkVerktøylinjeKit,
            TabSyncPlugin.configure({
              options: {
                brevId,
              },
            }),
            PlaceholderPlugin,
          ],
        ],
      ],
      value: (editor) => {
        if (initialState?.value != null) {
          editor.history = initialState.history
          return initialState.value
        }
        if (templateMarkdown) {
          const deserialized = editor.getApi(MarkdownPlugin).markdown.deserialize(templateMarkdown)
          return transformerPlaceholders(deserialized, spesielleVerdier)
        }
        return [{ type: 'h1', children: [{ text: '' }] }]
      },
    },
    []
  )

  // hvis formidlers navn etterfylles oppdateres placeholderne automatisk
  useEffect(() => {
    const verdi = spesielleVerdier.auto_formidler_navn
    if (!verdi) return

    const placeholders = Array.from(
      editor.api.nodes({
        at: [],
        match: (node) =>
          (node as PlaceholderElement).type === ELEMENT_PLACEHOLDER &&
          (node as PlaceholderElement).autoVerdi === SpesiellePlaceholdere.FORMIDLER_NAVN,
      })
    ) as [PlaceholderElement, number[]][]

    for (const [node, path] of placeholders) {
      const tekst = node.children.map((child) => child.text).join('')
      if (hentSynligTekst(tekst).length > 0) continue

      const range = editor.api.range(path)
      if (range) editor.tf.insertText(verdi, { at: range })
    }
  }, [spesielleVerdier.auto_formidler_navn, editor])

  // Diverse state
  const state = useRef<BreveditorState | undefined>(undefined)
  const nesteSerienummer = useSerienummer(brevId, initialSerienummer)
  const [visMarger, settVisMarger] = useState(false)
  const [erPlateContentFokusert, settPlateContentFokusert] = useState(false)
  const [erVerktoylinjeFokusert, settVerktoylinjeFokusert] = useState(false)

  const erBreveditorEllerVerktoylinjeFokusert = useMemo(
    () => erPlateContentFokusert || erVerktoylinjeFokusert,
    [erPlateContentFokusert, erVerktoylinjeFokusert]
  )

  // Hjelper for å kunne fokusere text-editoren
  const plateContentRef = useRef<HTMLDivElement>(null)
  const fokuserPlateContent = useCallback(() => {
    if (plateContentRef.current)
      // Har en liten timeout her for å la eventer propagere opp og ned før vi fokuserer på PlateContent igjen, hvis delay
      // er for liten så mister vi selection i Platejs editoren
      setTimeout(() => plateContentRef.current?.focus(), 100)
  }, [])

  const { widthScale, heightScale, widthRef, heightRef } = useEditorScale(visMarger)
  const { endringsstatus, lagreMedDebounceOgRetry, flushLagring } = useLagreBrev(onLagreBrev)
  useEffect(() => {
    if (!flushLagringRef) return
    flushLagringRef.current = flushLagring
    return () => {
      if (flushLagringRef.current === flushLagring) {
        flushLagringRef.current = undefined
      }
    }
  }, [flushLagringRef, flushLagring])
  const visFormidlerSomMottaker = formidlerErMottaker && !!formidlerMedKopi
  const brukerErKopimottaker =
    data?.brevmottakere.some((mottaker) => mottaker.mottakertype === Mottakertype.BRUKER) ?? false
  const vergeMottakere = data?.brevmottakere.filter((mottaker) => mottaker.mottakertype === Mottakertype.VERGE) ?? []
  const vergemål = (personInfo?.vergemål || []).filter(
    (verge) =>
      !formidlerErMottaker || (verge.fnr != null && vergeMottakere.some((mottaker) => mottaker.fnr === verge.fnr))
  )
  const harVerge = vergemål.length > 0
  const vergeNavn = vergemål
    .map((it) => it.navn)
    .filter((navn): navn is NonNullable<typeof navn> => !!navn)
    .map((navn) => formaterNavn(navn))
    .join(', ')
  const målformTekster = hentMålformTekster(målform)

  // Stopp refresh/lukking av nettsiden hvis man har ulagrede endringer
  useBeforeUnload(
    onLagreBrev ? endringsstatus.erEndret : false,
    'Nå var du litt rask til å lukke fanen og alle endringene i brevet er ikke lagret enda. Er du sikker?'
  )

  const focusPath = useCallback(
    (path: number[]) => {
      if (plateContentRef.current) {
        ;(plateContentRef.current as HTMLElement).blur()
      }

      setTimeout(() => {
        editor.tf.focus()
        editor.tf.select({ path: [...path, 0], offset: 0 })

        setTimeout(() => {
          const selection = window.getSelection()
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const element = range.startContainer.parentElement
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }

          if (plateContentRef.current) {
            ;(plateContentRef.current as HTMLElement).focus()
          }
        }, 0)
      }, 10)
    },
    [editor]
  )

  // Lagrer også endringer i brevhodet uten at brukeren må redigere teksten.
  // Venter til person og mottakere er lastet, ellers mangler verge og formidler i HTML.
  const klarTilSynkronisering = !personLaster && !mottakereLaster && !formidlerLaster
  useEffect(() => {
    if (!klarTilSynkronisering || !onLagreBrev) return

    const value = editor.children
    const ferskHtml = byggFullHtml(
      metadata,
      value,
      stilarkVersjon,
      vergeNavn,
      målform,
      formidlerMedKopi,
      formidlerErMottaker,
      brukerErKopimottaker
    )
    if ((state.current?.valueAsHtml ?? initialState?.valueAsHtml) === ferskHtml) return

    const oppdatertState: BreveditorState = {
      value,
      valueAsHtml: ferskHtml,
      history: editor.history,
    }
    state.current = oppdatertState
    onStateChange?.(oppdatertState)
    lagreMedDebounceOgRetry(oppdatertState, nesteSerienummer())
  }, [
    klarTilSynkronisering,
    metadata,
    stilarkVersjon,
    vergeNavn,
    målform,
    formidlerMedKopi,
    formidlerErMottaker,
    brukerErKopimottaker,
    editor,
    initialState,
    onLagreBrev,
    onStateChange,
    lagreMedDebounceOgRetry,
    nesteSerienummer,
  ])

  return (
    <BreveditorContext
      value={{
        erPlateContentFokusert: erPlateContentFokusert,
        fokuserPlateContent: fokuserPlateContent,
        erVerktoylinjeFokusert: erVerktoylinjeFokusert,
        settVerktoylinjeFokusert: settVerktoylinjeFokusert,
        erBreveditorEllerVerktoylinjeFokusert: erBreveditorEllerVerktoylinjeFokusert,
        visMarger: visMarger,
        settVisMarger: settVisMarger,
        endringsstatus: endringsstatus,
        focusPath: focusPath,
      }}
    >
      <Plate
        editor={editor}
        onChange={({ editor: changedEditor, value: nyVerdi }) => {
          if ((onStateChange != null || onLagreBrev) && !editor.getPlugin(TabSyncPlugin).options.onChangeLocked) {
            const constructedState: BreveditorState = {
              value: nyVerdi,
              valueAsHtml: byggFullHtml(
                metadata,
                nyVerdi,
                stilarkVersjon,
                vergeNavn,
                målform,
                formidlerMedKopi,
                formidlerErMottaker,
                brukerErKopimottaker
              ),
              history: changedEditor.history,
            }
            if (!state.current || state.current.value !== nyVerdi) {
              // On state-change
              state.current = constructedState
              if (onStateChange) onStateChange(constructedState)
              lagreMedDebounceOgRetry(constructedState, nesteSerienummer())
            }
          }
        }}
      >
        <div ref={widthRef} className="breveditor-container" style={{ position: 'relative' }}>
          <Verktøylinje />
          <div className="scrollable-pit">
            <div style={{ height: heightScale }} className="scaled-height">
              <div ref={heightRef} className="measured-height">
                <div style={{ scale: widthScale }} className="scaled-width">
                  <div className="clear-styles">
                    <div className={`brev-stilark brev-stilark-v1${!visMarger ? ' zoomed' : ''}`}>
                      <div
                        className={`header${(formidlerMedKopi && !formidlerErMottaker) || formidlerErMottaker ? ' med-formidlerkopi' : ''}`}
                      >
                        <div className="header-row">
                          <dl>
                            {visFormidlerSomMottaker && (
                              <>
                                <dt>{målformTekster.formidler}:</dt>
                                <dd>{formidlerNavn}</dd>
                                <br />
                              </>
                            )}
                            {harVerge && (
                              <>
                                <dt>{målformTekster.verge}:</dt>
                                <dd>{vergeNavn}</dd>
                                <br />
                              </>
                            )}
                            <dt>
                              {' '}
                              {harVerge || visFormidlerSomMottaker ? målformTekster.sakenGjelder : målformTekster.navn}:
                            </dt>
                            <dd>{metadata.brukersNavn}</dd>
                            <dt>{målformTekster.fødselsnummer}:</dt>
                            <dd>{metadata.brukersFødselsnummer}</dd>
                            <dt>{målformTekster.saksnummer}:</dt>
                            <dd>{metadata.saksnummer}</dd>
                            {formidlerErMottaker && brukerErKopimottaker && (
                              <>
                                <br />
                                <dt>{målformTekster.kopiTil}:</dt>
                                <dd>{metadata.brukersNavn}</dd>
                              </>
                            )}
                            {formidlerMedKopi && !formidlerErMottaker && (
                              <>
                                <br />
                                <dt>{målformTekster.kopiTilHjelpemiddelformidler}:</dt>
                                <dd>{formidlerNavn}</dd>
                              </>
                            )}
                          </dl>
                          <span>{metadata.brevOpprettet}</span>
                        </div>
                      </div>
                      <PlateContainer>
                        <PlateContent
                          aria-label="Breveditor"
                          ref={plateContentRef}
                          onBlur={() => settPlateContentFokusert(false)}
                          onFocus={() => {
                            settPlateContentFokusert(true)
                            // hvis editor har fokus men caret er ikke plassert plasserer vi den på starten
                            if (!editor.selection) {
                              const start = editor.api.start([])
                              if (start) {
                                editor.tf.select({ anchor: start, focus: start })
                              }
                            }
                          }}
                          placeholder={placeholder}
                          className="contentEditable"
                        />
                      </PlateContainer>
                      <p>
                        {målformTekster.medVennligHilsen} <br />
                        {metadata.saksbehandlerNavn}
                        {metadata.attestantsNavn ? `, ${metadata.attestantsNavn}` : ''} <br />
                        {metadata.hjelpemiddelsentral}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <PlaceholderErrorSummary></PlaceholderErrorSummary>
        </div>
      </Plate>
    </BreveditorContext>
  )
}
