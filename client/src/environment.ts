const environment = () => {
  return {
    MILJO: (window as any).appSettings !== undefined ? (window as any).appSettings.MILJO : 'local',
    USE_MSW: (window as any).appSettings !== undefined ? (window as any).appSettings.USE_MSW === 'true' : false,
    foobar: (window as any).appSettings !== undefined ? (window as any).appSettings.foobar : 'defaultfoobar'
  }
}

export default environment()