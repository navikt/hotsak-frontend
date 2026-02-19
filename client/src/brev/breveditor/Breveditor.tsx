import './Breveditor.less'
import versjonertStilarkV1 from './versjonerte-brev-stilark/v1.less?raw'
import { Plate, PlateContainer, PlateContent, usePlateEditor } from 'platejs/react'
import { MarkdownPlugin, remarkMdx } from '@platejs/markdown'
import { KEYS, type Value } from 'platejs'
import { serializeHtml } from 'platejs/static'
import { createContext, type RefObject, useCallback, useContext, useMemo, useRef, useState } from 'react'
import {
  BoldPlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  H4Plugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@platejs/basic-nodes/react'
import { TabSyncPlugin } from './plugins/tab-sync/TabSyncPlugin.tsx'
import { FlytendeLinkVerktøylinjeKit } from './plugins/flytende-link-verktøylinje/FlytendeLinkVerktøylinjeKit.tsx'
import type { History } from '@platejs/slate'
import Verktøylinje from './verktøylinje/Verktøylinje.tsx'
import { ListPlugin } from '@platejs/list-classic/react'
import { useBeforeUnload, useRefSize } from './hooks.ts'
import { parseTekstMedPlaceholders } from './plugins/placeholder/parseTekstMedPlaceholders.ts'
import { PlaceholderPlugin } from './plugins/placeholder/PlaceholderPlugin'
import { PlaceholderFeil } from './plugins/placeholder/PlaceholderFeil.ts'
import { PlaceholderErrorSummary } from './plugins/placeholder/PlaceholderErrorSummary/PlaceholderErrorSummary.tsx'

export interface BreveditorContextType {
  erPlateContentFokusert: boolean
  fokuserPlateContent: () => void
  erVerktoylinjeFokusert: boolean
  settVerktoylinjeFokusert: (fokus: boolean) => void
  erBreveditorEllerVerktoylinjeFokusert: boolean
  visMarger: boolean
  settVisMarger: (visMarger: boolean) => void
  onSlettBrev?: () => void
  endringsstatus: { lagrerNå: boolean; erEndret: boolean; error?: string }
  focusPath: (path: number[]) => void
}

export const BreveditorContext = createContext<BreveditorContextType | undefined>(undefined)

export const useBreveditorContext = () => {
  const ctx = useContext(BreveditorContext)
  if (!ctx) console.error('BreveditorContext må eksistere utenfor alle andre breveditor komponenter!')
  return ctx!
}

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

const transformerPlaceholders = (nodes: Value): Value => {
  return nodes.map((node) => {
    // hvis det er en tekstnode med placeholder-syntaks
    if ('text' in node && typeof node.text === 'string' && node.text.includes('[')) {
      const parsed = parseTekstMedPlaceholders(node.text)
      // Hvis parsing fant placeholders, returner arrayet med noder
      // Ellers returner den originale noden
      if (parsed.length > 1 || (parsed.length === 1 && parsed[0].type)) {
        return parsed
      }
      return node
    }

    // Hvis node har children, transformer dem rekursivt
    if ('children' in node && Array.isArray(node.children)) {
      const transformedChildren = transformerPlaceholders(node.children as Value)
      // Flat ut arrayet med barnenoder
      const flattenedChildren = transformedChildren.flat()
      return { ...node, children: flattenedChildren }
    }

    return node
  }) as Value
}

const Breveditor = ({
  brevId,
  metadata,
  templateMarkdown,
  initialState,
  onStateChange,
  onLagreBrev,
  onSlettBrev,
  placeholder,
  placeholderFeil = [],
}: {
  brevId?: string
  metadata: Metadata
  templateMarkdown?: string
  initialState?: StateMangement
  onStateChange?: (newState: StateMangement) => void
  onLagreBrev?: (newState: StateMangement) => Promise<void>
  onSlettBrev?: () => void
  placeholder?: string
  placeholderFeil?: PlaceholderFeil[]
}) => {
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
          return transformerPlaceholders(deserialized)
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
  const [visMarger, settVisMarger] = useState(true)
  const [erPlateContentFokusert, settPlateContentFokusert] = useState(false)
  const [erVerktoylinjeFokusert, settVerktoylinjeFokusert] = useState(false)

  const erBreveditorEllerVerktoylinjeFokusert = useMemo(
    () => erPlateContentFokusert || erVerktoylinjeFokusert,
    [erPlateContentFokusert, erVerktoylinjeFokusert]
  )

  const headerRef = useRef<HTMLDivElement | null>(null)
  const footerRef = useRef<HTMLParagraphElement | null>(null)

  // Hjelper for å kunne fokusere text-editoren
  const plateContentRef = useRef(null)
  const fokuserPlateContent = useCallback(() => {
    if (plateContentRef)
      // Har en liten timeout her for å la eventer propagere opp og ned før vi fokuserer på PlateContent igjen, hvis delay
      // er for liten så mister vi selection i Platejs editoren
      setTimeout(() => (plateContentRef as RefObject<any>).current?.focus(), 100)
  }, [plateContentRef])

  // Skaler breveditor sitt innhold slik at Navs brevstandard sine px/pt verdier vises korrekt og propersjonalt, med
  // korrekt lengde i scrollbart felt.
  const { size: editorWidthScaleRefSize, ref: editorWidthScaleRef } = useRefSize()
  const editorWidthScale = (() => {
    if (!editorWidthScaleRefSize) return 1.0
    let designedWidth = 794 // 595pt in px
    if (!visMarger) designedWidth = 650 // 595pt - 108pt ((64-10)*2=108)
    return editorWidthScaleRefSize.width / designedWidth
  })()
  const { size: editorHeightScaleRefSize, ref: editorHeightScaleRef } = useRefSize()
  const editorHeightScale = editorHeightScaleRefSize?.height
    ? `${editorHeightScaleRefSize.height * editorWidthScale}px`
    : 'auto'

  // Track endringsstatus (er alle endringer lagret)
  const [endringsstatus, setEndringsstatus] = useState<{
    lagrerNå: boolean
    erEndret: boolean
    error?: string
  }>({ lagrerNå: false, erEndret: false })

  // Stopp refresh/lukking av nettsiden hvis man har ulagrede endringer
  useBeforeUnload(
    onLagreBrev ? endringsstatus.erEndret : false,
    'Nå var du litt rask til å lukke fanen og alle endringene i brevet er ikke lagret enda. Er du sikker?'
  )

  // Debounce/retry av onLagreBrev
  const debounceLagring = useRef<NodeJS.Timeout | undefined>(undefined)
  const kallOnLagreBrevMedDebounceOgRetry = (constructedState: StateMangement) => {
    if (onLagreBrev) {
      setEndringsstatus({ ...endringsstatus, erEndret: true }) // Behold evt. error men sett erEndret=true.
      clearTimeout(debounceLagring.current) // Kanseller pågående timere, enten de var startet på enste linjer eller i retry nedenfor
      debounceLagring.current = setTimeout(async () => {
        setEndringsstatus({ erEndret: true, lagrerNå: true, error: undefined }) // Vis at vi forsøker å lagre
        await onLagreBrev(constructedState)
          .catch((e) => {
            setEndringsstatus({ erEndret: true, lagrerNå: false, error: e.toString() }) // Vis at vi feilet
            debounceLagring.current = setTimeout(
              () => kallOnLagreBrevMedDebounceOgRetry(constructedState), // Try, try again...
              2000
            )
            throw e // Hopp over then blokken under
          })
          .then(() => {
            setEndringsstatus({ erEndret: false, lagrerNå: false, error: undefined })
          })
          .catch(() => {
            /* Ignorer exception... */
          })
      }, 500)
    }
  }

  const focusPath = useCallback(
    (path: number[]) => {
      editor.tf.focus()
      editor.tf.select({ path: [...path, 0], offset: 0 })
      setTimeout(() => {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const element = range.startContainer.parentElement
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 0)
    },
    [editor]
  )

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
        onSlettBrev: onSlettBrev,
        endringsstatus: endringsstatus,
        focusPath: focusPath,
      }}
    >
      <Plate
        editor={editor}
        onChange={async ({ editor: changedEditor, value: newValue }) => {
          if ((onStateChange != undefined || onLagreBrev) && !editor.getPlugin(TabSyncPlugin).options.onChangeLocked) {
            const constructedState: StateMangement = {
              value: newValue,
              valueAsHtml:
                `<html>
                    <head>
                      <style>
                        @page {
                          margin: 64pt 56pt 74pt 56pt;
                          @bottom-right {
                            font-family: 'Source Sans 3', sans-serif;
                            content: 'Side ' counter(page) ' av ' counter(pages);
                          }
                          @bottom-left {
                            font-family: 'Source Sans 3', sans-serif;
                            content: 'Saksnummer ${metadata.saksnummer}';
                          }
                        }
                        html, body {
                          font-size: 11pt;
                          font-weight: normal;
                          font-family: 'Source Sans 3', sans-serif;
                          line-height: 16pt;
                        }
                      </style>
                      <style>${versjonertStilarkV1}</style>
                    </head>` +
                (headerRef.current?.outerHTML || '') +
                (await serializeHtml(editor)) +
                (footerRef.current?.outerHTML || '') +
                '</html>',
              history: changedEditor.history,
            }
            if (!state.current || JSON.stringify(state.current) != JSON.stringify(constructedState)) {
              // On state-change
              state.current = constructedState
              if (onStateChange) onStateChange(constructedState)
              kallOnLagreBrevMedDebounceOgRetry(constructedState)
            }
          }
        }}
      >
        <div ref={editorWidthScaleRef} className="breveditor-container" style={{ position: 'relative' }}>
          <Verktøylinje />
          <div className="scrollable-pit">
            <div style={{ height: editorHeightScale }} className="scaled-height">
              <div ref={editorHeightScaleRef} className="measured-height">
                <div style={{ scale: editorWidthScale }} className="scaled-width">
                  <div className="clear-styles">
                    <div className={`brev-stilark brev-stilark-v1${!visMarger ? ' zoomed' : ''}`}>
                      <div ref={headerRef} className="header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="20" viewBox="0 0 64 20">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M63.4793 0.520905H56.8203C56.8203 0.520905 56.3613 0.520905 56.199 0.926432L52.5139 12.2133L48.8318 0.926432C48.6695 0.520905 48.2079 0.520905 48.2079 0.520905H35.4043C35.1271 0.520905 34.8948 0.752508 34.8948 1.02804V4.86102C34.8948 1.82046 31.6611 0.520905 29.7675 0.520905C25.5271 0.520905 22.6886 3.31523 21.8047 7.5635C21.7568 4.74522 21.5227 3.7354 20.7639 2.70117C20.4154 2.19448 19.9116 1.76854 19.3631 1.41626C18.2336 0.754282 17.2194 0.520905 15.0398 0.520905H12.4806C12.4806 0.520905 12.018 0.520905 11.8548 0.926432L9.52624 6.70009V1.02804C9.52624 0.752508 9.29564 0.520905 9.01892 0.520905H3.09697C3.09697 0.520905 2.63976 0.520905 2.47346 0.926432L0.0526208 6.92992C0.0526208 6.92992 -0.189065 7.53023 0.363486 7.53023H2.63976V18.9702C2.63976 19.2541 2.86327 19.4791 3.14841 19.4791H9.01892C9.29564 19.4791 9.52624 19.2541 9.52624 18.9702V7.53023H11.8145C13.1276 7.53023 13.4056 7.56616 13.9165 7.80442C14.2242 7.92067 14.5014 8.15582 14.6526 8.42691C14.9622 9.00991 15.0398 9.71005 15.0398 11.7745V18.9702C15.0398 19.2541 15.2677 19.4791 15.5493 19.4791H21.1759C21.1759 19.4791 21.8118 19.4791 22.0633 18.8508L23.3103 15.7672C24.9684 18.0908 27.6974 19.4791 31.089 19.4791H31.83C31.83 19.4791 32.4699 19.4791 32.7231 18.8508L34.8948 13.4698V18.9702C34.8948 19.2541 35.1271 19.4791 35.4043 19.4791H41.148C41.148 19.4791 41.7817 19.4791 42.0362 18.8508C42.0362 18.8508 44.3334 13.1446 44.3422 13.1016H44.3458C44.434 12.6268 43.8345 12.6268 43.8345 12.6268H41.7844V2.8356L48.2345 18.8508C48.4864 19.4791 49.1214 19.4791 49.1214 19.4791H55.9068C55.9068 19.4791 56.5453 19.4791 56.7972 18.8508L63.948 1.13496C64.1955 0.520905 63.4793 0.520905 63.4793 0.520905ZM34.8941 12.6268H31.036C29.5003 12.6268 28.251 11.3827 28.251 9.84442C28.251 8.30883 29.5003 7.05675 31.036 7.05675H32.1149C33.6466 7.05675 34.8941 8.30883 34.8941 9.84442V12.6268Z"
                            fill="#C00000"
                          ></path>
                        </svg>
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
                          onFocus={() => settPlateContentFokusert(true)}
                          placeholder={placeholder}
                          className="contentEditable"
                        />
                      </PlateContainer>
                      <p ref={footerRef}>
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
          <PlaceholderErrorSummary feil={placeholderFeil}></PlaceholderErrorSummary>
        </div>
      </Plate>
    </BreveditorContext>
  )
}

export default Breveditor
