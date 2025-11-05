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
import { useLayoutEffect, useRef, useState } from 'react'
import FormateringMeny from './FormateringMeny.tsx'

const Verktøylinje = () => {
  const breveditor = useBreveditorContext()

  const toolbarRef = useRef<HTMLDivElement>(null)
  const [toolbarCollapsed, setToolbarCollapsed] = useState<'full' | 'passe' | 'minimal'>('full')
  useLayoutEffect(() => {
    const element = toolbarRef.current
    if (!element) return

    const resizeObserver = new ResizeObserver(() => {
      const { width } = element.getBoundingClientRect()
      if (width >= 660) setToolbarCollapsed('full')
      else if (width >= 585) setToolbarCollapsed('passe')
      else setToolbarCollapsed('minimal')
    })

    resizeObserver.observe(element)

    // Cleanup on unmount
    return () => {
      resizeObserver.disconnect()
    }
  }, [setToolbarCollapsed])

  return (
    <Box.New
      ref={toolbarRef}
      className="toolbar"
      onMouseDown={(e) => {
        // Prevent default for all other elements
        e.preventDefault()
      }}
      onFocusCapture={() => breveditor.settBreveditorEllerVerktoylinjeFokusert(true)}
      onBlurCapture={() => breveditor.settBreveditorEllerVerktoylinjeFokusert(breveditor.erPlateContentFokusert)}
    >
      <div className="left-items">
        {toolbarCollapsed == 'full' && (
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
            <LeggTilDelmalKnapp />
            <SvitsjMargerKnapp />
            <BlokktypeMeny />
          </>
        )}
        {toolbarCollapsed == 'passe' && (
          <>
            <AngreKnapp />
            <GjentaKnapp />
            <Skillelinje />
            <FetKnapp />
            <KursivKnapp />
            <UnderlinjeKnapp />
            <PunktlisteKnapp />
            <LeggTilDelmalKnapp />
            <FormateringMeny />
            <BlokktypeMeny />
          </>
        )}
        {toolbarCollapsed == 'minimal' && (
          <>
            <AngreKnapp />
            <FetKnapp />
            <KursivKnapp />
            <PunktlisteKnapp />
            <LeggTilDelmalKnapp />
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
        <SlettBrevutkastKnapp />
      </div>
    </Box.New>
  )
}

const Skillelinje = () => {
  return <div className="separator-line">&nbsp;</div>
}

export default Verktøylinje
