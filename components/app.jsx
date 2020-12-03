import { useState, useEffect } from 'react'
import Home from 'components/home'
import Room from 'components/room'
import Settings, { SettingsProvider } from 'components/settings'
import { useRouter } from 'next/router'

const App = (props) => {
  const [state, setState] = useState('PRE_CALL')
  const router = useRouter()
  const { room, env } = router.query

  const handleRoomJoin = () => {
    setState('IN_CALL')
  }

  const handleRoomLeave = () => {
    setState('POST_CALL')
  }

  useEffect(() => {
    if (room && env) {
      let getCameraPermissionState = navigator.permissions.query({ name: 'camera' })
      
      getCameraPermissionState.then((result) => {
        if (result.state === 'granted') {
          setState('IN_CALL')
        }
      })
    }
  }, [])

  return (
    <div>
      <SettingsProvider>
        {state === 'PRE_CALL' && <Home onRoomJoin={handleRoomJoin} />}
        {state === 'IN_CALL' && (
          <Room onRoomLeave={handleRoomLeave} room={room} env={env} />
        )}
        <div className="m-4 p-3 border rounded">
          <Settings state={state} />
        </div>
      </SettingsProvider>
    </div>
  )
}

export default App
