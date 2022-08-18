import * as d2s from '@dschu012/d2s';
import type { D2CItem, ItemPack, CharPack } from './types';
export declare type UtilsColor = {
    [key: string]: number;
};
export declare type UtilsColorMap = {
    [key: number]: string;
};
declare const _default: {
    xp: number[];
    colors: UtilsColor;
    colormaps: UtilsColorMap;
    getItemPack: () => ItemPack;
    getCharPack: () => CharPack;
    b64ToArrayBuffer: (base64: string) => Uint8Array;
    arrayBufferToBase64: (buffer: ArrayBufferLike) => string;
    getPalettes: () => Promise<any>;
    b64PNGFromDC6: (item: d2s.types.IItem) => Promise<string | null>;
    shift: (number: number, shift: number) => number;
    range: (number: number) => number[];
    UUIDv4: () => string;
    contains: (a: number[], b: number[]) => boolean;
    overlaps: (a: number[], b: number[]) => boolean;
    findIndex: (list: D2CItem[], i: D2CItem) => number;
    setPropertiesOnItem: (item: D2CItem | null) => Promise<void>;
};
export default _default;
