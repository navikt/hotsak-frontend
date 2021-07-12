import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel'

export const GlobalFeilside = ({ error }: { error: Error }) => {
  return (
    <>
      <Varsel type={Varseltype.Advarsel}>Siden kan dessverre ikke vises</Varsel>
      <div>
        Du kan forsøke å laste siden på nytt, eller lukke nettleservinduet og logge inn på nytt.
        <pre>{error.stack}</pre>
      </div>
    </>
  )
}
