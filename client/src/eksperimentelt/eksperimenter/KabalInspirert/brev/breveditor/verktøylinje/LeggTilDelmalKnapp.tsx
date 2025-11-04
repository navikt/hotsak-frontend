import { Button, Modal, Tooltip, UNSAFE_Combobox } from '@navikt/ds-react'
import { useEditorState } from 'platejs/react'
import { FileParagraphIcon } from '@navikt/aksel-icons'
import { useState } from 'react'
import { MarkdownPlugin } from '@platejs/markdown'
import { useBreveditorContext } from '../Breveditor.tsx'
import avslagDetYtesIkkeStonadTilSengForSmertelindringOgAvlasting from '../../brevmaler/delmaler/avslag-det-ytes-ikke-stønad-for-smertelindring-avlasting.md?raw'
import avslagDyneKuledyne from '../../brevmaler/delmaler/avslag-dyne-kulekjededyne.md?raw'

const LeggTilDelmalKnapp = ({}: {}) => {
  const breveditor = useBreveditorContext()
  const editor = useEditorState()
  const [visModal, settVisModal] = useState(false)
  const [selection, settSelection] = useState<string>()

  const delmaler = {
    'Avslag - Dyne - Avslått din søknad om Kule-/Kjededyne': avslagDyneKuledyne,
    'Avslag - Seng - Det ytes ikke stønad til seng for smertelindring og avlastning':
      avslagDetYtesIkkeStonadTilSengForSmertelindringOgAvlasting,
  }

  const onClose = () => {
    settVisModal(false)
    settSelection(undefined)
  }

  const onInsert = () => {
    const s = delmaler[selection as keyof typeof delmaler]
    if (s) {
      const nodes = editor.getApi(MarkdownPlugin).markdown.deserialize(s)
      editor.tf.insertNodes(nodes)
      settVisModal(false)
      settSelection(undefined)
    }
  }

  return (
    <div>
      <Tooltip content={'Legg til delmal'} keys={[]}>
        <Button
          disabled={!breveditor.erBreveditorEllerVerktoylinjeFokusert || !editor.selection}
          onMouseDown={(event: { preventDefault: () => void }) => {
            event.preventDefault()
            settVisModal(true)
          }}
          variant="tertiary-neutral"
          size="small"
          icon={<FileParagraphIcon fontSize="1rem" />}
        />
      </Tooltip>
      <Modal header={{ heading: 'Sett inn delmal' }} open={visModal} onClose={onClose}>
        <Modal.Body style={{ maxWidth: '650px', width: '90vw' }}>
          {visModal && (
            <>
              <UNSAFE_Combobox
                label="Velg delmal"
                options={Object.keys(delmaler)}
                onToggleSelected={(option, isSelected) => {
                  if (isSelected) {
                    settSelection(option)
                  } else {
                    settSelection(undefined)
                  }
                }}
                selectedOptions={selection ? [selection] : undefined}
                shouldAutocomplete
              />
              <div style={{ padding: '2em 0.5em', whiteSpace: 'pre-wrap' }}>
                {selection && delmaler[selection as keyof typeof delmaler]}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" disabled={!selection} onClick={onInsert}>
            Sett inn
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default LeggTilDelmalKnapp
