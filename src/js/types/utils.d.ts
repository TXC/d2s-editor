import {D2CItem} from './d2c';

export type UtilsColor = {
    [key: string]: number;
}

export type UtilsColorMap = {
    [key: number]: string;
}

export type contains = (a: Array<number>, b: Array<number>) => boolean
export type overlaps = (a: Array<number>, b: Array<number>) => boolean
export type findIndex = (list: D2CItem[], i: D2CItem) => number
export type setPropertiesOnItem = (item: D2CItem|null) => void;
