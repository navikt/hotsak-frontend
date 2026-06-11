import classes from './DokumentFrame.module.css'

export interface DokumentFrameProps {
  data?: string
  fullSize?: boolean
  title?: string
}

export function DokumentFrame(props: DokumentFrameProps) {
  const { data, fullSize, title = 'Dokument' } = props
  if (fullSize) {
    return (
      <div className={classes.root}>
        <iframe title={title} src={data} width="100%" height="100%" />
      </div>
    )
  }
  return <iframe title={title} src={data} className={classes.frame} tabIndex={0} />
}
