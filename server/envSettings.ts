const fs = require('fs')

const createEnvSettingsFile = (path: string)  => {
  fs.writeFileSync(path, `
    window.appSettings = {
      MILJO: '${process.env.NAIS_CLUSTER_NAME}',
      USE_MSW: ${process.env.USE_MSW},
      foobar: true
    }
  `
  )
}

export default createEnvSettingsFile