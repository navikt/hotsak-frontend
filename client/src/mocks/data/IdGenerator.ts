import type { DBCore, Middleware } from 'dexie'
import { getDayOfYear } from 'date-fns'

export const idGenerator: Middleware<DBCore> = {
  stack: 'dbcore',
  name: 'IdGenerator',
  create(core) {
    return {
      ...core,
      table(tableName) {
        const table = core.table(tableName)
        const { autoIncrement, keyPath } = table.schema.primaryKey
        if (autoIncrement || typeof keyPath !== 'string') {
          return table
        }

        return {
          ...table,
          mutate(req) {
            if (req.type === 'add') {
              req.values = req.values.map((obj) => {
                if (!obj[keyPath]) {
                  obj[keyPath] = createId()
                }
                return obj
              })
            }
            return table.mutate(req)
          },
        }
      },
    }
  },
}

let i = 1

function createId(): string {
  const dayOfYear = getDayOfYear(new Date())
  return [dayOfYear, (++i).toString().padStart(3, '0')].join('')
}
