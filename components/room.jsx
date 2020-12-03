import { useContext, useState, useEffect, useRef } from 'react'
import { settingsContext } from 'components/settings'
import connect from 'components/client'
import { isEqual } from 'lodash';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const getToken = async ({ env, room }) => {
  const endpoint = process.env.NEXT_PUBLIC_TOKEN_ENDPOINT
  const { token } = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ room_id: room, peer_id: 'demo', env }),
  })
    .then((response) => response.json())
    .catch((err) => console.warn('Error client token: ', err))
  return token
}

const VideoGrid = (props) => {
  return <div>Grid</div>
}

const Controls = (props) => {
  return <div>Controls</div>
}

const Room = ({ room, env, handleRoomLeave }) => {
  const { settings } = useContext(settingsContext)
  const [client, setClient] = useState(null)
  const userName = settings.userName
  const oldSettings = usePrevious(settings)

  useEffect(() => {
    getToken({ env, room }).then(
      connect({ endpoint: `wss://${env}.brytecam.com`, userName, room, settings })
    ).then(setClient)
    return () => {
      console.log("CLEAN UP!!")
      if(client) {
        client.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if(client && settings && !isEqual(oldSettings, settings)) {
      client.applyConstraints({
        bitrate: settings.video.bitrate,
        frameRate:settings.video.frameRate,
        resolution: settings.video.reolution
      })
    }
  },[client, settings])

  if(!client) {
    return <div>Joining&hellip;</div>
  }

  // TODO: Remove this after testing
  window.client = client

  return (
    <div>
      <VideoGrid />
      <Controls />
    </div>
  )
}

export default Room
