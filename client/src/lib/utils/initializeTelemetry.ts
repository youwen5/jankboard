import { io } from 'socket.io-client'
import { telemetryStore } from '../stores/telemetryStore'

/**
 * Connects to sockets and subscribes to specified topics to receive telemetry data.
 *
 * @param topics - the topics to subscribe to
 * @param refreshRate - the refresh rate in Hz to be sent to the backend
 * which will be called with the NetworkTable object every time an update is received from the backend.
 */

const onUpdate = (data: TelemetryData) => {
  telemetryStore.update(data)
  // console.log(data)
}

export const initializeTelemetry = (
  topics: TelemetryTopics,
  refreshRate: number
) => {
  // Make sure refreshRate is valid
  if (!Number.isInteger(refreshRate) || refreshRate < 1) {
    throw new Error(
      'refreshRate must be an integer greater than or equal to 1.'
    )
  }

  const socket = io()
  socket.on('connect', () => {
    console.log('Socket-IO connected!')
    socket.emit('subscribe', topics)
    console.log(`Subscribing to topics: ${JSON.stringify(topics)}`)
  })

  socket.on('subscribed', () => {
    console.log('Successfully subscribed to requested topics!')
    socket.emit('request_data', { refresh_rate: refreshRate })
    console.log(`Refreshing at ${refreshRate} Hz`)
  })

  socket.on('telemetry_data', (data: string) => {
    onUpdate(JSON.parse(data))
  })
}