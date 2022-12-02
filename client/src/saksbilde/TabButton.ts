import styled from 'styled-components'

export const TabButton = styled.button<{ active?: boolean; disabled?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: none;
  outline: none;
  border: none;
  cursor: pointer;
  padding: 0 13px;
  border-bottom: 1px solid var(--a-border-default);
  transition: background-color 0.1s ease;

  ${(props) =>
    !props.disabled &&
    `
      &:hover {
        background-color: var(--a-bg-subtle);
      }

      &:active {
        background-color: var(--a-bg-subtle);
      }

      &:focus-visible {
        box-shadow: inset 0 0 0 3px var(--a-border-focus);
      }
    `}

  &:before {
    position: absolute;
    content: '';
    background: var(--a-surface-action);
    bottom: 0;
    left: 0;
    height: 0;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    width: 100%;
    transition: height 0.1s ease;
  }

  ${(props) =>
    props.active &&
    `
      &:before {
        height: 4px;
      }
    `}
`
