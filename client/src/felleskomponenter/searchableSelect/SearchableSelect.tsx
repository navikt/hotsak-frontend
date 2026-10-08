import { TextField } from '@navikt/ds-react'
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

import classes from './SearchableSelect.module.css'

interface SearchableSelectProps {
  label: ReactNode
  suggestions: string[]
  value: string
  onChange(value: string): void
  error?: string
  readOnly?: boolean
  className?: string
}

export function SearchableSelect({
  label,
  suggestions,
  value,
  onChange,
  error,
  readOnly = false,
  className,
}: SearchableSelectProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const selectOnClick = useRef(false)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.split(' ').some((word) => word.toUpperCase().startsWith(query.toUpperCase()))
  )
  const suggestionsOpen = !readOnly && open && filteredSuggestions.length > 0
  const listId = `${id}-suggestions`

  function selectSuggestion(suggestion: string) {
    onChange(suggestion)
    setOpen(false)
    setActiveIndex(-1)
    inputRef.current?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (suggestionsOpen && activeIndex >= 0) {
        selectSuggestion(filteredSuggestions[activeIndex])
      }
    } else if (event.key === 'Escape') {
      if (open) {
        event.preventDefault()
        setOpen(false)
        setActiveIndex(-1)
      }
    } else if (!readOnly && filteredSuggestions.length > 0 && event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((current) => (current + 1) % filteredSuggestions.length)
    } else if (!readOnly && filteredSuggestions.length > 0 && event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((current) => (current <= 0 ? filteredSuggestions.length - 1 : current - 1))
    }
  }

  return (
    <div className={[classes.root, className].filter(Boolean).join(' ')}>
      <span id={`${id}-description`} className={classes.invisible}>
        Skriv en tittel, eller bruk pil ned for å velge et forslag.
      </span>
      <TextField
        className={classes.textField}
        label={label}
        ref={inputRef}
        value={value}
        onChange={(event) => {
          setQuery(event.target.value)
          setActiveIndex(-1)
          setOpen(true)
          onChange(event.target.value)
        }}
        onFocus={() => {
          if (!readOnly) {
            setQuery('')
            setActiveIndex(-1)
            setOpen(true)
            inputRef.current?.select()
          }
        }}
        onMouseDown={(event) => {
          selectOnClick.current = !readOnly && document.activeElement !== event.currentTarget
        }}
        onClick={(event) => {
          if (selectOnClick.current) {
            // The click can move the caret after focus has selected the text.
            event.currentTarget.select()
            selectOnClick.current = false
          }
        }}
        onBlur={() => {
          selectOnClick.current = false
          setOpen(false)
          setActiveIndex(-1)
        }}
        onKeyDown={handleKeyDown}
        error={error}
        readOnly={readOnly}
        autoComplete="off"
        size="small"
        role="combobox"
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={suggestionsOpen}
        aria-activedescendant={suggestionsOpen && activeIndex >= 0 ? `${id}-suggestion-${activeIndex}` : undefined}
        aria-describedby={`${id}-description`}
      />
      <ul
        id={listId}
        className={classes.suggestionsWrapper}
        role="listbox"
        aria-label="Liste med tekstforslag"
        hidden={!suggestionsOpen}
      >
        {filteredSuggestions.map((suggestion, index) => (
          <li
            key={suggestion}
            id={`${id}-suggestion-${index}`}
            role="option"
            aria-selected={index === activeIndex}
            className={`${classes.suggestionElement} ${index === activeIndex ? classes.active : ''}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => selectSuggestion(suggestion)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  )
}
