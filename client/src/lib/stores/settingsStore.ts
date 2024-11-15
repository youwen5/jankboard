/* stores global app wide settings */

import { writable } from 'svelte/store'

type SupportedLanguage = 'en-US' | 'en-RU' | 'en-UK'

export interface SettingsStoreData {
  disableAnnoyances: boolean
  goWoke: boolean
  fastStartup: boolean
  randomWeight: number
  voiceLang: SupportedLanguage
  sentry: boolean
  frontCameraAddr: string
  rearCameraAddr: string
}

export const defaults: SettingsStoreData = {
  disableAnnoyances: false, // disable non-critical notifications
  goWoke: true, // go woke (for showing parents or other officials where DEI has taken over), disables "offensive" sequences
  fastStartup: false, // skip the loading splash screen (for development purposes. Setting this from within the app has no effect.)
  randomWeight: 1, // the weight of random events (multiplied by the original probability)
  voiceLang: 'en-UK', // locale-specific voice for alerts
  sentry: false, // protect the robot and operator from foreign threats
  frontCameraAddr: '',
  rearCameraAddr: '',
}

const createSequenceStore = () => {
  const { subscribe, set, update } = writable<SettingsStoreData>(defaults)
  return {
    subscribe,
    update: (
      data: keyof SettingsStoreData,
      newValue: SettingsStoreData[typeof data]
    ) => {
      update(store => {
        // @ts-expect-error
        store[data] = newValue
        return store
      })
    },
    reset: () => set(defaults),
    set: (data: SettingsStoreData) => set(data),
  }
}

export const settingsStore = createSequenceStore()
