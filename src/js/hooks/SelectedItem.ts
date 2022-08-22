import * as React from 'react'
import * as d2s from '@dschu012/d2s'
import {D2CItem} from '../types'

export type locationType = {
  location: number;
  equipped_location?: number;
  x?: number;
  y?: number;
  storage_page?: number;
}
export type SelectedProp = {
  selected: D2CItem | null
  setSelected: React.Dispatch<React.SetStateAction<D2CItem | null>>
}
export type LocationProp = {
  location: locationType | null
  setLocation: React.Dispatch<React.SetStateAction<locationType | null>>
}

export type SelectedItemProp = SelectedProp & LocationProp
export type SelectedItem = () => SelectedItemProp
export default (): SelectedItemProp => {
  const [selected, setSelected] = React.useState<D2CItem | null>(null);
  const [location, setLocation] = React.useState<locationType | null>(null);

  React.useEffect(() => {
    if (selected === null) {
      setLocation(null)
      return;
    }
    setLocation({
      location: selected.location_id,
      equipped_location: selected.equipped_id,
      x: selected.position_x,
      y: selected.position_y,
      storage_page: selected.alt_position_id
    })
    d2s.enhanceItems([selected], window.constants.constants);
  }, [selected])

  React.useDebugValue(JSON.stringify(selected))
  React.useDebugValue(JSON.stringify(location))

  return {selected, setSelected, location, setLocation}
}
