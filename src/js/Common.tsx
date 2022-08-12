import * as React from 'react'
import InvItem from './components/inventory/Item'
import {types} from '@dschu012/d2s'
import {Menu, Item} from 'react-contexify'
import type {optionClickedProps} from './components/App'
import type {D2CItem, D2CS} from './types'
import type {itemRC} from './components/inventory/Item'

export const head = (items: D2CItem[]): D2CItem | undefined => {
  return items.find(e => e.equipped_id === 1);
}
export const neck = (items: D2CItem[]): D2CItem | undefined => {
  return items.find(e => e.equipped_id === 2);
}
export const torso = (items: D2CItem[]): D2CItem | undefined => {
  return items.find(e => e.equipped_id === 3);
}
export const right_hand = (items: D2CItem[]): D2CItem | undefined => {
  return items.find(e => e.equipped_id === 4);
}
export const left_hand = (items: D2CItem[]): D2CItem | undefined => {
  return items.find(e => e.equipped_id === 5);
}
export const right_finger = (items: D2CItem[]): D2CItem | undefined => {
  return items.find(e => e.equipped_id === 6);
}
export const left_finger = (items: D2CItem[]): D2CItem | undefined => {
  return items.find(e => e.equipped_id === 7);
}
export const waist = (items: D2CItem[]): D2CItem | undefined => {
  return items.find(e => e.equipped_id === 8);
}
export const feet = (items: D2CItem[]): D2CItem | undefined => {
  return items.find(e => e.equipped_id === 9);
}
export const hands = (items: D2CItem[]): D2CItem | undefined => {
  return items.find(e => e.equipped_id === 10);
}
export const alt_right_hand = (items: D2CItem[]): D2CItem | undefined => {
  return items.find(e => e.equipped_id === 11);
}
export const alt_left_hand = (items: D2CItem[]): D2CItem | undefined => {
  return items.find(e => e.equipped_id === 12);
}

// location_id == 0 = stored, location_id == 1 = equipped, location_id == 2 = belt
export const equipped = (saveData: D2CS): D2CItem[] => {
  return saveData.items.filter((item: types.IItem) => item.location_id === 1)
}
export const belt = (saveData: D2CS): D2CItem[] => {
  return saveData.items.filter((item: types.IItem) => item.location_id === 2)
}
export const inventory = (saveData: D2CS): D2CItem[] => {
  return saveData.items.filter((item: types.IItem) => item.location_id === 0 && item.alt_position_id === 1)
}
export const stash = (saveData: D2CS): D2CItem[] => {
  return saveData.items.filter((item: types.IItem) => item.location_id === 0 && item.alt_position_id === 5);
}
export const cube = (saveData: D2CS): D2CItem[] => {
  return saveData.items.filter((item: types.IItem) => item.location_id === 0 && item.alt_position_id === 4);
}
export const mercenary = (saveData: D2CS): D2CItem[] => {
  return saveData.merc_items || [];
}

type RCMenuArguments = {
  optionClicked: (event: optionClickedProps) => void;
}

type clickHandler = (action: string, props: any) => void;

export const RCItemMenuId = 'RCMENU'
export const RCItemMenu = ({optionClicked}: RCMenuArguments) => {
  const clickHandler: clickHandler = (action, props) => {
    if (!props.item) {
      return
    }
    optionClicked({
      type: action,
      item: props.item,
    });
    return true
  }

  return (
    <Menu id={RCItemMenuId}>
      <Item onClick={({props}) => clickHandler('Select', props)}>Select</Item>
      <Item onClick={({props}) => clickHandler('Copy', props)}>Copy</Item>
      <Item onClick={({props}) => clickHandler('Share', props)}>Share</Item>
      <Item onClick={({props}) => clickHandler('Delete', props)}>Delete</Item>
    </Menu>
  )
}

export const RCGridMenuId = 'PMENU'
export const RCGridMenu = ({optionClicked}: RCMenuArguments) => {
  const clickHandler: clickHandler = (action, props) => {
    if (!props.w || !props.h) {
      return
    }
    optionClicked({
      type: action,
      grid: [props.w, props.h]
    });
  }

  return (
    <Menu id={RCGridMenuId}>
      <Item onClick={({props}) => clickHandler('Paste At', props)}>Paste At</Item>
    </Menu>
  )
}

export type EquipDrop = ($event: React.DragEvent, position: number) => void
export type EquipDragOver = ($event: React.DragEvent) => boolean
export type EquipDragEnter = ($event: React.DragEvent, position: number) => void
export type EquipDragLeave = ($event: React.DragEvent, position: number) => void
export type EquipOnSelect = (item: D2CItem) => void
export type EquippedItemArguments = {
  id: string;
  className: string;
  position: number;
  itemRC: itemRC;
  selectEvent: EquipOnSelect;
  item?: D2CItem;
  drop?: EquipDrop;
  dragover?: EquipDragOver;
  dragenter?: EquipDragEnter;
  dragleave?: EquipDragLeave;
}

export const EquippedItem = ({
  id,
  className,
  item,
  position,
  drop,
  dragover,
  dragenter,
  dragleave,
  itemRC,
  selectEvent
}: EquippedItemArguments) => {
  const ref = React.useRef(null)
  return (
    <span
      ref={ref}
      className={className}
      onDrop={($event) => {
        if (drop) {
          drop($event, position)
        }
      }}
      onDragOver={($event) => {
        if (dragover) {
          dragover($event)
        }
      }}
      onDragEnter={($event) => {
        if (dragenter) {
          dragenter($event, position)
        }
      }}
      onDragLeave={($event) => {
        if (dragleave) {
          dragleave($event, position)
        }
      }}
    >
      <div className={'layer'} id={`${id}-${position}`}></div>
      {item && (
      <InvItem
        id={`Item-${id}-${position}`}
        item={item}
        clickEvent={() => {
          if (selectEvent) {
            selectEvent(item)
          }
        }}
        contextMenuEvent={($event: React.MouseEvent) => {
          if (itemRC) {
            itemRC($event, item)
          }
        }}
      />
      )}
    </span>
  )
}

