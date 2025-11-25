import { Button, omit, TextField, VStack } from '@navikt/ds-react'
import { FloppydiskIcon, LinkBrokenIcon } from '@navikt/aksel-icons'
import { useEditorPlugin, useEditorRef } from 'platejs/react'
import { type KeyboardEvent, useEffect, useState } from 'react'
import { LinkPlugin, submitFloatingLink } from '@platejs/link/react'
import { useFlytendeLinkVerktøylinjeContext } from './FlytendeLinkVerktøylinje.tsx'
import { urlTransform } from './urlTransform.ts'

export function OpprettEndreLinkPanel() {
  const {
    floatingLinkEdit: {
      unlinkButtonProps: { onClick },
    },
    floatingLinkUrlInput: { ref, props },
  } = useFlytendeLinkVerktøylinjeContext()

  const editor = useEditorRef()
  const { getOptions, setOptions } = useEditorPlugin(LinkPlugin)

  // Sett url lik displayname som utgangspunkt (slik at man får denne foreslått hvis man merker en link og klikker på knappen)
  useEffect(() => {
    const opts = getOptions()
    if (opts.url == '')
      setOptions({
        url: urlTransform(opts.text.trim()),
      })
  }, [])

  // Submit endringer og feilhåndtering
  const [harUrlError, settHarUrlError] = useState(false)
  const attemptSubmit = () => {
    // Sett displayname lik url (minus schema)
    setOptions({
      text: getOptions().url.replace(/^http(s)?:\/\//, ''),
    })
    if (submitFloatingLink(editor)) {
      settHarUrlError(false)
    } else {
      settHarUrlError(true)
    }
  }

  // Overstyr lagringsforsøk til å bruke vår funksjon slik at vi får feilhåndtering
  const onKeyDownCapture = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      attemptSubmit()
    }
  }

  return (
    <VStack gap="4" padding="space-8" onKeyDownCapture={onKeyDownCapture}>
      <TextField
        label="Link adresse"
        placeholder="https://"
        size="small"
        error={harUrlError ? 'Ugyldig adresse' : undefined}
        ref={ref}
        defaultValue={getOptions().url}
        {...omit(props, ['defaultValue'])}
        style={{
          /* Fikser bredden (100% på insiden av yttre padding) */ boxSizing: 'border-box',
        }}
        data-plate-focus
      />
      <Button icon={<FloppydiskIcon />} variant="tertiary" size="small" onClick={attemptSubmit}>
        Lagre
      </Button>
      <Button
        icon={<LinkBrokenIcon />}
        variant="tertiary-neutral"
        size="small"
        onClick={() => {
          onClick()
        }}
      >
        Fjern link
      </Button>
    </VStack>
  )
}
