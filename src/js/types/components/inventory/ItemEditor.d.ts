import {D2CItem, MagicPrefix, MagicSuffix, RareName, SetItem, UniqueItem} from '../../d2c'
import {locationType, onEvent} from '../App'

type callOnEvent = (type: string, newItem?: D2CItem) => void
export type max = (item: D2CItem) => number
export type min = (item: D2CItem) => number

type ItemRowType = {
  n?: string;
  eq1n?: string;
  eq2n?: string;
}
type ItemRow = [
  key: string,
  object: ItemRowType
]
export type ItemRows = (entries: Array) => Array<JSX.Element>;


export type MagicPrefixRow = {
  v: MagicPrefix | null;
  i: number;
}
export type MagicSuffixRow = {
  v: MagicSuffix | null;
  i: number;
}
export type RareNameRow = {
  v: RareName | null;
  i: number;
}
export type UniqueItemRow = {
  v: UniqueItem | null;
  i: number;
}
export type SetItemRow = {
  v: SetItem | null;
  i: number;
}

type ItemLocationProps = {
  id: number|string;
  location: locationType;
  onMove: () => void;
}
export type ItemLocationElement = (props: ItemLocationProps) => JSX.Element

type ItemBasicProps = {
  id: number|string;
  item: D2CItem;
  onEvent: callOnEvent;
}
export type ItemBasicElement = (props: ItemBasicProps) => JSX.Element

type ItemEditorProps = {
  id: number|string;
  item: D2CItem;
  callOnEvent: onEvent;
  location: locationType | null;
}
export type ItemEditorElement = (props: ItemEditorProps) => JSX.Element
