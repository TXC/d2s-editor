import {Alert} from 'react-bootstrap'
import {notificationType} from '../hooks/Notifications'
import {Hook} from './App'

type MessageProps = {
  hook: Hook
  message: notificationType
  idx: number
}
const Message = ({message, idx, hook}: MessageProps) => {
  return (
    <Alert
      variant={message.alert}
      onClose={() => hook.notification.removeNotification(idx)}
      dismissible
    >
      <p>{message.message}</p>
    </Alert>
  )
}

type MessageViewerProp = {
  hook: Hook
}
const MessageViewer = ({hook}: MessageViewerProp) => {
  return (
    <>
      {
        hook.notification.notifications.map((message, idx: number) => {
          return (
            <Message
              key={`Message${idx}`}
              idx={idx}
              hook={hook}
              message={message}
            />
          )
        })
      }
    </>
  )
}

export default MessageViewer
