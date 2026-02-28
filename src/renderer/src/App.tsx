import { useEffect, useState } from 'react'
import { Box, Cascader, Heading, IconButton, Loader, Stack } from 'rsuite'
import PlayOutlineIcon from '@rsuite/icons/PlayOutline'
import ReloadIcon from '@rsuite/icons/Reload'
import SettingHorizontalIcon from '@rsuite/icons/SettingHorizontal'
import 'rsuite/dist/rsuite.css'

const checkZapret = (): Promise<boolean> => window.api.checkReady()
const getConfigs = (): Promise<string[]> => window.api.getConfigs()

const getSavedLocalConfig = (): string | null => localStorage.getItem('prevConfig')

function App(): React.JSX.Element {
  const [installed, setInstalledState] = useState(false)
  const [configs, setConfigs] = useState<string[]>([])
  const [isLoader, setLoader] = useState(true)

  const [selectedConfig, setSelectedConfig] = useState<string | null>(getSavedLocalConfig)

  const installZapret = async (): Promise<void> => {
    setLoader(true)
    await window.api.download()
    const newState = await checkZapret()
    setInstalledState(newState)
    setLoader(false)
  }

  useEffect(() => {
    checkZapret().then((state) => {
      setInstalledState(state)

      if (state) {
        getConfigs().then((state) => {
          setLoader(false)
          setConfigs(state)
        })
      } else {
        installZapret()
      }
      setLoader(false)
    })
  })

  const openZapretBat = (): void => {
    if (selectedConfig) {
      window.api.runScript(selectedConfig)
    }
  }

  const updateZapret = async (): Promise<void> => {
    setLoader(true)
    await window.api.update()
    setLoader(false)
  }

  return (
    <Box padding={20} height={'100%'}>
      {isLoader && <Loader vertical backdrop />}

      <Heading
        textAlign={'center'}
        marginTop={20}
        style={{
          fontSize: '120px',
          fontFamily: 'Hacked',
          lineHeight: 1,
          color: 'white',
          fontWeight: 'normal'
        }}
      >
        ZAPRET
      </Heading>

      <Box flexDirection={'column'} alignItems={'center'} marginTop={'20%'}>
        {installed ? (
          <>
            <Stack
              maxWidth={298}
              display={'grid'}
              justifyContent={'center'}
              gridTemplateColumns={'1fr auto'}
              // gridTemplateColumns={'30% 28px'}
              margin={'auto'}
              marginBottom={20}
              paddingRight={10}
            >
              <Cascader
                size="lg"
                data={configs.map((c) => ({ value: c, label: c }))}
                placeholder={'Выбрать конфиг'}
                columnWidth={226}
                value={selectedConfig}
                width={'100%'}
                onChange={(c) => {
                  setSelectedConfig(c)
                  if (c) {
                    localStorage.setItem('prevConfig', c)
                  }
                }}
              />
              <IconButton
                disabled={!selectedConfig}
                size="lg"
                appearance="primary"
                icon={<PlayOutlineIcon />}
                onClick={openZapretBat}
              />
            </Stack>
            <Stack
              maxWidth={'300px'}
              display={'grid'}
              gridTemplateColumns={'auto auto'}
              margin={'auto'}
            >
              <IconButton onClick={window.api.runService} icon={<SettingHorizontalIcon />}>
                Открыть service
              </IconButton>
              <IconButton
                onClick={updateZapret}
                icon={<ReloadIcon />}
                color="green"
                appearance="primary"
              >
                Обновить
              </IconButton>
            </Stack>
          </>
        ) : (
          <Loader vertical backdrop />
        )}
      </Box>
    </Box>
  )
}

export default App
