import { createPlatePlugin } from 'platejs/react'
import type { Value } from 'platejs'
import type { History } from '@platejs/slate'

interface TabSyncPluginMessage {
  brevId: string
  state: {
    value: Value
    history: History
  }
}

export const TabSyncPlugin = createPlatePlugin({
  key: 'tab-sync',
  enabled: true,
  options: { onChangeLocked: false } as {
    brevId?: string
    onChangeLocked: boolean
  },
}).overrideEditor((ctx) => {
  const { editor, plugin } = ctx

  if (!plugin.options.brevId) {
    plugin.enabled = false
    console.log('Ingen brevId satt opp for breveditor, tab-sync ikke aktivert!')
    return ctx
  }

  const c = new BroadcastChannel('breveditor-tab-sync-plugin')

  c.onmessage = ({ data }: MessageEvent<TabSyncPluginMessage>) => {
    if (data.brevId === plugin.options.brevId) {
      plugin.options.onChangeLocked = true
      editor.tf.setValue(data.state.value)
      editor.history = data.state.history

      // Ikke prosesser de første onChange eventene etter sync fra tab! Vent litt med å åpne igjen slik at denne kan
      // leses i Breveditor.tsx onChange også!
      setTimeout(() => {
        plugin.options.onChangeLocked = false
      }, 100)
    }
  }

  let prevMessage = ''
  plugin.handlers = {
    onChange: ({
      value,
      editor: { history },
      plugin: {
        options: { brevId },
      },
    }) => {
      if (plugin.options.onChangeLocked) {
        return
      }
      let newMessage: TabSyncPluginMessage = {
        brevId: brevId!!,
        state: {
          value,
          history,
        },
      }
      const newMessageSerialized = JSON.stringify(newMessage)
      if (prevMessage && prevMessage == newMessageSerialized) return
      prevMessage = newMessageSerialized
      c.postMessage(newMessage)
    },
  }

  // Unngå duplisering av eventer når man bruker dev-serveren til vitejs og den reloader moduler
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      console.log('Component module is being replaced by HMR, closing BroadcastChannel(breveditor-tab-sync-plugin)')
      c.close()
    })
  }

  return ctx
})
