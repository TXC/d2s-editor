import * as React from 'react'
import {D2CItem, D2CS} from '../d2c'
import {gridType} from '../hooks/Grid'
import {notificationType, removeNotification} from './MessageViewer'
import {ItemPack, KeyValue} from '../d2'

export type onFileLoad = (event: ProgressEvent<FileReader>, filename: string) => void
export type onFileChange = (event: React.FormEvent<HTMLInputElement>) => void
export type updateSaveData = (newData: D2CS|null) => void
export type onEvent = (e: D2CEvent) => void;
export type canPlaceItem = (item: D2CItem, loc: number, x: number, y: number) => boolean;
export type onMove = (item: D2CItem, e: D2CEvent) => boolean;
export type findSafeLocation = (item: D2CItem) => Array<number>;
export type deleteItem = (list: D2CItem[], idx: number) => void;
export type paste = (item: D2CItem | null, position?: number[]) => void;
export type saveFile = (version: number) => void;
export type shareItem = (item: D2CItem) => void;
export type newChar = (version: number) => void;
export type readBuffer = (bytes: Uint8Array, filename?: string | null) => void;
export type gridChange = (grid: gridType) => void;
export type D2CEvent = {
  uuid?: string;
  item: D2CItem;
  grid?: Array<number>;
  id?: string;
  location?: locationType,
  type: string;
}
export type locationType = {
  location: number;
  equipped_location?: number;
  x?: number;
  y?: number;
  storage_page?: number;
}
export type updateItemPack = (newData: KeyValue) => void;

type optionClickedProps = {
  type: string;
  item?: D2CItem;
  grid?: Array<number>;
}
export type optionClickedType = (event: optionClickedProps) => void;

export type LocationStorage = {
  locationId: number;
  storagePage: number;
}
export type getLocationBasedOnActiveTab = () => LocationStorage;

type NavbarProps = {
  toggleTheme: () => void;
}
export type NavBarElement = (props: NavbarProps) => JSX.Element;

type CharacterProps = {
  updateSaveData: updateSaveData;
}
export type CharacterElement = (props: CharacterProps) => JSX.Element;

type RowBottomProps = {
  saveData: D2CS | null;
  updateSaveData: updateSaveData;
}
export type RowBottomElement = (props: RowBottomProps) => JSX.Element;

type SelectedItemModalProps = {
  isThemed: boolean;
  selected: D2CItem | null;
  setSelected: React.Dispatch<React.SetStateAction<D2CItem | null>>;
  location: locationType | null;
  callOnEvent: onEvent;
}
export type SelectedItemModalElement = (props: SelectedItemModalProps) => JSX.Element;

type MainContentProps = {
  saveData: D2CS | null;
  updateSaveData: updateSaveData;
  notifications: notificationType[];
  removeNotification: removeNotification;
  gridChange: (grid: gridType) => void;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  onEvent: onEvent;
  selectEvent: React.Dispatch<React.SetStateAction<D2CItem | null>>;
  grid: gridType;
  paste: paste;
  clipboard: D2CItem | null;
  isThemed: boolean;
  itemPack: ItemPack;
}
export type MainElement = (prop: MainContentProps) => JSX.Element;

export type AppElement = () => JSX.Element





