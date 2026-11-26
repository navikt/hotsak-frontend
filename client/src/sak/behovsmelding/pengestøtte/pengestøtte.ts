import {
  type Innsenderbehovsmelding,
  type Opplysning,
  OpplysningId,
  ProduktkategoriType,
} from '../../../types/BehovsmeldingTypes.ts'

export interface Pengestøtte {
  kategorinavn: string
  utbetalesTil?: string
  mottaker: {
    navn: string
    fnr: string
  }
}

export function utledPengestøtte(behovsmelding: Innsenderbehovsmelding): Pengestøtte | undefined {
  const produktkategori = behovsmelding.hjelpemidler.produktkategorier?.find(
    (kategori) => kategori.type === ProduktkategoriType.TILSKUDD_RIMELIGE_HJELPEMIDLER
  )
  if (!produktkategori) return undefined

  const opplysninger = produktkategori.opplysninger
  const mottakerFnr = finnTekst(opplysninger, OpplysningId.TILSKUDD_RIMELIGE_HJELPEMIDLER_MOTTAKER_FNR)
  const { bruker } = behovsmelding

  return {
    kategorinavn: produktkategori.navn,
    utbetalesTil: finnTekst(opplysninger, OpplysningId.TILSKUDD_RIMELIGE_HJELPEMIDLER_UTBETALES_TIL),
    mottaker: mottakerFnr
      ? {
          navn: [
            finnTekst(opplysninger, OpplysningId.TILSKUDD_RIMELIGE_HJELPEMIDLER_MOTTAKER_FORNAVN),
            finnTekst(opplysninger, OpplysningId.TILSKUDD_RIMELIGE_HJELPEMIDLER_MOTTAKER_ETTERNAVN),
          ]
            .filter(Boolean)
            .join(' '),
          fnr: mottakerFnr,
        }
      : { navn: `${bruker.navn.fornavn} ${bruker.navn.etternavn}`, fnr: bruker.fnr },
  }
}

function finnTekst(opplysninger: Opplysning[], id: OpplysningId): string | undefined {
  const innhold = opplysninger.find((opplysning) => opplysning.key?.id === id)?.innhold[0]
  return innhold?.forhåndsdefinertTekst?.nb ?? innhold?.fritekst
}
