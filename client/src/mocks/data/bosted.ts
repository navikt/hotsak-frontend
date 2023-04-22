import { tilfeldigInnslag } from './felles'

const bosted = ['Dal', 'Ås', 'Vik', 'Bukt', 'Kløft', 'Fjell', 'Høydedrag', 'Grotte', 'Hule', 'Nes', 'Odde', 'Tange']

export function lagTilfeldigBosted(): string {
  return tilfeldigInnslag(bosted)
}
