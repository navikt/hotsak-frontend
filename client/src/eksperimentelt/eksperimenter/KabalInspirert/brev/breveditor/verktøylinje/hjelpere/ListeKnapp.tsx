import { Button, Tooltip } from '@navikt/ds-react'
import { useEditorSelector, useEditorState } from 'platejs/react'
import { someList, toggleList } from '@platejs/list-classic'
import type { ReactNode } from 'react'
import { useBreveditorContext } from '../../Breveditor.tsx'

const ListeKnapp = ({ tittel, listeStilType, ikon }: { tittel: string; listeStilType: string; ikon: ReactNode }) => {
  const breveditor = useBreveditorContext()
  const editor = useEditorState()
  const pressed = useEditorSelector((editor) => someList(editor, listeStilType), [])
  const active = breveditor.erPlateContentFokusert && pressed
  return (
    <Tooltip content={tittel} keys={[]}>
      <Button
        disabled={!breveditor.erPlateContentFokusert}
        icon={ikon}
        size="small"
        variant={active ? 'primary-neutral' : 'tertiary-neutral'}
        onClick={(_) => {
          toggleList(editor, {
            type: listeStilType,
          })
        }}
      />
    </Tooltip>
  )
}

export default ListeKnapp
