import { useState, useEffect } from 'react'
import Home from 'components/home'
import Room from 'components/room'
import Settings, { SettingsProvider } from 'components/settings'
import { useRouter } from 'next/router'

const App = (props) => {
  const states = {
    PRE_CALL:"PRE_CALL",
    IN_CALL: "IN_CALL",
    POST_CALL: "POST_CALL"
  }
  const [state, setState] = useState(states.PRE_CALL)
  const router = useRouter()
  const { room, env } = router.query

  const handleRoomJoin = () => {
    setState(states.IN_CALL)
  }

  const handleRoomLeave = () => {
    setState(states.POST_CALL)
    // @INFO: Can show feedback etc after the call if needed
  }

  useEffect(() => {
    if (room && env) {
      let getCameraPermissionState = navigator.permissions.query({ name: 'camera' })
      
      getCameraPermissionState.then((result) => {
        if (result.state === 'granted') {
          setState(states.IN_CALL)
        }
      })
    }
  }, [])

  return (
    <div>
      <SettingsProvider>
        {state === states.PRE_CALL && <Home onRoomJoin={handleRoomJoin} />}
        {state === states.IN_CALL && (
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
