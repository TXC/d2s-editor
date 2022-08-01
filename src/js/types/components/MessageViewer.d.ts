import {Variant} from 'react-bootstrap/types'

export type notificationType = {
  alert: Variant;
  message: string;
}

export type addNotification = (data: notificationType) => void
export type removeNotification = (idx: number) => void

type MessageProps = {
  message: notificationType;
  idx: number;
  removeMessage: removeNotification;
}
export type MessageElement = (props: MessageProps) => JSX.Element;

type MessageViewerProps = {
  messages: notificationType[];
  removeMessage: removeNotification;
}
export type MessageViewerElement = (props: MessageViewerProps) => JSX.Element;
