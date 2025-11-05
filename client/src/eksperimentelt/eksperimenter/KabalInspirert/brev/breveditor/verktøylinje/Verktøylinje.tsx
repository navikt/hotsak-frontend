import { Box } from '@navikt/ds-react'
import BlokktypeMeny from './BlokktypeMeny.tsx'
import AngreKnapp from './AngreKnapp.tsx'
import GjentaKnapp from './GjentaKnapp.tsx'
import FetKnapp from './FetKnapp.tsx'
import KursivKnapp from './KursivKnapp.tsx'
import UnderlinjeKnapp from './UnderlinjeKnapp.tsx'
import PunktlisteKnapp from './PunktlisteKnapp.tsx'
import NummerertListeKnapp from './NummerertListeKnapp.tsx'
import SvitsjMargerKnapp from './SvitsjMargerKnapp.tsx'
import { useBreveditorContext } from '../Breveditor.tsx'
import LinkKnapp from './LinkKnapp.tsx'
import SlettBrevutkastKnapp from './SlettBrevutkastKnapp.tsx'
import LeggTilDelmalKnapp from './LeggTilDelmalKnapp.tsx'

const Verktøylinje = () => {
  const breveditor = useBreveditorContext()
  return (
    <Box.New
      className="toolbar"
      onMouseDown={(e) => {
        // Prevent default for all other elements
        e.preventDefault()
      }}
      onFocusCapture={() => breveditor.settBreveditorEllerVerktoylinjeFokusert(true)}
      onBlurCapture={() => breveditor.settBreveditorEllerVerktoylinjeFokusert(breveditor.erPlateContentFokusert)}
    >
      <div className="left-items">
        <AngreKnapp />
        <GjentaKnapp />
        <Skillelinje />
        <FetKnapp />
        <KursivKnapp />
        <UnderlinjeKnapp />
        <Skillelinje />
        <LinkKnapp />
        <PunktlisteKnapp />
        <NummerertListeKnapp />
        <Skillelinje />
        <LeggTilDelmalKnapp />
        <SvitsjMargerKnapp />
        <BlokktypeMeny />
      </div>
      <div className="right-items">
        <div
          style={{
            fontSize: '0.8rem',
            padding: '4px',
            alignContent: 'center',
            width: '5em',
            textAlign: 'right',
          }}
        >
          {breveditor.endringsstatus.error ? (
            <span style={{ color: 'rgb(226, 41, 72)' }}>Lagring feilet!</span>
          ) : breveditor.endringsstatus.lagrerNå ? (
            <>Lagrer...</>
          ) : breveditor.endringsstatus.erEndret ? (
            <>Endret</>
          ) : (
            <>Lagret</>
          )}
        </div>
        <SlettBrevutkastKnapp />
      </div>
    </Box.New>
  )
}

const Skillelinje = () => {
  return <div className="separator-line">&nbsp;</div>
}

export default Verktøylinje
