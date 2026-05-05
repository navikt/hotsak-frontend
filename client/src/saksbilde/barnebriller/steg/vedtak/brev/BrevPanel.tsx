import { HStack, Loader } from '@navikt/ds-react'
import { useEffect } from 'react'

import { FeilmeldingAlert } from '../../../../../felleskomponenter/feil/FeilmeldingAlert.tsx'
import { Etikett } from '../../../../../felleskomponenter/typografi'
import { Brevtype, RessursStatus } from '../../../../../types/types.internal'
import { useBrev } from './useBrev'
import classes from './BrevPanel.module.css'

interface BrevPanelProps {
  sakId: number | string
  brevtype: Brevtype
  fullSize: boolean
}

export function BrevPanel(props: BrevPanelProps) {
  const { sakId, brevtype, fullSize } = props
  const { hentedeBrev, brevError, hentForhåndsvisning } = useBrev()
  const hentetDokument = hentedeBrev[brevtype]

  useEffect(() => {
    if (sakId && brevtype === Brevtype.BARNEBRILLER_VEDTAK) {
      hentForhåndsvisning(sakId, brevtype)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sakId, brevtype]) // todo -> få lagt til hentForhåndsvisning i avhengighetslisten, det gir render loop pt.

  if (!sakId) {
    return <div>Saksnummer mangler.</div>
  } else if (brevError) {
    return <FeilmeldingAlert>Det oppstod en feil ved opprettelse av brev</FeilmeldingAlert>
  } else if (hentetDokument.status === RessursStatus.HENTER) {
    return (
      <HStack justify="center" gap="space-16" marginBlock="space-16">
        <Loader size="medium" title="Henter brev..." />
        <Etikett>Genererer forhåndsvisning av brev...</Etikett>
      </HStack>
    )
  } else
    return (
      <div>
        {hentetDokument.status === RessursStatus.SUKSESS && (
          <DokumentIFrame fullSize={fullSize} dokumentData={hentetDokument.data} />
        )}
      </div>
    )
}

const DokumentIFrame = ({ fullSize, dokumentData }: { fullSize: boolean; dokumentData?: string }) => {
  if (fullSize) {
    return (
      <div className={classes.dokumentDiv}>
        <iframe title={'dokument'} src={dokumentData} width={'100%'} height={'100%'}></iframe>
      </div>
    )
  } else {
    return <iframe className={classes.styledIFrame} title={'Dokument'} src={dokumentData} tabIndex={0}></iframe>
  }
}
