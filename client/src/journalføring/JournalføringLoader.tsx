import { Box, HGrid, HStack, Skeleton, VStack } from '@navikt/ds-react'

import { LasterPersonlinje } from '../felleskomponenter/personlinje/Personlinje.tsx'

export function JournalføringLoader() {
  return (
    <div role="status" aria-label="Henter journalpost">
      <LasterPersonlinje />
      <HGrid columns="2fr 3fr">
        <VStack gap="space-24" padding="space-16">
          <Skeleton width={120} height={28} />
          <HStack gap="space-12">
            <Skeleton width={130} height={20} />
            <Skeleton width={180} height={20} />
          </HStack>
          <VStack gap="space-12">
            <Skeleton width={80} height={24} />
            <Skeleton width="100%" height={48} variant="rounded" />
            <Skeleton width="100%" height={112} variant="rounded" />
            <Skeleton width="100%" height={80} variant="rounded" />
          </VStack>
          <VStack gap="space-12">
            <Skeleton width={120} height={24} />
            <Skeleton width="100%" height={72} variant="rounded" />
            <Skeleton width="100%" height={56} variant="rounded" />
          </VStack>
          <VStack gap="space-12">
            <Skeleton width={110} height={24} />
            <Skeleton width="100%" height={56} variant="rounded" />
          </VStack>
          <Skeleton width={230} height={36} variant="rounded" />
        </VStack>
        <Box padding="space-16">
          <Skeleton variant="rectangle" width="100%" height={800} />
        </Box>
      </HGrid>
    </div>
  )
}
