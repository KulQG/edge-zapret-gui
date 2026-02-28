import { ChildProcessWithoutNullStreams, spawn } from 'child_process'

let hiddenProc: ChildProcessWithoutNullStreams | null = null

export const runBatchHidden = async (batFullPath: string): Promise<string> => {
  if (hiddenProc) return 'already running'

  // PowerShell‑команда.  /c — выполнить и выйти.
  const psCmd =
    `
    Start-Process "cmd.exe" ` +
    `-ArgumentList '/c "${batFullPath}"' ` +
    `-WindowStyle Hidden`

  // spawn PowerShell, скрываем её окно (windowsHide:true)
  hiddenProc = spawn(
    'powershell.exe',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', psCmd],
    {
      windowsHide: true, // не показывает окно PowerShell
      stdio: ['pipe', 'pipe', 'pipe'] // будем читать вывод, если нужен
    }
  )

  // ------------------ отладка вывода -----------------
  hiddenProc.stdout.setEncoding('utf8')
  hiddenProc.stderr.setEncoding('utf8')
  hiddenProc.stdout.on('data', (d) => console.log('[BAT]', d))
  hiddenProc.stderr.on('data', (d) => console.error('[BAT-ERR]', d))

  // ----------------- завершение -----------------------
  hiddenProc?.on('error', (err) => {
    hiddenProc = null
    return err
  })
  hiddenProc?.on('close', (code) => {
    console.log('batch finished, code', code)
    hiddenProc = null
    return code
  })

  return ''
}
