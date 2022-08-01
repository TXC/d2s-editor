import type {updateSaveData} from './App'
import type {D2CS} from '../d2c'
import type React from 'react'

type handleInputChangeFunc = (event: React.ChangeEvent<HTMLInputElement>) => void;

type ItemsProps = {
  id: string;
  saveData: D2CS;
  selectEvent: React.Dispatch<React.SetStateAction<D2CItem | null>>;
}
export type ItemsElement = (props: ItemsProps) => JSX.Element

type MercenaryProps = {
  id: string;
  saveData: D2CS;
  updateSaveData: updateSaveData;
  selectEvent: React.Dispatch<React.SetStateAction<D2CItem | null>>;
}
export type MercenaryElement = (props: MercenaryProps) => JSX.Element
