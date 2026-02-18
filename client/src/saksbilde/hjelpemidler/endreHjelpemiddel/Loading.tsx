import { Box, HGrid, HStack, Skeleton, VStack } from '@navikt/ds-react'

export function Loading({ count }: { count: number }) {
  return (
    <>
      <HGrid columns="1fr 1fr 1fr" gap="space-12">
        {[...Array(count).keys()].map((it) => (
          <LoadingCard key={it} />
        ))}
      </HGrid>
      <Box marginBlock="space-12 space-0" style={{ height: 64 }} />
    </>
  )
}

function LoadingCard() {
  return (
    <VStack gap="space-12">
      <Box borderWidth="1" borderColor="neutral-subtle" borderRadius="large" padding="space-16">
        <VStack gap="space-12">
          <Skeleton variant="rectangle" width="100%" height={185} />
          <Skeleton variant="rectangle" width="90%" height={64} />
          <Skeleton variant="rectangle" width="60%" height={24} />
          <Skeleton variant="text" width="60%" height={20} />
        </VStack>
      </Box>
      <HStack justify="center">
        <Skeleton variant="rectangle" width="50%" height={32} />
      </HStack>
    </VStack>
  )
}
