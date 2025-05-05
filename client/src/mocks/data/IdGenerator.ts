import type { DBCore, Middleware } from 'dexie'

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
                  if (keyPath === 'oppgaveId') {
                    const oppgavetype = obj['oppgavetype']
                    if (oppgavetype === 'JOURNALFØRING') {
                      obj[keyPath] = `I-${createId()}`
                    } else {
                      obj[keyPath] = `E-${createId()}`
                    }
                  } else {
                    obj[keyPath] = createId()
                  }
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
  const date = new Date()
  return [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
    (++i).toString().padStart(3, '0'),
  ].join('')
}
