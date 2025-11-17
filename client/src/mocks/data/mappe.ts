import { tilfeldigInnslag } from "./felles"

const substantiver = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
]


const mapper = {
  "1": "Enhetsmappe" + " " + tilfeldigInnslag(substantiver),
  "2": "Enhetsmappe" + " " + tilfeldigInnslag(substantiver),
  "3": "Enhetsmappe" + " " + tilfeldigInnslag(substantiver),
  "4": "Enhetsmappe" + " " + tilfeldigInnslag(substantiver),
  "5": "Enhetsmappe" + " " + tilfeldigInnslag(substantiver),
  "6": "Enhetsmappe" + " " + tilfeldigInnslag(substantiver),
  "7": "Enhetsmappe" + " " + tilfeldigInnslag(substantiver),
  "8": "Enhetsmappe" + " " + tilfeldigInnslag(substantiver),
  "9": "Enhetsmappe" + " " + tilfeldigInnslag(substantiver),
  "10": "Enhetsmappe" + " " + tilfeldigInnslag(substantiver),
}

export function hentMappe(id: string): string {
  return mapper[id as keyof typeof mapper];
}