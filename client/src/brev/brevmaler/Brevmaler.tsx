import useSWR from 'swr'
import { Button, Chips, Select } from '@navikt/ds-react'
import { type ReactNode, useEffect, useState } from 'react'

export const BrevmalVelger = ({ velgMal }: { velgMal: (mal: string) => void }) => {
  return (
    <div style={{ padding: '1em', background: 'white', height: '100%' }}>
      <div style={{ maxWidth: '300px' }}>
        <Velger
          tittel="Velg brevmal"
          alternativer={[
            {
              title: 'Innvilgelse',
              component: (
                <OpprettBrevKnapp
                  velgMal={velgMal}
                  unikNøkkel="Innvilgelse"
                  importer={import('./maler/innvilgelse.md?raw')}
                />
              ),
            },
            {
              title: 'Delvis innvilgelse',
              component: (
                <Velger
                  tittel="Velg begrunnelse"
                  alternativer={[
                    {
                      title: 'Bruker har ikke rett til hjelpemidler',
                      component: (
                        <OpprettBrevKnapp
                          velgMal={velgMal}
                          unikNøkkel="delvis-innvilgelse-bruker-har-ikke-rett"
                          importer={import('./maler/delvis-innvilgelse-bruker-har-ikke-rett.md?raw')}
                        />
                      ),
                    },
                    {
                      title: 'Hjelpemiddelet gis ikke fra Folketrygden',
                      component: (
                        <OpprettBrevKnapp
                          velgMal={velgMal}
                          unikNøkkel="delvis-innvilgelse-hjelpemiddelet-gis-ikke"
                          importer={import('./maler/delvis-innvilgelse-hjelpemiddelet-gis-ikke.md?raw')}
                        />
                      ),
                    },
                    {
                      title: 'Andre enn Nav dekker hjelpemiddelet',
                      component: (
                        <OpprettBrevKnapp
                          velgMal={velgMal}
                          unikNøkkel="delvis-innvilgelse-andre-enn-nav-dekker"
                          importer={import('./maler/delvis-innvilgelse-andre-enn-nav-dekker.md?raw')}
                        />
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              title: 'Avslag',
              component: (
                <Velger
                  tittel="Velg avslagstype"
                  alternativer={[
                    {
                      title: 'Bruker har ikke rett til hjelpemidler',
                      component: (
                        <OpprettBrevKnapp
                          velgMal={velgMal}
                          unikNøkkel="avslag-bruker-har-ikke-rett"
                          importer={import('./maler/avslag-bruker-har-ikke-rett.md?raw')}
                        />
                      ),
                    },
                    {
                      title: 'Hjelpemiddelet gis ikke fra Folketrygden',
                      component: (
                        <OpprettBrevKnapp
                          velgMal={velgMal}
                          unikNøkkel="avslag-hjelpemiddelet-gis-ikke"
                          importer={import('./maler/avslag-hjelpemiddelet-gis-ikke.md?raw')}
                        />
                      ),
                    },
                    {
                      title: 'Andre enn Nav dekker hjelpemiddelet',
                      component: (
                        <OpprettBrevKnapp
                          velgMal={velgMal}
                          unikNøkkel="avslag-andre-enn-nav-dekker"
                          importer={import('./maler/avslag-andre-enn-nav-dekker.md?raw')}
                        />
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              title: 'Svartidsbrev',
              component: <Svartidsbrev velgMal={velgMal} />,
            },
            {
              title: 'Tom brevmal',
              component: (
                <Button
                  onClick={() => {
                    velgMal('# ')
                  }}
                  style={{ margin: '1em 0' }}
                >
                  Opprett brev
                </Button>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}

const Svartidsbrev = ({ velgMal }: { velgMal: (mal: string) => void }) => {
  const [selected, setSelected] = useState<string>('4 uker')
  const alternativer = ['4 uker', '12 uker', '18 uker']

  return (
    <div style={{ margin: '1em 0' }}>
      <Chips>
        {alternativer.map((option) => (
          <Chips.Toggle key={option} selected={selected == option} onClick={() => setSelected(option)}>
            {option}
          </Chips.Toggle>
        ))}
      </Chips>
      <OpprettBrevKnapp
        velgMal={velgMal}
        unikNøkkel="svartidsbrev"
        importer={import('./maler/svartidsbrev.md?raw')}
        transformerMal={(m) => m.replaceAll('{{ANTALL_UKER_SVARTID}}', selected)}
      />
    </div>
  )
}

const Velger = ({
  tittel,
  alternativer,
}: {
  tittel: string
  alternativer: { title: string; component: ReactNode }[]
}) => {
  const [underType, setUnderType] = useState<string>()
  return (
    <>
      <div style={{ margin: '1em 0 0 0' }}>
        <Select
          label={tittel}
          onChange={(e) => {
            const v = e.target.value
            if (v != '') setUnderType(v)
            else setUnderType(undefined)
          }}
        >
          <option disabled={!!underType} value="">
            -
          </option>
          {alternativer.map((v) => (
            <option key={v.title} value={v.title}>
              {v.title}
            </option>
          ))}
        </Select>
      </div>
      {alternativer.map((v) => (
        <div key={v.title}>{underType == v.title && v.component}</div>
      ))}
    </>
  )
}

const OpprettBrevKnapp = ({
  velgMal,
  unikNøkkel,
  importer,
  transformerMal,
}: {
  velgMal: (mal: string) => void
  unikNøkkel: string
  importer: Promise<any>
  transformerMal?: (mal: string) => string
}) => {
  const [key, setKey] = useState<string>()
  const { isLoading, data } = useImporterMal(key, importer)

  useEffect(() => {
    if (data) velgMal(transformerMal ? transformerMal(data) : data)
  }, [data])

  return (
    <Button
      loading={isLoading}
      onClick={() => {
        setKey(unikNøkkel)
      }}
      style={{ margin: '1em 0' }}
    >
      Opprett brev
    </Button>
  )
}

const useImporterMal = (key: string | undefined, importer: Promise<any> | undefined) => {
  return useSWR(key, importer === undefined ? async () => {} : async () => (await importer).default)
}
