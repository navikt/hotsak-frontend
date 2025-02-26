import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor'

export function MarkdownEditor({ tekst, onChange }: { tekst: string; onChange: (tekst: string) => void }) {
  return (
    <MDXEditor
      markdown={tekst}
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
