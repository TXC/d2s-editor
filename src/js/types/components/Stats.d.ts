import type {D2CS} from '../d2c'
import type {updateSaveData} from './App'
import * as React from 'react'

export type sanitizeName = (e: React.FormEvent<HTMLInputElement>) => void;
export type updateStatus = (key: string, value: number) => void;
export type max = (id: number) => number;
export type min = (id: number) => number;
export type setValue = (id: number, values: any, idx: string) => void;
export type change = (id: number, values: any, idx: string) => D2CS;

export type changeLevel = (val: number, old: number) => D2CS;
export type changeVitality = (val: number, old: number) => D2CS;
export type changeEnergy = (val: number, old: number) => D2CS;

type StatsProps = {
  saveData: D2CS;
  updateSaveData: updateSaveData;
}
export type StatsElement = (props: StatsProps) => JSX.Element;
