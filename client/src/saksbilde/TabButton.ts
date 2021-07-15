
import styled from 'styled-components/macro'

export const TabButton = styled.button<{ active?: boolean }>`
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
    border-bottom: 1px solid var(--navds-color-border);
    transition: background-color 0.1s ease;


    &:before {
        position: absolute;
        content: '';
        background: var(--navds-color-action-default);
        bottom: 0;
        left: 0;
        height: 0;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;   
        width: 100%;
        transition: height 0.1s ease;
    }

    
`;

/*${(props) =>
        props.active &&
        css`
            &:before {
                height: 4px;
            }
        `} */
