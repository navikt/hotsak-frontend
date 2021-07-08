import styled from '@emotion/styled'
import classNames from 'classnames'
import React, { HTMLAttributes, useState } from 'react'

import NavFrontendChevron from 'nav-frontend-chevron'
import { Knapp } from 'nav-frontend-knapper'
import Popover, { PopoverOrientering } from 'nav-frontend-popover'

import { Button } from '../Button'

const EnkelKnapp = styled(Button)`
  display: flex;
  align-items: center;
  color: var(--navds-color-action-default);
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem 0;

  span {
    margin-left: 0.5rem;
  }
`

export const DropdownMenyknapp = styled(Knapp)`
  all: unset;
  height: 30px;
  min-width: 180px;
  font-size: 1rem;
  white-space: nowrap;
  text-align: left;
  padding: 0.25rem 1rem;
  width: 100%;
  box-sizing: border-box;

  &:hover,
  &:focus {
    background: var(--speil-light-hover);
    color: var(--navds-primary-text);
    cursor: pointer;
  }

  &:disabled {
    &,
    &:hover {
      background-color: transparent;
      color: var(--navds-color-text-disabled);
    }
  }
`

export const Strek = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid var(--navds-color-border);
`

const Liste = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0.5rem 0;
  background: var(--navds-color-background);
`

interface DropdownProps extends HTMLAttributes<HTMLButtonElement> {
  onClick?: (event: React.MouseEvent) => void
  orientering?: PopoverOrientering
  labelRenderer?: (ekspandert: boolean, onClick: (event: React.MouseEvent) => void) => JSX.Element
}

interface DropdownContextValue {
  lukk: () => void
}

export const DropdownContext = React.createContext<DropdownContextValue>({
  lukk: () => {},
})

export const Dropdown: React.FC<DropdownProps> = ({
  className,
  onClick,
  children,
  orientering = PopoverOrientering.Under,
  labelRenderer = (ekspandert, onClickWrapper) => (
    <EnkelKnapp onClick={onClickWrapper}>
      {'Meny'}
      {<NavFrontendChevron type={ekspandert ? 'opp' : 'ned'} />}
    </EnkelKnapp>
  ),
}) => {
  const [anchor, setAnchor] = useState<HTMLElement | undefined>(undefined)

  const onClickWrapper = (event: React.MouseEvent<HTMLElement>) => {
    onClick?.(event)
    !anchor ? setAnchor(event.currentTarget) : setAnchor(undefined)
  }

  const lukk = () => {
    setAnchor(undefined)
  }

  return (
    <div className={classNames(className)}>
      {/*labelRenderer(anchor !== undefined, onClickWrapper)*/}
      <DropdownContext.Provider value={{ lukk }}>
        <Popover
          tabIndex={-1}
          orientering={orientering}
          utenPil
          ankerEl={anchor}
          autoFokus={false}
          onRequestClose={lukk}
          avstandTilAnker={3}
        >
          <Liste>{children}</Liste>
        </Popover>
      </DropdownContext.Provider>
    </div>
  )
}
