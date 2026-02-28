import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'
import { runBatchHidden } from './handlers'
import { execSync } from 'child_process'

// Путь, где будет лежать zapret: AppData/Roaming/ваше-приложение/zapret
const USER_DATA = app.getPath('userData')
export const ZAPRET_DIR = path.join(USER_DATA, 'zapret-discord-youtube-main')
// Ссылка на zip-архив с GitHub (ветка main)
const ZIP_URL = 'https://github.com/Flowseal/zapret-discord-youtube/archive/refs/heads/main.zip'

export const checkZapret = (): boolean => {
  return fs.existsSync(ZAPRET_DIR)
}

export const downloadZapret = async (): Promise<void> => {
  // 1. Скачиваем архив в буфер
  const response = await fetch(ZIP_URL)
  const buffer = Buffer.from(await response.arrayBuffer())

  // 2. Сохраняем временно
  const zipPath = path.join(USER_DATA, 'temp.zip')
  fs.writeFileSync(zipPath, buffer)

  // 3. Распаковываем
  const zip = new AdmZip(zipPath)
  zip.extractAllTo(USER_DATA, true) // Распакуется как папка 'zapret-discord-youtube-main'

  // 4. Удаляем временный zip
  fs.unlinkSync(zipPath)
}
export const getAllConfigs = async (): Promise<string[]> => {
  const configs: string[] = fs.readdirSync(ZAPRET_DIR)

  const result: string[] = []

  for (const configName of configs) {
    if (configName.startsWith('general')) result.push(configName.slice(0, -4))
  }

  return result
}

// Запуск батников (.bat) из папки zapret
export const runZapretScript = (scriptName: string): Promise<string> => {
  return runBatchHidden(path.join(ZAPRET_DIR, scriptName))
}

function unloadWinDivert(): void {
  // Пытаемся выгрузить драйвер, если он уже загружен
  try {
    execSync('sc stop windivert', { stdio: 'ignore' })
  } catch (e) {
    console.warn('WinDivert service not running or not installed, skipping stop.', e)
  }
}

export const updateZapret = async (): Promise<void> => {
  unloadWinDivert()

  if (fs.existsSync(ZAPRET_DIR)) {
    fs.rmSync(ZAPRET_DIR, { recursive: true, force: true })
    console.log('Старая версия удалена')
  }

  await downloadZapret()
  console.log('Новая версия загружена')
}
