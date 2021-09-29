
export interface SaksbehandlingApiResponse {
  status: number
  data: any
}

const baseUrl = process.env.NODE_ENV === 'production' ? '' : `http://localhost:3001`

type Headers = { [key: string]: any }

export const ResponseError = (statusCode: number, message?: string) => ({
  statusCode,
  message,
})

const getData = async (response: Response) => {
  try {
    return await response.json()
  } catch (e) {
    return undefined
  }
}

const getErrorMessage = async (response: Response) => {
  try {
    return await response.text()
  } catch (e) {
    return undefined
  }
}

const save = async (url: string, method: string, data: any, headere?: Headers): Promise<SaksbehandlingApiResponse> => {
  const response = await fetch(url, {
    method: method,
    headers: {
      ...headere,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (response.status > 400) {
    const message = await getErrorMessage(response)
    throw ResponseError(response.status, message)
  }

  return {
    status: response.status,
    data: await getData(response),
  }
}

export const post = async (url: string, data: any, headere?: Headers): Promise<SaksbehandlingApiResponse> => {
  return save(url, 'POST', data, headere)
}

export const put = async (url: string, data: any, headere?: Headers): Promise<SaksbehandlingApiResponse> => {
  return save(url, 'PUT', data, headere)
}

export const httpGet = async (url: string): Promise<SaksbehandlingApiResponse> => {
  const headers = { headers: { Accept: 'application/json' } }
  const response = await fetch(`${baseUrl}/${url}`, headers)

  if (response.status >= 400) {
    const errorMessage = await getErrorMessage(response)
    throw ResponseError(response.status, errorMessage)
  }

  return {
    status: response.status,
    data: await getData(response),
  }
}

export const postTildeling = async (oppgavereferanse: string) => {
  return post(`${baseUrl}/api/tildeling/${oppgavereferanse}`, {})
}

export const putVedtak = async (saksnummer: string, søknadsbeskrivelse: string, status: VedtakStatusType) => {
  return put(`${baseUrl}/api/vedtak/${saksnummer}`, { søknadsbeskrivelse, status})
}

export const putSendTilGosys = async (saksnummer: string, søknadsbeskrivelse: string) => {
    return put(`${baseUrl}/api/tilbakefoer/${saksnummer}`, { søknadsbeskrivelse})
  }


