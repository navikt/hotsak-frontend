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
} as const satisfies Record<string, HotkeyDefinition>
