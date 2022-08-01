import * as React from 'react'
import type {
  altLeftHandType,
  altRightHandType, beltType, cubeType, EquippedItemType, equippedType, feetType,
  handsType, headType, inventoryType, leftFingerType, leftHandType, mercenaryType,
  neckType, rightFingerType, rightHandType, stashType, torsoType, waistType,
  clickHandler, RCItemMenuType, RCGridMenuType,
} from './types/Common'
import InvItem from './components/inventory/Item'
import {types} from '@dschu012/d2s'
import {Menu, Item} from 'react-contexify'

export const head: headType = (items) => {
  return items.find(e => e.equipped_id === 1);
}
export const neck: neckType = (items) => {
  return items.find(e => e.equipped_id === 2);
}
export const torso: torsoType = (items) => {
  return items.find(e => e.equipped_id === 3);
}
export const right_hand: rightHandType = (items) => {
  return items.find(e => e.equipped_id === 4);
}
export const left_hand: leftHandType = (items) => {
  return items.find(e => e.equipped_id === 5);
}
export const right_finger: rightFingerType = (items) => {
  return items.find(e => e.equipped_id === 6);
}
export const left_finger: leftFingerType = (items) => {
  return items.find(e => e.equipped_id === 7);
}
export const waist: waistType = (items) => {
  return items.find(e => e.equipped_id === 8);
}
export const feet: feetType = (items) => {
  return items.find(e => e.equipped_id === 9);
}
export const hands: handsType = (items) => {
  return items.find(e => e.equipped_id === 10);
}
export const alt_right_hand: altRightHandType = (items) => {
  return items.find(e => e.equipped_id === 11);
}
export const alt_left_hand: altLeftHandType = (items) => {
  return items.find(e => e.equipped_id === 12);
}

// location_id == 0 = stored, location_id == 1 = equipped, location_id == 2 = belt
export const equipped: equippedType = (saveData) => {
  return saveData.items.filter((item: types.IItem) => item.location_id === 1)
}
export const belt: beltType = (saveData) => {
  return saveData.items.filter((item: types.IItem) => item.location_id === 2)
}
export const inventory: inventoryType = (saveData) => {
  return saveData.items.filter((item: types.IItem) => item.location_id === 0 && item.alt_position_id === 1)
}
export const stash: stashType = (saveData) => {
  return saveData.items.filter((item: types.IItem) => item.location_id === 0 && item.alt_position_id === 5);
}
export const cube: cubeType = (saveData) => {
  return saveData.items.filter((item: types.IItem) => item.location_id === 0 && item.alt_position_id === 4);
}
export const mercenary: mercenaryType = (saveData) => {
  return saveData.merc_items || [];
}

export const RCItemMenuId = 'RCMENU'
export const RCItemMenu: RCItemMenuType = ({optionClicked}) => {
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
export const RCGridMenu: RCGridMenuType = ({optionClicked}) => {
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

export const EquippedItem: EquippedItemType = ({
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
}) => {
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

