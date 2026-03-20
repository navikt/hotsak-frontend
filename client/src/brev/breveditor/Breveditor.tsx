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
import type { History } from '@platejs/slate'
import { KEYS, type Value } from 'platejs'
import { Plate, PlateContainer, PlateContent, usePlateEditor } from 'platejs/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useBrevContext } from '../BrevContext.ts'
import './Breveditor.less'
import { BreveditorContext } from './BreveditorContext.ts'
import { useBeforeUnload } from './hooks.ts'
import { byggFullHtml } from './html/byggDokument.ts'
import { FlytendeLinkVerktøylinjeKit } from './plugins/flytende-link-verktøylinje/FlytendeLinkVerktøylinjeKit.tsx'
import { PlaceholderSpesielleVerdier } from './plugins/placeholder/parseTekstMedPlaceholders.ts'
import { PlaceholderErrorSummary } from './plugins/placeholder/PlaceholderErrorSummary/PlaceholderErrorSummary.tsx'
import { PlaceholderPlugin } from './plugins/placeholder/PlaceholderPlugin'
import { TabSyncPlugin } from './plugins/tab-sync/TabSyncPlugin.tsx'
import { transformerPlaceholders } from './transformerPlaceholders.ts'
import { useEditorScale } from './useEditorScale.ts'
import { useLagreBrev } from './useLagreBrev.ts'
import Verktøylinje from './verktøylinje/Verktøylinje.tsx'

export interface StateMangement {
  value: Value
  valueAsHtml: string
  history: History
}

export interface Metadata {
  brukersNavn: string
  brukersFødselsnummer: string
  saksnummer: number
  brevOpprettet: string
  saksbehandlerNavn: string
  attestantsNavn?: string
  hjelpemiddelsentral: string
}

const Breveditor = ({
  brevId,
  metadata,
  templateMarkdown,
  initialState,
  onStateChange,
  onLagreBrev,
  placeholder,
}: {
  brevId?: string
  metadata: Metadata
  templateMarkdown?: string
  initialState?: StateMangement
  onStateChange?: (newState: StateMangement) => void
  onLagreBrev?: (newState: StateMangement) => Promise<void>
  placeholder?: string
}) => {
  const { datoSoknadMottatt, hjelpemidlerSøktOm } = useBrevContext()

  const spesielleVerdier: PlaceholderSpesielleVerdier = {
    auto_dato_soknad_mottatt: datoSoknadMottatt
      ? new Date(datoSoknadMottatt).toLocaleDateString('no-NB', { day: '2-digit', month: 'long', year: 'numeric' })
      : undefined,
    auto_hjelpemidler_innvilget: hjelpemidlerSøktOm,
    auto_hjelpemidler_avslått: hjelpemidlerSøktOm,
    auto_hjelpemidler_avslått_inline: hjelpemidlerSøktOm,
    auto_leveringstid: 'fem uker',
  }

  const editor = usePlateEditor(
    {
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
        if (templateMarkdown) {
          const deserialized = editor.getApi(MarkdownPlugin).markdown.deserialize(templateMarkdown)
          return transformerPlaceholders(deserialized, spesielleVerdier)
        } else if (initialState?.value != undefined) {
          editor.history = initialState.history
          return initialState.value
        } else {
          return [{ type: 'h1', children: [{ text: '' }] }] as Value
        }
      },
    },
    []
  )

  // Diverse state
  const state = useRef<StateMangement | undefined>(undefined)
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
  const { endringsstatus, lagreMedDebounceOgRetry } = useLagreBrev(onLagreBrev)

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

  // Ved mount: oppdater lagret HTML hvis metadata har endret seg (f.eks. ny saksbehandler etter overføring)
  useEffect(() => {
    if (initialState?.value && onLagreBrev) {
      const ferskHtml = byggFullHtml(metadata, initialState.value)
      if (initialState.valueAsHtml !== ferskHtml) {
        const oppdatertState: StateMangement = {
          value: initialState.value,
          valueAsHtml: ferskHtml,
          history: initialState.history,
        }
        state.current = oppdatertState
        onStateChange?.(oppdatertState)
        lagreMedDebounceOgRetry(oppdatertState)
      }
    }
  }, [])

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
          if ((onStateChange != undefined || onLagreBrev) && !editor.getPlugin(TabSyncPlugin).options.onChangeLocked) {
            const constructedState: StateMangement = {
              value: nyVerdi,
              valueAsHtml: byggFullHtml(metadata, nyVerdi),
              history: changedEditor.history,
            }
            if (!state.current || state.current.value !== nyVerdi) {
              // On state-change
              state.current = constructedState
              if (onStateChange) onStateChange(constructedState)
              lagreMedDebounceOgRetry(constructedState)
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
                      <div className="header">
                        <dl>
                          <dt>Navn:</dt>
                          <dd>{metadata.brukersNavn}</dd>
                          <dt>Fødselsnummer:</dt>
                          <dd>{metadata.brukersFødselsnummer}</dd>
                          <dt>Saksnummer:</dt>
                          <dd>{metadata.saksnummer}</dd>
                        </dl>
                        <span>{metadata.brevOpprettet}</span>
                      </div>
                      <PlateContainer>
                        <PlateContent
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
                        Med vennlig hilsen <br />
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

export default Breveditor
