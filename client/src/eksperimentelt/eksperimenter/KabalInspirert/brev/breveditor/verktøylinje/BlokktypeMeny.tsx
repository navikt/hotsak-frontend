import * as React from 'react'
import { ActionMenu, Button } from '@navikt/ds-react'
import { KEYS } from 'platejs'
import { useEditorSelector, useEditorState } from 'platejs/react'
import {
  BulletListIcon,
  ChevronDownIcon,
  Density3Icon,
  NumberListIcon,
  PencilWritingFillIcon,
} from '@navikt/aksel-icons'
import { someList, toggleList } from '@platejs/list-classic'
import { TypeH1, TypeH2, TypeH3 } from '@styled-icons/bootstrap'
import { useBreveditorContext } from '../Breveditor.tsx'

const BlokktypeMeny = () => {
  const breveditor = useBreveditorContext()
  // const { editor } = useEditorPlugin(BlockMenuPlugin);

  const editor = useEditorState()
  const turnInto = React.useCallback(
    (type: string) => {
      editor.api
        .blocks()
        .filter((it) => it[1].length == 1)
        .forEach(([_, path]) => {
          editor.tf.resetBlock({ at: path })
          editor.tf.toggleBlock(type, { at: path })
        })
    },
    [editor]
  )

  const punktlistePressed = useEditorSelector((editor) => someList(editor, 'ul'), [])

  const nummerertListePressed = useEditorSelector((editor) => someList(editor, 'ol'), [])

  const editorStateChange = useEditorState()
  const topLevelBlocks = editorStateChange.api.blocks().filter((it) => it[1].length == 1)
  const blockType = (() => {
    return topLevelBlocks.length == 1 ? topLevelBlocks[0]![0]!.type : undefined
  })()
  const moreThanOneBlockSelected = (() => topLevelBlocks.length > 1)()
  const noBlockSelected = (() => !breveditor.erBreveditorEllerVerktoylinjeFokusert || topLevelBlocks.length == 0)()

  return (
    <div
      style={{
        margin: '0 0.5em',
      }}
    >
      <ActionMenu
        onOpenChange={(open) => {
          if (!open) breveditor.fokuserPlateContent()
        }}
      >
        <ActionMenu.Trigger>
          <Button
            variant="secondary-neutral"
            icon={<ChevronDownIcon aria-hidden />}
            iconPosition="right"
            size="small"
            disabled={!breveditor.erBreveditorEllerVerktoylinjeFokusert}
          >
            <span
              style={{
                width: '82px',
                whiteSpace: 'nowrap' /* Prevents text from wrapping */,
                overflow: 'hidden' /* Hides overflowing text */,
                textOverflow: 'ellipsis' /* Displays '...' when text is cut off */,
                display: 'block',
              }}
            >
              {noBlockSelected && <span style={{ minWidth: '50px', display: 'inline-block' }}>-</span>}
              {!noBlockSelected && moreThanOneBlockSelected && <>Flere</>}
              {!noBlockSelected && blockType == KEYS.p && <>Brødtekst</>}
              {!noBlockSelected && blockType == KEYS.h1 && <>Tittel</>}
              {!noBlockSelected && blockType == KEYS.h2 && <>Overskrift 1</>}
              {!noBlockSelected && blockType == KEYS.h3 && <>Overskrift 2</>}
              {!noBlockSelected && blockType == KEYS.h4 && <>Overskrift 3</>}
              {!noBlockSelected && !moreThanOneBlockSelected && blockType == KEYS.ulClassic && <>Punktliste</>}
              {!noBlockSelected && !moreThanOneBlockSelected && blockType == KEYS.olClassic && <>Nummerert liste</>}
            </span>
          </Button>
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          <ActionMenu.Group label="Størrelser">
            <ActionMenu.Item icon={<PencilWritingFillIcon fontSize="1rem" />} onSelect={() => turnInto(KEYS.h1)}>
              Tittel
            </ActionMenu.Item>
            <ActionMenu.Item
              icon={<TypeH1 fontSize="1rem" style={{ scale: '0.7' }} />}
              onSelect={() => turnInto(KEYS.h2)}
            >
              Overskrift 1
            </ActionMenu.Item>
            <ActionMenu.Item
              icon={<TypeH2 title="Overskrift 2" fontSize="1rem" style={{ scale: '0.7' }} />}
              onSelect={() => turnInto(KEYS.h3)}
            >
              Overskrift 2
            </ActionMenu.Item>
            <ActionMenu.Item
              icon={<TypeH3 title="Overskrift 3" fontSize="1rem" style={{ scale: '0.7' }} />}
              onSelect={() => turnInto(KEYS.h4)}
            >
              Overskrift 3
            </ActionMenu.Item>
            <ActionMenu.Item icon={<Density3Icon fontSize="1rem" />} onSelect={() => turnInto(KEYS.p)}>
              Brødtekst
            </ActionMenu.Item>
          </ActionMenu.Group>
          <ActionMenu.Group label="Lister">
            <ActionMenu.Item
              icon={<BulletListIcon fontSize="1rem" />}
              onSelect={() =>
                !punktlistePressed &&
                toggleList(editor, {
                  type: 'ul',
                })
              }
            >
              Punktliste
            </ActionMenu.Item>
            <ActionMenu.Item
              icon={<NumberListIcon fontSize="1rem" />}
              onSelect={() =>
                !nummerertListePressed &&
                toggleList(editor, {
                  type: 'ol',
                })
              }
            >
              Nummerert liste
            </ActionMenu.Item>
          </ActionMenu.Group>
        </ActionMenu.Content>
      </ActionMenu>
    </div>
  )
}

export default BlokktypeMeny
