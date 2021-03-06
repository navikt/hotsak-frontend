export const Keys = {
  NAME: 'name',
  IDENT: 'NAVident',
  EMAIL: 'email',
  OID: 'oid',
}

export enum CookieKey {
  Name = 'name',
  Ident = 'NAVident',
  Email = 'email',
  Oid = 'oid',
  Groups = 'groups',
}

if (process.env.NODE_ENV === 'development' || process.env.NAIS_CLUSTER_NAME === 'labs-gcp') {
  document.cookie = `hotsak=dev-cookie.${btoa(
    JSON.stringify({
      name: 'Silje Saksbehandler',
      NAVident: 'S112233',
      email: 'dev@nav.no',
      oid: '23ea7485-1324-4b25-a763-assdfdfa',
      groups: ['gruppe1', 'gruppe3'],
    })
  )}.ignored-part`
}

const extractToken = (cookie: string) => cookie.split('=')[1].split('.')[1].replace(/%3D/g, '=').replace(/%3d/g, '=')

const transformToUtf8 = (token: string) =>
  // First we get the token as binary, then we encode into an URI component string
  // and finally we decode it into an UTF-8 string.
  // https://stackoverflow.com/a/30106551
  decodeURIComponent(
    atob(token)
      .split('')
      .map((char: any) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )

const decode = (cookie: string) => {
  const token = extractToken(cookie)
  try {
    return JSON.parse(transformToUtf8(token))
  } catch (err) {
    console.warn('error while decoding cookie:', err)
    return null
  }
}

const extractTokenFromCookie = (tokenName: string): string =>
  document.cookie
    .split(';')
    .filter((item) => item.trim().startsWith(`${tokenName}=`))
    .pop()
    ?.split('=')
    .pop() as string

export const extractHotsakToken = (): string => extractTokenFromCookie('hotsak')

export const extractValues = (values: ArrayLike<any>) => {
  const decodedCookie = document.cookie
    .split(';')
    .filter((item) => item.trim().startsWith('hotsak='))
    .map(decode)
    .pop()

  return decodedCookie ? Array.from(values).map((val) => decodedCookie[val]) : []
}

export const extractName = () => extractValues([CookieKey.Name])

export const extractIdent = (): string => extractValues([CookieKey.Ident]).pop()

export const extractGroups = () => extractValues([CookieKey.Groups]).pop() ?? []
