import * as React from 'react'
import type {onEvent, Hook} from '../App'
import {
  EquippedItem,
  head,
  neck,
  torso,
  right_hand,
  left_hand,
  right_finger,
  left_finger,
  waist,
  feet,
  hands,
  alt_right_hand,
  alt_left_hand,
  EquipDragEnter, EquipDragLeave, EquipDragOver, EquipDrop
} from '../../Common'
import {D2CItem} from '../../types'

type AlternativeEquipmentProps = {
  side: string;
  altDisplayed: boolean;
  setAltDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
}
const AlternativeEquipment = ({side, altDisplayed, setAltDisplayed}: AlternativeEquipmentProps) => {
  return (
    <span className={`${side}-tab tabs`}>
      <div className="btn-group" role="group">
        <button
          type="button"
          className={`tab btn btn-secondary ${!altDisplayed ? 'active' : ''}`}
          onClick={() => setAltDisplayed(false)}
        >I</button>
        <button
          type="button"
          className={`tab btn btn-secondary ${altDisplayed ? 'active' : ''}`}
          onClick={() => setAltDisplayed(true)}
        >II</button>
      </div>
    </span>
 )
}

type EquippedProps = {
  hook: Hook
  expansion: boolean
  items: D2CItem[]
  onEvent: onEvent
}
const Equipped = ({hook, expansion, items, onEvent}: EquippedProps) => {
  const id = React.useId()
  const [altDisplayed, setAltDisplayed] = React.useState<boolean>(false);

  const dragover: EquipDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    return false;
  }
  const dragenter: EquipDragEnter = (event, ref, equippedLocation) => {
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
        location: 1,
        equipped_location: equippedLocation,
      },
      type: 'dragenter'
    });
  }
  const dragleave: EquipDragLeave = (event, ref) => {
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
      type: 'dragleave'
    });
  }
  const drop: EquipDrop = (event, ref, equippedLocation) => {
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
        location: 1,
        equipped_location: equippedLocation,
      },
      type: 'move'
    });
  }

  return (
    <div className="inventory">
      <EquippedItem
        id={id} hook={hook} className={'head'} item={head(items)} position={1}
        drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave}
      />

      <EquippedItem
        id={id} hook={hook} className={'neck'} item={neck(items)} position={2}
        drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave}
      />

      <EquippedItem
        id={id} hook={hook} className={'torso'} item={torso(items)} position={3}
        drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave}
      />

      { expansion && (
        <AlternativeEquipment side={'right'} altDisplayed={altDisplayed} setAltDisplayed={setAltDisplayed} />
      )}
      { !altDisplayed && (
        <EquippedItem
          id={id} hook={hook} className={'right-hand weapon'} item={right_hand(items)} position={4}
          drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave}
        />
      )}
      { altDisplayed && (
        <EquippedItem
          id={id} hook={hook} className={'alt-right-hand weapon'} item={alt_right_hand(items)} position={11}
          drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave}
        />
      )}

      { expansion && (
        <AlternativeEquipment side={'left'}  altDisplayed={altDisplayed} setAltDisplayed={setAltDisplayed} />
      )}
      { !altDisplayed && (
        <EquippedItem
          id={id} hook={hook} className={'left-hand weapon'} item={left_hand(items)} position={5}
          drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave}
        />
      )}
      { altDisplayed && (
        <EquippedItem
          id={id} hook={hook} className={'alt-left-hand weapon'} item={alt_left_hand(items)} position={12}
          drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave}
        />
      )}

      <EquippedItem
        id={id} hook={hook} className={'right-finger ring'} item={right_finger(items)} position={6}
        drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave}
      />

      <EquippedItem
        id={id} hook={hook} className={'left-finger ring'} item={left_finger(items)} position={7}
        drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave}
      />

      <EquippedItem
        id={id} hook={hook} className={'waist'} item={waist(items)} position={8}
        drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave}
      />

      <EquippedItem
        id={id} hook={hook} className={'feet'} item={feet(items)} position={9}
        drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave}
      />

      <EquippedItem
        id={id} hook={hook} className={'hands'} item={hands(items)} position={10}
        drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave}
      />
    </div>
  )
}

export default Equipped;
