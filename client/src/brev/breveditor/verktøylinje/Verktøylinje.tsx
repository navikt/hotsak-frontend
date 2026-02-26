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
import SettInnDelmalKnapp from './SettInnDelmalKnapp.tsx'
import FormateringMeny from './FormateringMeny.tsx'
import { useRefSize } from '../hooks.ts'

const Verktøylinje = () => {
  const breveditor = useBreveditorContext()

  const { size: toolbarRefSize, ref: toolbarRef } = useRefSize()
  const toolbarCollapsed = (() => {
    const width = toolbarRefSize?.width || 1000
    if (width < 490) return 'xsmall'
    else if (width < 585) return 'small'
    else if (width < 660) return 'medium'
    return 'large'
  })()

  return (
    <Box
      ref={toolbarRef}
      className="toolbar"
      onMouseDown={(e) => {
        // Prevent default for all other elements
        e.preventDefault()
      }}
      onFocusCapture={() => breveditor.settVerktoylinjeFokusert(true)}
      onBlurCapture={() => breveditor.settVerktoylinjeFokusert(false)}
    >
      <div className="left-items">
        {toolbarCollapsed == 'large' && (
          <>
            <AngreKnapp />
            <GjentaKnapp />
            <Skillelinje />
            <FetKnapp />
            <KursivKnapp />
            <UnderlinjeKnapp />
            <LinkKnapp />
            <Skillelinje />
            <PunktlisteKnapp />
            <NummerertListeKnapp />
            <Skillelinje />
            <SettInnDelmalKnapp />
            <SvitsjMargerKnapp />
            <BlokktypeMeny />
          </>
        )}
        {toolbarCollapsed == 'medium' && (
          <>
            <AngreKnapp />
            <GjentaKnapp />
            <Skillelinje />
            <FetKnapp />
            <KursivKnapp />
            <UnderlinjeKnapp />
            <PunktlisteKnapp />
            <SettInnDelmalKnapp />
            <FormateringMeny />
            <BlokktypeMeny />
          </>
        )}
        {toolbarCollapsed == 'small' && (
          <>
            <AngreKnapp />
            <FetKnapp />
            <KursivKnapp />
            <PunktlisteKnapp />
            <SettInnDelmalKnapp />
            <FormateringMeny />
            <BlokktypeMeny />
          </>
        )}
        {toolbarCollapsed == 'xsmall' && (
          <>
            <FormateringMeny />
            <BlokktypeMeny />
          </>
        )}
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
      </div>
    </Box>
  )
}

const Skillelinje = () => {
  return <div className="separator-line">&nbsp;</div>
}

export default Verktøylinje
