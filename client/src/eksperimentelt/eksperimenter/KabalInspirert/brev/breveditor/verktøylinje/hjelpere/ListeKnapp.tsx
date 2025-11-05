import { Button, Tooltip } from '@navikt/ds-react'
import { useEditorRef, useEditorSelector } from 'platejs/react'
import { someList, toggleList } from '@platejs/list-classic'
import type { ReactNode } from 'react'
import { useBreveditorContext } from '../../Breveditor.tsx'

const ListeKnapp = ({ tittel, listeStilType, ikon }: { tittel: string; listeStilType: string; ikon: ReactNode }) => {
  const { disabled, onClick, active } = useListeKnapp(listeStilType)
  return (
    <Tooltip content={tittel} keys={[]}>
      <Button
        disabled={disabled}
        icon={ikon}
        size="small"
        variant={active ? 'primary-neutral' : 'tertiary-neutral'}
        onClick={onClick}
      />
    </Tooltip>
  )
}

export default ListeKnapp

export const useListeKnapp = (listeStilType: string) => {
  const breveditor = useBreveditorContext()
  const editor = useEditorRef()
  const pressed = useEditorSelector((editor) => someList(editor, listeStilType), [])
  return {
    active: breveditor.erPlateContentFokusert && pressed,
    disabled: !breveditor.erPlateContentFokusert,
    onClick: () => {
      toggleList(editor, {
        type: listeStilType,
      })
    },
  }
}
