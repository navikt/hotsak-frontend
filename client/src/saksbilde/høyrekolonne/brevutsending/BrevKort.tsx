import { Link } from '@navikt/ds-react'

import classes from './BrevKort.module.css'

import { formaterTidsstempel } from '../../../utils/dato'
import { Etikett, Tekst, Undertittel } from '../../../felleskomponenter/typografi'
import type { Saksdokument } from '../../../types/types.internal'

export function BrevKort({ tittel, opprettet, saksbehandler, journalpostId, dokumentId }: Saksdokument) {
  return (
    <li className={classes.container}>
      <div className={classes.contentContainer}>
        <Etikett>
          <Link href={`/api/journalpost/${journalpostId}/${dokumentId}`} target="_blank">
            {tittel}
          </Link>
        </Etikett>
        {opprettet && <Undertittel>{formaterTidsstempel(opprettet)}</Undertittel>}
        <Tekst>{saksbehandler.navn}</Tekst>
      </div>
    </li>
  )
}
