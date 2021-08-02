export interface SaksbehandlingApiResponse {
  status: number
  data: any
}

const baseUrl = (process.env.NODE_ENV === 'production'  ? '' : `http://localhost:3001`)

type Headers = { [key: string]: any };

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

export const post = async (url: string, data: any, headere?: Headers): Promise<SaksbehandlingApiResponse> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...headere,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (response.status !== 200 && response.status !== 204) {
    const message = await getErrorMessage(response);
    console.log(response.status, message);

    throw ResponseError(response.status, message);
  }

  return {
    status: response.status,
    data: await getData(response),
  };
};

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
  return post(`${baseUrl}/api/tildeling/${oppgavereferanse}`, {});
};
