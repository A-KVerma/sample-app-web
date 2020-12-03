import { createContext, useContext, useState } from 'react'
import { merge, isEqual, cloneDeep } from 'lodash'

const storage = {
  get: (key) => {
    return JSON.parse(localStorage.getItem(key))
  },
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  },
}

const defaultSettings = {
  audio: {
    deviceId: null,
  },
  video: {
    deviceId: null,
    resolution: 'qvga',
    bandwidth: 256,
    frameRate: 20,
    codec: 'vp8',
  },
  userName:"armaf"
}

const settingsContext = createContext(null)

const SettingsProvider = ({ children }) => {
  const { Provider } = settingsContext
  const savedSettings = storage.get('settings')
  merge(savedSettings, defaultSettings)
  const [settings, setSettings] = useState(savedSettings)

  return (
    <Provider
      value={{
        settings,
        saveSettings: (newSettings) => {
          let mergedSettings = cloneDeep(settings)
          merge(mergedSettings, newSettings) // since this mutates mergedState

          if (!isEqual(mergedSettings, settings)) {
            storage.set('settings', mergedSettings)
            setSettings(mergedSettings)
          }
        },
      }}>
      {children}
    </Provider>
  )
}

const Settings = ({ state }) => {
  const { settings, saveSettings } = useContext(settingsContext)

  return (
    <div>
      <h3>{state}</h3>
      <div>
        <label>frameRate: <input value={settings.video.frameRate} onChange={e=>{
          // saveSettings({
          //   video:{frameRate:Number(e.target.value)}
          // })
        }} /></label>
      </div>
      <pre>{JSON.stringify(settings, null,2)}</pre>
      {state === 'PRE_CALL' && (
        <span>
          Codec: {settings.video.codec} <br />
        </span>
      )}
      <button
        onClick={(e) => {
          saveSettings({ video: { frameRate: 10, bandwidth: 100 } })
        }}>
        save settings
      </button>{' '}
    </div>
  )
}

export default Settings

export { settingsContext, SettingsProvider }
