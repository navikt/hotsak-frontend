import { flip, offset } from '@platejs/floating'
import {
  type LinkFloatingToolbarState,
  useFloatingLinkEdit,
  useFloatingLinkEditState,
  useFloatingLinkInsert,
  useFloatingLinkInsertState,
  useFloatingLinkUrlInput,
  useFloatingLinkUrlInputState,
} from '@platejs/link/react'
import { Box, BoxNewProps, Button, HStack } from '@navikt/ds-react'
import { DocPencilIcon, LinkBrokenIcon } from '@navikt/aksel-icons'
import { OpprettEndreLinkPanel } from './OpprettEndreLinkPanel.tsx'
import { OpenLinkButton } from './OpenLinkButton.tsx'
import { createContext, useContext } from 'react'

export interface FlytendeLinkVerktøylinjeContextType {
  floatingLinkInsert: ReturnType<typeof useFloatingLinkInsert>
  floatingLinkEdit: ReturnType<typeof useFloatingLinkEdit>
  floatingLinkUrlInput: ReturnType<typeof useFloatingLinkUrlInput>
}

export const FlytendeLinkVerktøylinjeContext = createContext<FlytendeLinkVerktøylinjeContextType | undefined>(undefined)

export const useFlytendeLinkVerktøylinjeContext = () => {
  const ctx = useContext(FlytendeLinkVerktøylinjeContext)
  if (!ctx)
    console.error(
      'FlytendeLinkVerktøylinjeContext må eksistere utenfor alle andre flytendelink-verktøylinje komponenter!'
    )
  return ctx!
}

export function FlytendeLinkVerktøylinje() {
  const state: LinkFloatingToolbarState = {
    floatingOptions: {
      middleware: [
        offset(8),
        flip({
          fallbackPlacements: ['bottom-end', 'top-start', 'top-end'],
          padding: 12,
        }),
      ],
      placement: 'bottom-start',
    },
  }

  const floatingLinkInsert = useFloatingLinkInsert(useFloatingLinkInsertState(state))

  const floatingLinkEditState = useFloatingLinkEditState(state)
  const floatingLinkEdit = useFloatingLinkEdit(floatingLinkEditState)

  const floatingLinkUrlInput = useFloatingLinkUrlInput(useFloatingLinkUrlInputState())

  const flytendeBoxProps: BoxNewProps = {
    background: 'default',
    padding: 'space-8',
    borderRadius: 'xlarge',
    borderColor: 'neutral-subtle',
    borderWidth: '1',
    shadow: 'dialog',
  }

  if (floatingLinkInsert.hidden) return null

  const { ref: insertRef, props: insertProps } = floatingLinkInsert
  const { ref: editRef, props: editProps } = floatingLinkEdit

  return (
    <FlytendeLinkVerktøylinjeContext
      value={{
        floatingLinkInsert,
        floatingLinkEdit,
        floatingLinkUrlInput,
      }}
    >
      <Box.New ref={insertRef} {...(insertProps as any)} {...flytendeBoxProps}>
        <OpprettEndreLinkPanel />
      </Box.New>
      <Box.New ref={editRef} {...(editProps as any)} {...flytendeBoxProps}>
        <>
          {floatingLinkEditState.isEditing && <OpprettEndreLinkPanel />}
          {!floatingLinkEditState.isEditing && (
            <HStack gap="1" wrap={false}>
              <Button
                icon={<DocPencilIcon />}
                variant="tertiary"
                size="small"
                {...floatingLinkEdit.editButtonProps}
                style={{ textWrap: 'nowrap' }}
              >
                Endre link
              </Button>
              <OpenLinkButton />
              <Button
                icon={<LinkBrokenIcon />}
                variant="tertiary"
                size="small"
                {...floatingLinkEdit.unlinkButtonProps}
              />
            </HStack>
          )}
        </>
      </Box.New>
    </FlytendeLinkVerktøylinjeContext>
  )
}
