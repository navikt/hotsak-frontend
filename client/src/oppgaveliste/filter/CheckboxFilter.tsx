import { Checkbox, CheckboxGroup, VStack } from '@navikt/ds-react'
import { Strek } from '../../felleskomponenter/Strek'
import ShowMore from './ShowMore'

type CheckboxFilterInputProps = {
  options: string[]
  selected: string[]
}

export const CheckboxFilter = ({ options, selected }: CheckboxFilterInputProps) => {
  const notSelectedFilters = options.filter((option) => !selected.includes(option)).sort()

  const showMoreLabel = selected.length > 0 ? `Gjelder (${selected.length})` : 'Alle'

  return (
    <ShowMore title={showMoreLabel} spacing>
      <CheckboxGroup legend="Legend" hideLegend size="small" id="filters">
        <>
          <VStack gap="1" className="checkbox-filter__checkboxes" aria-label="Valgte filtre">
            {selected.map((f) => (
              <Checkbox
                name={f.toString()}
                value={f}
                key={`${f}`}
                onKeyDown={(event) => {
                  if (event.key === 'Space') {
                    event.preventDefault()
                    event.currentTarget?.form?.requestSubmit()
                  }
                }}
                onChange={(e) => {
                  e.currentTarget?.form?.requestSubmit()
                }}
              >
                {f}
              </Checkbox>
            ))}
            <Strek />
          </VStack>
          <VStack
            gap="1"
            //className="checkbox-filter__checkboxes checkbox-filter__scroll-container"
            aria-label="Ikke valgte filtre"
          >
            {notSelectedFilters.map((f) => (
              <Checkbox
                name={f}
                value={f}
                key={`${f}`}
                onKeyDown={(event) => {
                  if (event.key === 'Space') {
                    event.preventDefault()
                    //    event.currentTarget?.form?.requestSubmit()
                  }
                }}
                onChange={(e) => {
                  //  e.currentTarget?.form?.requestSubmit()
                }}
              >
                {f}
              </Checkbox>
            ))}
          </VStack>
        </>
      </CheckboxGroup>
    </ShowMore>
  )
}
