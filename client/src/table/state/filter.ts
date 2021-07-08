//import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  /*tabState, */
  TabType,
} from '../../tabs'
import { InntektskildeType, Oppgave, Periodetype } from '../../types/types.internal'

const tabState = TabType.Alle

export type Filter<T> = {
  label: string
  function: (value: T) => boolean
  active: boolean
  column: number
}

type ActiveFiltersPerTab = {
  [key in TabType]: Filter<Oppgave>[]
}

/*const defaultFilters: Filter<Oppgave>[] = [
    {
        label: 'Ufordelte saker',
        active: false,
        function: (oppgave: Oppgave) => !oppgave.tildeling,
        column: 0,
    },
    {
        label: 'Tildelte saker',
        active: false,
        function: (oppgave: Oppgave) => !!oppgave.tildeling,
        column: 0,
    },
    {
        label: 'Førstegang.',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === Periodetype.Førstegangsbehandling,
        column: 1,
    },
    {
        label: 'Forlengelse.',
        active: false,
        function: (oppgave: Oppgave) =>
            oppgave.periodetype === Periodetype.Forlengelse || oppgave.periodetype === Periodetype.Infotrygdforlengelse,
        column: 1,
    },
    {
        label: 'Forlengelse - IT',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === Periodetype.OvergangFraInfotrygd,
        column: 1,
    },
    {
        label: 'Stikkprøver',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === Periodetype.Stikkprøve,
        column: 1,
    },
    {
        label: 'Risk QA',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === Periodetype.RiskQa,
        column: 1,
    },
    {
        label: 'Revurdering',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === Periodetype.Revurdering,
        column: 1,
    },
    {
        label: 'Én arbeidsgiver',
        active: false,
        function: (oppgave: Oppgave) => oppgave.inntektskilde === InntektskildeType.EnArbeidsgiver,
        column: 3,
    },
    {
        label: 'Flere arbeidsgivere',
        active: false,
        function: (oppgave: Oppgave) => oppgave.inntektskilde === InntektskildeType.FlereArbeidsgivere,
        column: 3,
    },
];*/

const makeFilterActive = (targetFilterLabel: string) => (it: Filter<Oppgave>) =>
  it.label === targetFilterLabel ? { ...it, active: true } : it

/*const activeFiltersPerTab = atom<ActiveFiltersPerTab>({
    key: 'activeFiltersPerTab',
    default: {
        [TabType.TilGodkjenning]: defaultFilters.map(makeFilterActive('Ufordelte saker')),
        [TabType.Mine]: defaultFilters,
        [TabType.Ventende]: defaultFilters,
    },
});*/

/*const filtersState = selector<Filter<Oppgave>[]>({
    key: 'filtersState',
    get: ({ get }) => {
        const tab = get(tabState);
        return get(activeFiltersPerTab)[tab];
    },
    set: ({ get, set }, newValue) => {
        const tab = get(tabState);
        set(activeFiltersPerTab, (filters) => ({ ...filters, [tab]: newValue }));
    },
});*/

//export const useFilters = () => useRecoilValue(filtersState);

/*export const useSetMultipleFilters = () => {
    const setFilters = useSetRecoilState(filtersState);
    return (state: boolean, ...labels: string[]) => {
        setFilters((filters) => filters.map((it) => (labels.includes(it.label) ? { ...it, active: state } : it)));
    };
};*/

/*export const useToggleFilter = () => {
    const setFilters = useSetRecoilState(filtersState);
    return (label: string) =>
        setFilters((filters) => filters.map((it) => (it.label === label ? { ...it, active: !it.active } : it)));
};*/
