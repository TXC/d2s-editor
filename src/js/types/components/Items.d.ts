import {D2CItem, D2CS} from '../d2c'
import * as React from 'react'
import {gridType} from '../hooks/Grid'
import {locationType, gridChange, onEvent, paste} from './App'
import {ItemPack} from '../d2'

type GridRowProps = {
  gridChange: gridChange;
  label: string;
  rowProp: string;
  grid: gridType;
}
export type GridRow = (props: GridRowProps) => JSX.Element;

type GridSettingsProps = {
  gridChange: gridChange;
  grid: gridType;
}
export type GridSettings = (props: GridSettingsProps) => JSX.Element;

type RightMenuProps = {
  gridChange: gridChange;
  grid: gridType;
  clipboard: D2CItem | null;
  paste: paste;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export type RightMenu = (props: RightMenuProps) => JSX.Element;

type AddItemModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isThemed: boolean;
  itemPack: ItemPack;
  paste: paste;
}
export type AddItemElement = (props: AddItemModalProps) => JSX.Element;

type ItemsProps = {
  saveData: D2CS;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  gridChange: gridChange;
  grid: gridType;
  onEvent: onEvent;
  selectEvent: React.Dispatch<React.SetStateAction<D2CItem | null>>;
  clipboard: D2CItem | null;
  paste: paste;
  isThemed: boolean;
  itemPack: ItemPack;
}
export type Items = (props: ItemsProps) => JSX.Element;
