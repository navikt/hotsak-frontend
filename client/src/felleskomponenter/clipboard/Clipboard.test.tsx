import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useRef } from 'react';

import { Clipboard } from './Clipboard';

let copiedText = '';

// noinspection JSUnusedGlobalSymbols
jest.mock('./writeToClipboard', () => ({
    __esModule: true,
    writeToClipboard: (data: string) => {
        copiedText = data;
        return Promise.resolve();
    },
}));

describe('Clipboard', () => {
    test('kopierer tekstinnhold i children-propen', async () => {
        render(<Clipboard>Denne skal kopieres</Clipboard>);
        await act(async () => {
            const button = screen.getByRole('button');
            await userEvent.click(button);
            expect(copiedText).toEqual('Denne skal kopieres');
        });
    });
    test('kopierer tekstinnhold i elementer i children-propen', async () => {
        render(
            <Clipboard>
                <p>Denne skal kopieres</p>
            </Clipboard>
        );
        await act(async () => {
            const button = screen.getByRole('button');
            await userEvent.click(button);
            expect(copiedText).toEqual('Denne skal kopieres');
        });
    });
    test('tar vekk mellomrom om `preserveWhitespace` === false', async () => {
        render(<Clipboard preserveWhitespace={false}>Denne skal kopieres uten mellomrom</Clipboard>);
        await act(async () => {
            const button = screen.getByRole('button');
            await userEvent.click(button);
            expect(copiedText).toEqual('Denneskalkopieresutenmellomrom');
        });
    });
    test('kopierer tekst fra kilderef om oppgitt', async () => {
        const Container = () => {
            const copyRef = useRef<HTMLParagraphElement>(null);
            return (
                <>
                    <p ref={copyRef}>Denne burde kopieres</p>
                    <Clipboard copySource={copyRef}>Denne skal ikke kopieres</Clipboard>
                </>
            );
        };
        render(<Container />);
        await act(async () => {
            const button = screen.getByRole('button');
            await userEvent.click(button);
            expect(copiedText).toEqual('Denne burde kopieres');
        });
    });
});
