import * as React from 'react'
import {Variant} from 'react-bootstrap/types'

export type notificationType = {
  alert: Variant;
  message: string;
}

export type addNotificationType = (data: notificationType) => void
export type removeNotificationType = (idx: number) => void

export type NotificationProp = {
  notifications: notificationType[]
  addNotification: (data: notificationType) => void
  removeNotification: (idx: number) => void
}
export type Notification = () => NotificationProp
export default (): NotificationProp => {
  const [notifications, setNotification] = React.useState<notificationType[]>([]);

  const addNotification: addNotificationType = (data: notificationType) => {
    setNotification(prev => {
      return [...new Set([data, ...prev])]
    })

  }
  const removeNotification: removeNotificationType = (idx: number) => {
    setNotification(list => {
      list.splice(idx, 1)
      return list
    })
  }

  React.useDebugValue(JSON.stringify(notifications))

  return { notifications, addNotification, removeNotification }
}
