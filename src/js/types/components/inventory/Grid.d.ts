import {D2CItem} from '../../d2c'
import * as React from 'react'
import {onEvent} from '../App'

export type gridGridRC = ($evt: React.MouseEvent, w: number, h: number) => void;
export type gridDragOver = (event: React.DragEvent) => void;
export type gridDragEnter = (event: React.DragEvent, x: number, y: number) => void;
export type gridDragLeave = (event: React.DragEvent, x: number, y: number) => void;
export type gridDrop = (event: React.DragEvent, x: number, y: number) => void;

type GridColsProps = {
  id: string;
  rowId: number;
  width: number;
  dragover: gridDragOver;
  dragenter: gridDragEnter;
  dragleave: gridDragLeave;
  gridRC: gridGridRC;
  drop: gridDrop;
}
export type GridColsElement = (props: GridColsProps) => JSX.Element

type GridProps = {
  id: string;
  width: number;
  height: number;
  page: number;
  items: D2CItem[];
  selectEvent: React.Dispatch<React.SetStateAction<D2CItem | null>>;
  onEvent: onEvent;
}
export type GridElement = (props: GridProps) => JSX.Element
