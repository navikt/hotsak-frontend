const sequence = (start: number, end: number) => new Array(end - start).fill(start).map((n, i) => n + i);

const moveSequenceTowardsMin = (sequence: number[], minimum: number = 1) => {
    const firstVisiblePage = sequence[0];
    const padding = Math.abs(firstVisiblePage) + 1;
    return firstVisiblePage < minimum ? sequence.map((n) => n + padding) : sequence;
};

const moveSequenceTowardsMax = (tallrekke: number[], maksimum: number) => {
    const lastVisiblePage = tallrekke.slice(-1)[0];
    const padding = lastVisiblePage - maksimum;
    return lastVisiblePage > maksimum ? tallrekke.map((n) => n - padding) : tallrekke;
};

const addEllipsisAtStart = (sequence: (number | string)[]) =>
    sequence[0] > 1 ? [1, '...', ...sequence.slice(2)] : sequence;

const addEllipsisAtEnd = (sequence: (number | string)[], maksimum: number) =>
    sequence.slice(-1)[0] < maksimum ? [...sequence.slice(0, -2), '...', maksimum] : sequence;

export const generatePageNumbers = (
    pagenumber: number,
    totalNumberOfPages: number,
    numberOfVisiblePages: number
) => {

    
    if (numberOfVisiblePages >= totalNumberOfPages) {
        return sequence(1, totalNumberOfPages + 1);
    }

    const start = pagenumber - Math.floor(numberOfVisiblePages / 2);
    const end = start + numberOfVisiblePages;
    let pagenumbers = sequence(start, end);
    pagenumbers = moveSequenceTowardsMin(pagenumbers);
    pagenumbers = moveSequenceTowardsMax(pagenumbers, totalNumberOfPages);
    pagenumbers = addEllipsisAtStart(pagenumbers);
    return addEllipsisAtEnd(pagenumbers, totalNumberOfPages);
};
