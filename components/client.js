import {
  HMSClient,
  HMSClientConfig,
  HMSPeer,
  HMSMediaStreamConstraints,
} from '@100mslive/hmsvideo-web'

const handleLocalStream = async (client,{settings}) => {
  let localStream = await client.getLocalStream({
    codec: settings.video.codec.toUpperCase(),
    resolution: settings.video.resolution,
    bitrate: settings.video.bandwidth,
    frameRate: settings.video.frameRate,
    shouldPublishAudio: true,
    shouldPublishVideo: true,
  })
  return await client.publish(localStream, client.rid);
}

const connect = ({ userName, endpoint, room, settings }) => (token) => {
  const peer = new HMSPeer(userName, token)

  const config = new HMSClientConfig({
    endpoint: endpoint,
  })

  const client = new HMSClient(peer, config)

  client.on('connect', async () => {
    console.log('connected')
    await client.join(room).catch(console.error)
    await handleLocalStream(client,{settings})
  })

  client.on('peer-join', (room, peer) => {
    console.log('Peer Join', `peer => ${peer.name} joined ${room}!`)
  })

  client.on('peer-leave', (room, peer) => {
    console.log('Peer Leave', `peer => ${peer.name} left ${room}!`)
  })
  client.on('stream-add', (room, streamInfo) => {
    console.log('stream-add %s,%s!', room, streamInfo.mid)
  })

  client.on('stream-remove', (room, streamInfo) => {
    console.log(`stream-remove: ${room}, ${streamInfo.mid}`)
  })
  
  client.connect().catch(console.error)

  return client
}

export default connect
