export interface HotkeyDefinition {
  code: string
  alt?: boolean
  ctrl?: boolean
  shift?: boolean
  meta?: boolean
  description: string
}

export const HOTKEYS = {
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
