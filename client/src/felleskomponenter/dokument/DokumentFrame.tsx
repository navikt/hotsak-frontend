import { useObjectUrl } from '../../io/HttpClient'
import classes from './DokumentFrame.module.css'

export interface DokumentFrameProps {
  data?: Blob
  fullSize?: boolean
  title?: string
}

export function DokumentFrame(props: DokumentFrameProps) {
  const { data, fullSize, title = 'Dokument' } = props
  const url = useObjectUrl(data)
  if (fullSize) {
    return (
      <div className={classes.root}>
        <iframe title={title} src={url} width="100%" height="100%" allow="fullscreen" />
      </div>
    )
  }
  return <iframe title={title} src={url} className={classes.frame} tabIndex={0} />
}
