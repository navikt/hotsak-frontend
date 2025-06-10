import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { app } from './app.mjs'
import supertest from 'supertest'
import { ContentType } from './contentType.mjs'
import { server } from './mocks/server.mjs'
import { generateToken } from './testSupport.mjs'

declare module 'supertest' {
  interface Test {
    authorization(token: string): this
    contentType(contentType: string): this
  }
}

// @ts-expect-error module augmentation fungerer ikke
supertest.Test.prototype.authorization = function (token: string) {
  return this.set('Authorization', `Bearer ${token}`)
}

// @ts-expect-error module augmentation fungerer ikke
supertest.Test.prototype.contentType = function (contentType: string) {
  return this.expect('Content-Type', contentType)
}

function request() {
  return supertest(app)
}

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'bypass',
  })
)
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('app', () => {
  test('isalive', async () => {
    const response = await request().get('/isalive').expect(200).contentType(ContentType.Text.Plain)
    expect(response.text).toBe('ALIVE')
  })

  test('isready', async () => {
    const response = await request().get('/isready').expect(200).contentType(ContentType.Text.Plain)
    expect(response.text).toBe('READY')
  })

  test('settings.js', async () => {
    const response = await request().get('/settings.js').expect(200).contentType(ContentType.Application.JavaScript)
    expect(response.text).toContain('window.appSettings')
  })

  describe('protected', () => {
    test('redirect til login hvis token mangler', async () => {
      await request().get('/test').expect(302).expect('Location', '/oauth2/login')
    })

    test('ok hvis token er gyldig', async () => {
      const token = await generateToken()
      await request().get('/test').authorization(token).expect(200)
    })

    test('obo flyt hvis token er gyldig for hm-saksbehandling', async () => {
      const token = await generateToken()
      const response = await request().get('/api/sak/1').authorization(token).expect(200)
      expect(response.body).toEqual({ sakId: '1' })
    })

    test('obo flyt hvis token er gyldig for heit-krukka', async () => {
      const token = await generateToken()
      const response = await request().post('/heit-krukka/api/skjema/1').authorization(token).expect(200)
      expect(response.body).toEqual({ skjemaId: '1' })
    })

    test('reverse proxy for brillekalkulator-api', async () => {
      const token = await generateToken()
      const response = await request().post('/brillekalkulator-api/api/brillesedler').authorization(token).expect(200)
      expect(response.body).toEqual({ sats: 1 })
    })

    test('reverse proxy for finnhjelpemiddel-api', async () => {
      const token = await generateToken()
      const response = await request()
        .post('/finnhjelpemiddel-api/graphql')
        .send({ query: 'query HentProdukter { products { hmsArtNr } }' })
        .authorization(token)
        .expect(200)
      expect(response.body).toEqual({ data: { products: [] } })
    })

    test('reverse proxy for finnalternativprodukt-api', async () => {
      const token = await generateToken()
      const response = await request()
        .post('/finnalternativprodukt-api/graphql')
        .send({ query: 'query FinnAlternativer { alternativeProducts { hmsArtNr } }' })
        .authorization(token)
        .expect(200)
      expect(response.body).toEqual({ data: { products: [] } })
    })
  })
})
