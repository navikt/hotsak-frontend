import useSWR from 'swr'
import { useEffect } from 'react'
import { Loader } from '@navikt/ds-react'

export const BrevmalLaster = ({ malKey, velgMal }: { malKey: string; velgMal: (mal: string) => void }) => {
  let importer
  switch (malKey) {
    case 'innvilgelse':
      importer = import('./maler/innvilgelse.md?raw')
      break
    case 'delvis-innvilgelse-bruker-har-ikke-rett':
      importer = import('./maler/delvis-innvilgelse-bruker-har-ikke-rett.md?raw')
      break
    case 'delvis-innvilgelse-hjelpemiddelet-gis-ikke':
      importer = import('./maler/delvis-innvilgelse-hjelpemiddelet-gis-ikke.md?raw')
      break
    case 'delvis-innvilgelse-andre-enn-nav-dekker':
      importer = import('./maler/delvis-innvilgelse-andre-enn-nav-dekker.md?raw')
      break
    case 'avslag-bruker-har-ikke-rett':
      importer = import('./maler/avslag-bruker-har-ikke-rett.md?raw')
      break
    case 'avslag-hjelpemiddelet-gis-ikke':
      importer = import('./maler/avslag-hjelpemiddelet-gis-ikke.md?raw')
      break
    case 'avslag-andre-enn-nav-dekker':
      importer = import('./maler/avslag-andre-enn-nav-dekker.md?raw')
      break
  }

  const { data } = useImporterMal(malKey, importer)
  useEffect(() => {
    if (data) velgMal(data)
  }, [data, velgMal])

  return (
    <div style={{ padding: '1em', background: 'white', height: '100%', textAlign: 'center' }}>
      <Loader size="large" title="Laster brevmal" />
    </div>
  )
}

const useImporterMal = (key: string | undefined, importer: Promise<any> | undefined) => {
  return useSWR(key, importer === undefined ? async () => {} : async () => (await importer).default)
}
