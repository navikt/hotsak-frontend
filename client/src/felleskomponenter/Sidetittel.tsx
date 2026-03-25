export interface SidetittelProps {
  tittel: string
}

export function Sidetittel(props: SidetittelProps) {
  const { tittel } = props
  return <title>{`Hotsak - ${tittel}`}</title>
}
