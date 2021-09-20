import { Etikett, Tekst, Undertittel } from '../../felleskomponenter/typografi';
import { Hendelse } from '../../types/types.internal';
import { formaterDato } from '../../utils/date';
import styled from 'styled-components/macro'


const Container = styled.li`
    margin: 0;
    padding: 16px 0;
    display: flex;

    &:not(:last-of-type) {
        border-bottom: 1px solid var(--navds-color-border);
    }
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
`;


export const HistorikkHendelse = ({ tittel, innhold, timestamp, bruker }: Hendelse) => {
    return (
        <Container>
            <ContentContainer>
                <Etikett>{tittel}</Etikett>
                {timestamp && <Undertittel>{formaterDato(timestamp)}</Undertittel>}
                <Tekst>{innhold}</Tekst>
                <Tekst>{bruker}</Tekst>
            </ContentContainer>
        </Container>
    );
};
