export const Keys = {
    NAME: 'name',
    IDENT: 'NAVident',
    EMAIL: 'email',
    OID: 'oid',
};

export enum CookieKey {
    Name = 'name',
    Ident = 'NAVident',
    Email = 'email',
    Oid = 'oid',
    Groups = 'groups',
}

if (process.env.NODE_ENV === 'development') {
    document.cookie = `speil=dev-cookie.${btoa(
        JSON.stringify({
            name: 'Lokal utvikler',
            NAVident: 'dev-ident',
            email: 'dev@nav.no',
            oid: 'uuid',
            groups: ['gruppe1', 'gruppe2'],
        })
    )}.ignored-part`;
}

const extractToken = (cookie: string) => cookie.split('=')[1].split('.')[1].replace(/%3D/g, '=').replace(/%3d/g, '=');

const transformToUtf8 = (token: string) =>
    // First we get the token as binary, then we encode into an URI component string
    // and finally we decode it into an UTF-8 string.
    // https://stackoverflow.com/a/30106551
    decodeURIComponent(
        atob(token)
            .split('')
            .map((char: any) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );

const decode = (cookie: string) => {
    const token = extractToken(cookie);
    try {
        return JSON.parse(transformToUtf8(token));
    } catch (err) {
        console.warn('error while decoding cookie:', err); // eslint-disable-line no-console
        return null;
    }
};

const extractTokenFromCookie = (tokenName: string): string =>
    document.cookie
        .split(';')
        .filter((item) => item.trim().startsWith(`${tokenName}=`))
        .pop()
        ?.split('=')
        .pop() as string;

export const extractSpeilToken = (): string => extractTokenFromCookie('speil');

export const extractValues = (values: ArrayLike<any>) => {
    const decodedCookie = document.cookie
        .split(';')
        .filter((item) => item.trim().startsWith('speil='))
        .map(decode)
        .pop();

    return decodedCookie ? Array.from(values).map((val) => decodedCookie[val]) : [];
};

export const extractName = () => extractValues([CookieKey.Name]);

export const extractIdent = (): string => extractValues([CookieKey.Ident]).pop();

export const extractGroups = () => extractValues([CookieKey.Groups]).pop() ?? [];
