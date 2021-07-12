import React from 'react';

import { TekstMedEllipsis } from '../TekstMedEllipsis';
import { Tooltip } from '../Tooltip';
import { CellContent } from '../table/rader/CellContent'
import { capitalize } from '../utils/stringFormating'

interface FunksjonsnedsettelseProps {
    funksjonsnedsettelser: string[];
    saksID: string;
}

export const Funksjonsnedsettelse = React.memo(({  funksjonsnedsettelser , saksID }: FunksjonsnedsettelseProps) => {
    const id = `funksjonsnedsettelse-${saksID}`;
    const funksjonsnedsettelse = capitalize(funksjonsnedsettelser.join(', '))

    return (
        <CellContent width={128} data-for={id} data-tip={funksjonsnedsettelse}>
            <TekstMedEllipsis>{funksjonsnedsettelse}</TekstMedEllipsis>
            {funksjonsnedsettelse.length > 18 && <Tooltip id={id} />}
        </CellContent>
    );
});
