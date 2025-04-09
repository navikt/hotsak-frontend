import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'

export function MarkdownEditor({
  tekst,
  onChange,
  readOnly,
}: {
  tekst: string
  onChange: (tekst: string) => void
  readOnly: boolean
}) {
  // Oppdater innhold ved endring av utkast
  const editorRef = useRef<MDXEditorMethods>(null)
  useEffect(() => {
    if (editorRef.current) editorRef.current.setMarkdown(tekst)
  }, [tekst])

  return (
    <MDXEditor
      markdown={tekst}
      readOnly={readOnly}
      ref={editorRef}
      plugins={[
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        toolbarPlugin({
          toolbarClassName: 'my-classname',
          toolbarContents: () => (
            <>
              <BlockTypeSelect />
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
            </>
          ),
        }),
      ]}
      onChange={onChange}
      translation={(key, defaultValue) => {
        switch (key) {
          case 'toolbar.blockTypes.paragraph':
            return 'Paragraf'
          case 'toolbar.blockTypes.quote':
            return 'Sitat'
          case 'toolbar.undo':
            return 'Angre'
          case 'toolbar.redo':
            return 'Gjør igjen'
          case 'toolbar.bold':
            return 'Uthevet'
          case 'toolbar.removeBold':
            return 'Fjern uthevet'
          case 'toolbar.italic':
            return 'Kursiv'
          case 'toolbar.removeItalic':
            return 'Fjern kursiv'
          case 'toolbar.underline':
            return 'Understrek'
          case 'toolbar.removeUnderline':
            return 'Fjern understrek'
          case 'toolbar.bulletedList':
            return 'Punktliste'
          case 'toolbar.numberedList':
            return 'Nummerert liste'
          case 'toolbar.checkList':
            return 'Sjekkliste'
          case 'toolbar.blockTypeSelect.selectBlockTypeTooltip':
            return 'Velg blokk type'
          case 'toolbar.blockTypeSelect.placeholder':
            return 'Blokk type'
        }
        return defaultValue
      }}
    />
  )
}

export const MardownEditorPreviewStyling = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'truncate',
})<{ truncate?: boolean }>`
  ${({ truncate }) =>
    truncate &&
    `
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;    
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 7;
  `}

  .mdxEditorRemoveMargin {
    padding: 0;
    font-size: var(--a-font-size-medium);
    color: var(--a-text-default);
    font-family: 'Source Sans Pro';
  }
`
