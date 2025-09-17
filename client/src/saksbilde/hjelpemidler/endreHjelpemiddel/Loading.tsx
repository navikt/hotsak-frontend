import { Box, HGrid, HStack, Skeleton, VStack } from '@navikt/ds-react'

export function Loading({ count }: { count: number }) {
  return (
    <>
      <HGrid columns="1fr 1fr 1fr" gap="3">
        {[...Array(count).keys()].map((it) => (
          <LoadingCard key={it} />
        ))}
      </HGrid>
      <Box marginBlock="3 0" style={{ height: 64 }} />
    </>
  )
}

function LoadingCard() {
  return (
    <VStack gap="3">
      <Box.New borderWidth="1" borderColor="neutral-subtle" borderRadius="large" padding="4">
        <VStack gap="3">
          <Skeleton variant="rectangle" width="100%" height={185} />
          <Skeleton variant="rectangle" width="90%" height={64} />
          <Skeleton variant="rectangle" width="60%" height={24} />
          <Skeleton variant="text" width="60%" height={20} />
        </VStack>
      </Box.New>
      <HStack justify="center">
        <Skeleton variant="rectangle" width="50%" height={32} />
      </HStack>
    </VStack>
  )
}
