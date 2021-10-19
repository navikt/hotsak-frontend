export enum Oppgavetype {
  Søknad = 'SØKNAD',
}
export interface GrunndataProdukt {
  prodid: string
  produkt: {
    isocode: string
    isotitle: string
    apostid: string
    apostnr: string
  }
}
