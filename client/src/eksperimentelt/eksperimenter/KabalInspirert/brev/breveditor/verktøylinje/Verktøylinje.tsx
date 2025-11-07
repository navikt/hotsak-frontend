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
import SettInnDelmalKnapp from './SettInnDelmalKnapp.tsx'
import { useLayoutEffect, useRef, useState } from 'react'
import FormateringMeny from './FormateringMeny.tsx'

const Verktøylinje = () => {
  const breveditor = useBreveditorContext()

  const toolbarRef = useRef<HTMLDivElement>(null)
  const [toolbarCollapsed, setToolbarCollapsed] = useState<'large' | 'medium' | 'small' | 'xsmall'>('large')
  useLayoutEffect(() => {
    const element = toolbarRef.current
    if (!element) return

    const resizeObserver = new ResizeObserver(() => {
      const { width } = element.getBoundingClientRect()
      if (width >= 660) setToolbarCollapsed('large')
      else if (width >= 585) setToolbarCollapsed('medium')
      else if (width >= 490) setToolbarCollapsed('small')
      else setToolbarCollapsed('xsmall')
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
        <SlettBrevutkastKnapp />
      </div>
    </Box.New>
  )
}

const Skillelinje = () => {
  return <div className="separator-line">&nbsp;</div>
}

export default Verktøylinje
