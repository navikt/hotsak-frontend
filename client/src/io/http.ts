export interface SaksbehandlingApiResponse {
  status: number
  data: any
}

const baseUrl = (process.env.NODE_ENV === 'production'  ? '' : `http://localhost:3001`)


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
