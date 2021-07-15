import { writeToClipboard } from './writeToClipboard';

const isText = (node?: HTMLElement | Text) => (node as Text)?.data !== undefined;

const hasTextContent = (node?: HTMLElement) => node?.textContent !== undefined;

const hasInnerText = (node?: HTMLElement) => node?.innerText !== undefined;

const removeSpaces = (s: string) => s.replace(/\s/g, '');

export const copyString = (data: string, preserveWhitespace: boolean) =>
    writeToClipboard(preserveWhitespace ? data : removeSpaces(data))
        .then(() => true)
        .catch(() => false);

const copyContentsFromText = (text: Text, preserveWhitespace: boolean): Promise<boolean> =>
    copyString(text.data, preserveWhitespace);

const copyContentsFromTextContent = (node: HTMLElement, preserveWhitespace: boolean) =>
    copyString(node.textContent as string, preserveWhitespace);

const copyContentsFromInnerText = (node: HTMLElement, preserveWhitespace: boolean) =>
    copyString(node.innerText as string, preserveWhitespace);

export const copyContentsToClipboard = (node?: HTMLElement | Text, preserveWhitespace = true) => {
    if (isText(node)) {
        return copyContentsFromText(node as Text, preserveWhitespace);
    } else if (hasInnerText(node as HTMLElement)) {
        return copyContentsFromInnerText(node as HTMLElement, preserveWhitespace);
    } else if (hasTextContent(node as HTMLElement)) {
        return copyContentsFromTextContent(node as HTMLElement, preserveWhitespace);
    } else {
        return Promise.resolve(false);
    }
};
