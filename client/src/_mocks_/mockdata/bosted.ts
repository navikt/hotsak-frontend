import { tilfeldigInnslag } from './felles'

const bosted = ['Dal', 'Ås', 'Vik', 'Bukt', 'Kløft', 'Fjell', 'Høydedrag']

export function lagTilfeldigBosted(): string {
  return tilfeldigInnslag(bosted)
}
