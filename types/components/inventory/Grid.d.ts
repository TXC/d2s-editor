import * as React from 'react';
import { D2CItem } from '../../types';
import type { onEvent } from '../App';
export declare type gridGridRC = ($evt: React.MouseEvent, w: number, h: number) => void;
export declare type gridDragOver = (event: React.DragEvent) => void;
export declare type gridDragEnter = (event: React.DragEvent, ref: React.RefObject<HTMLDivElement>, x: number, y: number) => void;
export declare type gridDragLeave = (event: React.DragEvent, ref: React.RefObject<HTMLDivElement>, x: number, y: number) => void;
export declare type gridDrop = (event: React.DragEvent, ref: React.RefObject<HTMLDivElement>, x: number, y: number) => void;
declare type GridProps = {
    id: string;
    width: number;
    height: number;
    page: number;
    items: D2CItem[];
    selectEvent: React.Dispatch<React.SetStateAction<D2CItem | null>>;
    onEvent: onEvent;
};
declare const Grid: ({ id, width, height, page, items, selectEvent, onEvent }: GridProps) => JSX.Element;
export default Grid;
