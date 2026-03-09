import { useEditorRef, useEditorSelector } from 'platejs/react'
import { useBreveditorContext } from '../../../BreveditorContext'
import { someList, toggleList } from '@platejs/list-classic'

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
