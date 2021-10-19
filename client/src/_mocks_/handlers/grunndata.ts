import { rest } from 'msw'

import grunndata from '../mockdata/grunndata.json'

const grunndataHandlers = [
  rest.get(`/grunndata-api/artikkel/:hmsnummer`, (req, res, ctx) => {

    // eslint-disable-next-line eqeqeq
    return res(ctx.status(200), ctx.json(grunndata.filter((artikkel) => artikkel.hmsnr == req.params.hmsnummer)))
  }),
]

export default grunndataHandlers
