import { Bleed, Box } from '@navikt/ds-react'
import { AkselColor } from '@navikt/ds-react/types/theme'

export const MerknadBox = ({ merknad, children }: { merknad?: AkselColor; children: React.ReactNode }) => {
  return (
    <Bleed marginInline="space-12" asChild>
      <Box.New
        paddingInline="space-8"
        borderColor="info"
        borderWidth="0 0 0 4"
        background={merknad ? 'neutral-moderate' : 'default'}
      >
        {children}
      </Box.New>
    </Bleed>
  )
}
