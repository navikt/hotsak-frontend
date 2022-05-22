import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'

import { server } from './_mocks_/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
