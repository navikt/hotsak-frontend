import historikk from '../data/historikk.json'
import oppgaveliste from '../data/oppgaveliste.json'
import saker from '../data/saker.json'

export const mutableSaker = saker
export const mutableOppgaveliste = oppgaveliste

export const mutableSakshistorikk = [
  { saksid: '111111', hendelser: deepClone(historikk) },
  { saksid: '222222', hendelser: deepClone(historikk) },
  { saksid: '5878444', hendelser: deepClone(historikk) },
  { saksid: '1234567', hendelser: deepClone(historikk) },
  { saksid: '888888', hendelser: deepClone(historikk) },
  { saksid: '999999', hendelser: deepClone(historikk) },
  { saksid: '112233', hendelser: deepClone(historikk) },
  { saksid: '223344', hendelser: deepClone(historikk) },
  { saksid: '87757', hendelser: deepClone(historikk) },
]

function deepClone(array: any[]) {
  return JSON.parse(JSON.stringify(array))
}
