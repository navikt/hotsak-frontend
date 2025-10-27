import { tilfeldigInnslag } from "./felles"

const substantiver = [
  "grønn",
  "reise",
  "himmel",
  "bok",
  "bil",
  "hus",
  "hund",
  "katt",
  "blomst",
  "fjell",
  "elv",
  "skog",
  "øy",
  "bro",
  "vei",
  "by",
  "land",
  "øyeblikk",
  "drøm",
  "stjerne",
  "sol",
  "måne",
  "vind",
  "regn",
  "snø",
]

const adjektiver = [
  'Rask',
  'Sakte',
  'Lys',
  'Mørk',
  'Sterk',
  'Myk',
  'Høy',
  'Lav',
  'Varm',
  'Kald',
  'Tørr',
  'Våt',
  'Ren',
  'Skitten',
  'Glad',
  'Trist',
  'Vennlig',
  'Sint',
  'Stor',
  'Liten',
  'Tung',
  'Lett',
  'Snill',
  'Slem',
]

const mapper = {
  "1": tilfeldigInnslag(adjektiver) + " " + tilfeldigInnslag(substantiver) + " mappe",
  "2": tilfeldigInnslag(adjektiver) + " " + tilfeldigInnslag(substantiver) + " mappe",
  "3": tilfeldigInnslag(adjektiver) + " " + tilfeldigInnslag(substantiver) + " mappe",
  "4": tilfeldigInnslag(adjektiver) + " " + tilfeldigInnslag(substantiver) + " mappe",
  "5": tilfeldigInnslag(adjektiver) + " " + tilfeldigInnslag(substantiver) + " mappe",
  "6": tilfeldigInnslag(adjektiver) + " " + tilfeldigInnslag(substantiver) + " mappe",
  "7": tilfeldigInnslag(adjektiver) + " " + tilfeldigInnslag(substantiver) + " mappe",
  "8": tilfeldigInnslag(adjektiver) + " " + tilfeldigInnslag(substantiver) + " mappe",
  "9": tilfeldigInnslag(adjektiver) + " " + tilfeldigInnslag(substantiver) + " mappe",
  "10": tilfeldigInnslag(adjektiver) + " " + tilfeldigInnslag(substantiver) + " mappe",
}

export function hentMappe(id: string): string {
  return mapper[id as keyof typeof mapper];
}