import { useDokument } from '../dokumenter/dokumentHook'
import { DokumentVelger } from './DokumentVelger'

export const Dokumenter: React.FC = () => {
  const journalpost = useDokument()

  return (
    <div>
      {journalpost?.journalpost?.dokumenter.map((dokument) => (
        <DokumentVelger key={dokument.dokumentID} dokument={dokument} />
      ))}
    </div>
  )
}
