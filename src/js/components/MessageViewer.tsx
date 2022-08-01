//import * as React from 'react';
import {MessageElement, MessageViewerElement} from '../types/components/MessageViewer'
import {Alert} from 'react-bootstrap'

const Message: MessageElement = ({message, idx, removeMessage}) => {
  return (
    <Alert variant={message.alert} onClose={() => removeMessage(idx)} dismissible>
      <p>{message.message}</p>
    </Alert>
  )
}

const MessageViewer: MessageViewerElement = ({messages, removeMessage}) => {
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
