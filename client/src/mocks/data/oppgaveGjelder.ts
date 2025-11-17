import { tilfeldigInnslag } from './felles'

const behandlingstemaer = new Map<string, string>([
  ['Ortopediske hjelpemidler', 'ab0013'],
  ['Tinnitusmaskerer', 'ab0253'],
  ['Arbeids- og utdanningsreiser', 'ab0315'],
  ['Servicehund', 'ab0332'],
  ['Aktivitetshjelpemidler', 'ab0369'],
])

const behandlingstyper = [
  'Ganghjelpemidler',
  'Sittestillingsutstyr',
  'Bevegelseshjelpemidler',
  'Kommunikasjons- og synshjelpemidler',
  'Hørsels- og talehjelpemidler',
]

export function hentRandomBehandlingstema(): string {
  return tilfeldigInnslag(Array.from(behandlingstemaer.keys()))
}

export function hentRandomBehandlingstype(): string {
  return tilfeldigInnslag(behandlingstyper)
}

export function hentBehandlingstemaKode(behandlingstema: string): string {
  return behandlingstemaer.get(behandlingstema) || ''
}
