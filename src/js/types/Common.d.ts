import {D2CItem, D2CS} from './d2c'
import * as React from 'react'
import {optionClicked} from './components/App'
import {itemRC} from './components/inventory/Item'

export type EquipDrop = ($event: React.DragEvent, position: number) => void;
export type EquipDragOver = ($event: React.DragEvent) => boolean;
export type EquipDragEnter = ($event: React.DragEvent, position: number) => void;
export type EquipDragLeave = ($event: React.DragEvent, position: number) => void;
export type EquipOnSelect = (item: D2CItem) => void

export type headType = (items: Array<D2CItem>) => D2CItem | undefined;
export type neckType = (items: Array<D2CItem>) => D2CItem | undefined;
export type torsoType = (items: Array<D2CItem>) => D2CItem | undefined;
export type rightHandType = (items: Array<D2CItem>) => D2CItem | undefined;
export type leftHandType = (items: Array<D2CItem>) => D2CItem | undefined;
export type rightFingerType = (items: Array<D2CItem>) => D2CItem | undefined;
export type leftFingerType = (items: Array<D2CItem>) => D2CItem | undefined;
export type waistType = (items: Array<D2CItem>) => D2CItem | undefined;
export type feetType = (items: Array<D2CItem>) => D2CItem | undefined;
export type handsType = (items: Array<D2CItem>) => D2CItem | undefined;
export type altRightHandType = (items: Array<D2CItem>) => D2CItem | undefined;
export type altLeftHandType = (items: Array<D2CItem>) => D2CItem | undefined;

export type equippedType = (saveData: D2CS) => Array<D2CItem>;
export type beltType = (saveData: D2CS) => Array<D2CItem>;
export type inventoryType = (saveData: D2CS) => Array<D2CItem>;
export type stashType = (saveData: D2CS) => Array<D2CItem>;
export type cubeType = (saveData: D2CS) => Array<D2CItem>;
export type mercenaryType = (saveData: D2CS) => Array<D2CItem>;

export type clickHandler = (action: string, props: any) => void;

type RCMenuArguments = {
  optionClicked: optionClicked;
}
export type RCItemMenuType = (props: RCMenuArguments) => JSX.Element;
export type RCGridMenuType = (props: RCMenuArguments) => JSX.Element;

type EquippedItemArguments = {
  id: string;
  className: string;
  position: number;
  itemRC: itemRC;
  selectEvent: EquipOnSelect;
  item?: D2CItem;
  drop?: EquipDrop;
  dragover?: EquipDragOver;
  dragenter?: EquipDragEnter;
  dragleave?: EquipDragLeave;
}
export type EquippedItemType = (props: EquippedItemArguments) => JSX.Element
