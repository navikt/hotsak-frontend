export interface HotkeyDefinition {
  code: string
  alt?: boolean
  ctrl?: boolean
  shift?: boolean
  meta?: boolean
  description: string
}

export interface HotkeyGroup {
  label: string
  hotkeys: Record<string, HotkeyDefinition>
}

export const GLOBALE_HOTKEYS = {
  åpneModia: {
    code: 'KeyM',
    alt: true,
    description: 'Åpne Modia',
  },
  åpneGosys: {
    code: 'KeyP',
    alt: true,
    description: 'Åpne Gosys',
  },
  visHurtigtaster: {
    code: 'KeyH',
    alt: true,
    description: 'Vis hurtigtaster',
  },
  mineOppgaver: {
    code: 'Digit1',
    alt: true,
    description: 'Gå til mine oppgaver',
  },
  enhetensOppgaver: {
    code: 'Digit2',
    alt: true,
    description: 'Gå til enhetens oppgaver',
  },
  medarbeidersOppgaver: {
    code: 'Digit3',
    alt: true,
    description: 'Gå til medarbeiders oppgaver',
  },
} as const satisfies Record<string, HotkeyDefinition>

export const SAK_HOTKEYS = {
  innvilgeUtenBrev: {
    code: 'KeyI',
    alt: true,
    description: 'Innvilge uten brev',
  },
} as const satisfies Record<string, HotkeyDefinition>

export const OPPGAVELISTE_HOTKEYS = {
  alle: {
    code: 'KeyA',
    description: 'Vis alle oppgaver på valgt liste',
  },
  hast: {
    code: 'KeyH',
    description: 'Vis hastesaker på valgt liste',
  },
  venter: {
    code: 'KeyV',
    description: 'Vis oppgaver vent på valgt liste',
  },
  ferdigstilte: {
    code: 'KeyF',
    description: 'Vis ferdigstilte oppgaver på valgt liste',
  },
  fjernAlleFiltre: {
    code: 'KeyX',
    description: 'Fjern alle filtre',
  },
} as const satisfies Record<string, HotkeyDefinition>

export const HOTKEY_GRUPPER: HotkeyGroup[] = [
  { label: 'Globale', hotkeys: GLOBALE_HOTKEYS },
  ...(window.appSettings.NAIS_CLUSTER_NAME !== 'prod-gcp'
    ? [
        { label: 'Sak', hotkeys: SAK_HOTKEYS },
        { label: 'Oppgaveliste', hotkeys: OPPGAVELISTE_HOTKEYS },
      ]
    : []),
]

export function formaterTaster(hotkey: HotkeyDefinition): string[] {
  const taster: string[] = []
  if (hotkey.ctrl) taster.push('Ctrl')
  if (hotkey.alt) taster.push('Alt')
  if (hotkey.shift) taster.push('Shift')
  if (hotkey.meta) taster.push('⌘')
  taster.push(formaterCode(hotkey.code))
  return taster
}

function formaterCode(code: string): string {
  if (code.startsWith('Key')) return code.slice(3)
  if (code.startsWith('Digit')) return code.slice(5)
  return code
}
