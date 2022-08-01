import * as React from "react";
import {types} from "@dschu012/d2s";

export type isClass = (id: number, idx: number) => boolean
export type isClassSkill = (id: number, idx: number) => boolean
export type isSkill = (id: number, idx: number) => boolean
export type max = (id: number) => number
export type min = (id: number) => number
export type numValues = (id: number) => number

type add = () => void
type remove = (idx: number) => void
type update = (data: types.IMagicProperty, idx: number) => void
type change = (id: number, values: number[], idx: number) => void
type onChange = (data: types.IMagicProperty[]) => void;


type StatValueProps = {
  id: number;
  itemStat: types.IMagicProperty;
  setContent: React.Dispatch<React.SetStateAction<types.IMagicProperty>>;
  i: number;
}
export type StatValueElement = (props: StatValueProps) => JSX.Element

type StatsRowProps = {
  rowId: number;
  itemStat: types.IMagicProperty;
  update: update;
  remove: remove;
}
export type StatsRowElement = (props: StatsRowProps) => JSX.Element

type ItemStatsEditorProps = {
  itemStats: types.IMagicProperty[];
  id: string;
  onChange: onChange
}
export type ItemStatsEditorElement = (props: ItemStatsEditorProps) => JSX.Element
