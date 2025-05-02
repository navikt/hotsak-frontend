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
                      obj[keyPath] = `I-${lagTilfeldigId()}`
                    } else {
                      obj[keyPath] = `E-${lagTilfeldigId()}`
                    }
                  } else {
                    obj[keyPath] = lagTilfeldigId()
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

function lagTilfeldigId(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
