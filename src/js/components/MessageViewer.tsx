import {Alert} from 'react-bootstrap'
import {Variant} from 'react-bootstrap/types'

export type addNotification = (data: notificationType) => void
export type removeNotification = (idx: number) => void

export type notificationType = {
  alert: Variant;
  message: string;
}

type MessageProps = {
  message: notificationType;
  idx: number;
  removeMessage: removeNotification;
}
const Message = ({message, idx, removeMessage}: MessageProps) => {
  return (
    <Alert variant={message.alert} onClose={() => removeMessage(idx)} dismissible>
      <p>{message.message}</p>
    </Alert>
  )
}

type MessageViewerProps = {
  messages: notificationType[];
  removeMessage: removeNotification;
}
const MessageViewer = ({messages, removeMessage}: MessageViewerProps) => {
    return (
        <>
            {
                messages.map((message, idx: number) => {
                    return (
                        <Message key={idx} idx={idx} message={message} removeMessage={removeMessage} />
                    )
                })
            }
        </>
    )
}

export default MessageViewer
