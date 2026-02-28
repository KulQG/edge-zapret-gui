import { ElectronAPI } from '@electron-toolkit/preload'

export interface IElectronAPI {
  checkReady: () => Promise<boolean>
  download: () => Promise<boolean>
  runScript: (scriptName: string) => Promise<string>
  runService: () => Promise<boolean>
  getConfigs: () => Promise<string[]>
  update: () => Promise<boolean>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronAPI
  }
}
