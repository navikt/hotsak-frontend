import { LinkPlugin } from '@platejs/link/react'
import { LinkElement } from './LinkElement.tsx'
import { FlytendeLinkVerktøylinje } from './FlytendeLinkVerktøylinje.tsx'
import { urlTransform } from './urlTransform.ts'

export const FlytendeLinkVerktøylinjeKit = [
  LinkPlugin.configure({
    render: {
      node: LinkElement,
      afterEditable: () => <FlytendeLinkVerktøylinje />,
    },
    options: {
      allowedSchemes: ['http', 'https'],
      transformInput: urlTransform,
    },
  }),
]
