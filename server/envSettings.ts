const fsExtra = require('fs-extra')

const createEnvSettingsFile = (settingsPath: string) => {
  console.log(`LAGER FIL x...`)
  console.log('settingsPath:', settingsPath)
  fsExtra
    .ensureFile(settingsPath)
    .then(() => {
      console.log('success!')
      fsExtra.writeFileSync(
        settingsPath,
        `
        window.appSettings = {
          MILJO: ${process.env.NAIS_CLUSTER_NAME},
          USE_MSW: ${process.env.USE_MSW},
          foobar: true
        }
      `
      )
    })
    .catch((err: any) => {
      console.error(err)
    })
}

export default createEnvSettingsFile
