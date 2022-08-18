import * as React from 'react'
import Select, {ActionMeta, PropsValue, SingleValue} from 'react-select'

export type singleProperty = {
  value: string | number
  label: string
}
export type groupProperty = {
  label: string
  options: singleProperty[]
}
type DropDropProps = {
  options: singleProperty[] | groupProperty[]
  value?: PropsValue<singleProperty>
  onChange?: (newValue: SingleValue<singleProperty>, actionMeta: ActionMeta<singleProperty>) => void
}
const DropDown = ({options, value, onChange}: DropDropProps) => {
  const id = React.useId()
  const [state, setState] = React.useState(value)

  return (
    <Select<singleProperty, false, groupProperty>
      id={id}
      onChange={(option, actionMeta) => {
        setState(option)
        if (typeof onChange !== 'undefined') {
          onChange(option, actionMeta)
        }
      }}
      className={'react-select-container'}
      classNamePrefix={'react-select'}
      onBlur={(e) => { e.preventDefault(); return false}}
      value={state}
      options={options}
    />
  )
}

export default DropDown
