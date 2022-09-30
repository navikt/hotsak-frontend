import { rest } from 'msw'

import grunndata from '../mockdata/grunndataGraphQL.json'

const hjelpemiddelHandlers = [
  rest.get<{ hmsnr: string }>(`/api/hjelpemiddel/:hmsnr`, (req, res, ctx) => {
    const hmsnr = req?.params?.hmsnr

    const hjelpemiddel = grunndata
      .filter((arikkel) => arikkel.hmsnr === hmsnr)
      .map((artikkel) => {
        return {
          hmsnr: artikkel.hmsnr,
          navn: artikkel.artikkelnavn,
        }
      })

    if (hmsnr === '404404') {
      return res(ctx.status(404))
    }

    if (hjelpemiddel.length === 0) {
      return res(ctx.status(200), ctx.json({ hmsnr, navn: 'Artikkelnavn fra Oebs' }))
    }

    return res(ctx.status(200), ctx.json(hjelpemiddel[0]))
  }),
]

export default hjelpemiddelHandlers
