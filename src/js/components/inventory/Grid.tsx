import * as React from 'react'
import {D2CItem} from '../../types'
import Item from './Item'
import type {onEvent} from '../App'
import type {itemRC} from './Item'
import {contextMenu} from 'react-contexify'
import {RCGridMenuId, RCItemMenuId} from '../../Common'

export type gridGridRC = ($evt: React.MouseEvent, w: number, h: number) => void;
export type gridDragOver = (event: React.DragEvent) => void;
export type gridDragEnter = (event: React.DragEvent, ref: React.RefObject<HTMLDivElement>, x: number, y: number) => void;
export type gridDragLeave = (event: React.DragEvent, ref: React.RefObject<HTMLDivElement>, x: number, y: number) => void;
export type gridDrop = (event: React.DragEvent, ref: React.RefObject<HTMLDivElement>, x: number, y: number) => void;

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
const GridCols = ({id, rowId, width, dragover, dragenter, dragleave, gridRC, drop}: GridColsProps) => {
  const Cols = []
  for (let colId = 0; colId < width; colId++) {
    const ref = React.useRef(null)
    const col = (
      <div
        ref={ref}
        key={`${id}-${colId}-${rowId}`}
        id={`${id}-${colId}-${rowId}`}
        className={`w-1 h-1 y-0 cell x-${colId}`}
        onDrop={event => drop(event, ref, colId, rowId)}
        onDragOver={dragover}
        onDragEnter={event => dragenter(event, ref, colId, rowId)}
        onDragLeave={event => dragleave(event, ref, colId, rowId)}
        onContextMenu={event => gridRC(event, colId, rowId)}
      />
    )
    Cols.push(col)
  }
  return (
    <>
      {Cols}
    </>
  )
}

type GridProps = {
  id: string;
  width: number;
  height: number;
  page: number;
  items: D2CItem[];
  selectEvent: React.Dispatch<React.SetStateAction<D2CItem | null>>;
  onEvent: onEvent;
}
const Grid = ({id, width, height, page, items, selectEvent, onEvent}: GridProps) => {
  const dragover: gridDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    return false;
  }
  const dragenter: gridDragEnter = (event, ref, x: number, y: number) => {
    event.preventDefault()
    const dragElementData = localStorage.getItem('dragElement')
    if (dragElementData === null) {
      return;
    }
    const data = JSON.parse(dragElementData)
    onEvent({
      uuid: data.uuid,
      item: data.item,
      ref: ref,
      location: {
        location: 0,
        x: x - 1,
        y: y - 1,
        storage_page: page
      },
      type: 'dragenter'
    });
  }
  const dragleave: gridDragLeave = (event, ref, x: number, y: number) => {
    event.preventDefault();
    const dragElementData = localStorage.getItem('dragElement')
    if (dragElementData === null) {
      return;
    }
    const data = JSON.parse(dragElementData)
    onEvent({
      uuid: data.uuid,
      item: data.item,
      ref: ref,
      location: {
        location: 0,
        x: x - 1,
        y: y - 1,
        storage_page: page
      },
      type: 'dragleave'
    });
  }
  const itemRC: itemRC = ($evt, item: D2CItem) => {
    contextMenu.show({id: RCItemMenuId, event: $evt, props: {item: item}});
  }
  const gridRC: gridGridRC = ($evt, w: number, h: number) => {
    contextMenu.show({id: RCGridMenuId, event: $evt, props: {w: w - 1, h: h - 1}});
  }
  const drop: gridDrop = (event, ref, x: number, y: number) => {
    event.preventDefault();
    const dragElementData = localStorage.getItem('dragElement')
    if (!dragElementData) {
      return;
    }
    const data = JSON.parse(dragElementData)
    onEvent({
      uuid: data.uuid,
      item: data.item,
      ref: ref,
      location: {
        location: 0,
        x: x - 1,
        y: y - 1,
        storage_page: page
      },
      type: 'move'
    });
  }

  const Rows = []
  for (let i = 0; i < height; i++) {
    const row = (
      <div
        key={`${id}-${i}`}
        className={`h-1 cell y-${i + 1}`}
      >
        <GridCols
          id={id}
          rowId={i}
          width={width}
          dragover={dragover}
          dragenter={dragenter}
          dragleave={dragleave}
          gridRC={gridRC}
          drop={drop}
        />
      </div>
    )
    Rows.push(row);
  }

  const ItemList = items.map((d2item: D2CItem, idx: number) => {
    return (
      <Item
        key={`item-${idx}`}
        item={d2item}
        clickEvent={() => {
          selectEvent(d2item)
        }}
        contextMenuEvent={($event: React.MouseEvent) => itemRC($event, d2item)}
      />
    )
  })
  return (
    <div id="grid" className={`grid w-${width} h-${height}`}>
      {
        Rows.length > 0 ? Rows : []
      }

      {
        ItemList.length > 0 ? ItemList : []
      }
    </div>
  )
}

export default Grid
