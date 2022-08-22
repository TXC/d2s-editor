import * as React from 'react'
import {D2CItem} from '../types'


export type ClipboardProp = {
  clipboard: D2CItem | null
  setClipboard: React.Dispatch<React.SetStateAction<D2CItem | null>>
}
export type Clipboard = () => ClipboardProp
export default (): ClipboardProp => {
  const [clipboard, setClipboard] = React.useState<D2CItem | null>(null);
  React.useDebugValue(JSON.stringify(clipboard))
  //React.useEffect(() => {
  //}, [clipboard])

  return { clipboard, setClipboard }
}
