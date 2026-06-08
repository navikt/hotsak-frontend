import useSWRImmutable from 'swr/immutable'

function loadTemplate(key: string): Promise<{ default: string }> {
  switch (key) {
    case 'innvilgelse':
      return import('./maler/innvilgelse.md?raw')
    case 'delvis-innvilgelse-bruker-har-ikke-rett':
      return import('./maler/delvis-innvilgelse-bruker-har-ikke-rett.md?raw')
    case 'delvis-innvilgelse-hjelpemiddelet-gis-ikke':
      return import('./maler/delvis-innvilgelse-hjelpemiddelet-gis-ikke.md?raw')
    case 'delvis-innvilgelse-andre-enn-nav-dekker':
      return import('./maler/delvis-innvilgelse-andre-enn-nav-dekker.md?raw')
    case 'avslag-bruker-har-ikke-rett':
      return import('./maler/avslag-bruker-har-ikke-rett.md?raw')
    case 'avslag-hjelpemiddelet-gis-ikke':
      return import('./maler/avslag-hjelpemiddelet-gis-ikke.md?raw')
    case 'avslag-andre-enn-nav-dekker':
      return import('./maler/avslag-andre-enn-nav-dekker.md?raw')
    case 'henleggelse':
      return import('./maler/henleggelse.md?raw')
    default:
      return Promise.resolve({ default: '' })
  }
}

async function templateFetcher(key: string) {
  const template = await loadTemplate(key)
  return template.default
}

export function useBrevmal(key?: string) {
  const { data } = useSWRImmutable(key || null, templateFetcher, {
    suspense: true,
  })
  return data
}
