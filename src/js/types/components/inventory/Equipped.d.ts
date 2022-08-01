import * as React from 'react'
import {D2CItem} from '../../d2c'
import {onEvent} from '../App'

type AlternativeEquipmentProps = {
  side: string;
  altDisplayed: boolean;
  setAltDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
}
export type AlternativeEquipmentElement = (props: AlternativeEquipmentProps) => JSX.Element

type EquippedProps = {
  id: string;
  items: D2CItem[];
  selectEvent: React.Dispatch<React.SetStateAction<D2CItem | null>>;
  onEvent: onEvent;
}
export type EquippedElement = (props: EquippedProps) => JSX.Element
