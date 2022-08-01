import * as React from 'react'
import type {AlternativeEquipmentElement, EquippedElement} from '../../types/components/inventory/Equipped'
import type {EquipDragEnter, EquipDragLeave, EquipDragOver, EquipDrop} from '../../types/Common'
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
  RCItemMenuId
} from '../../Common'
import {contextMenu} from 'react-contexify'
import {itemRC} from '../../types/components/inventory/Item'

const AlternativeEquipment: AlternativeEquipmentElement = ({side, altDisplayed, setAltDisplayed}) => {
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

const Equipped: EquippedElement = ({id, items, selectEvent, onEvent}) => {
  const [altDisplayed, setAltDisplayed] = React.useState<boolean>(false);

  const itemRC: itemRC = ($evt, item) => {
    if (item) {
      contextMenu.show({id: RCItemMenuId, event: $evt, props: {item: item}});
    }
  }
  const dragover: EquipDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    return false;
  }
  const dragenter: EquipDragEnter = (event, equippedLocation) => {
    event.preventDefault();
    const dragElementData = localStorage.getItem('dragElement')
    if (dragElementData === null) {
      return;
    }
    const data = JSON.parse(dragElementData)
    onEvent({
      uuid: data.uuid,
      item: data.item,
      id: `${id}-${equippedLocation}`,
      location: {
        location: 1,
        equipped_location: equippedLocation,
      },
      type: 'dragenter'
    });
  }
  const dragleave: EquipDragLeave = (event, equippedLocation) => {
    event.preventDefault();
    const dragElementData = localStorage.getItem('dragElement')
    if (dragElementData === null) {
      return;
    }
    const data = JSON.parse(dragElementData)
    onEvent({
      uuid: data.uuid,
      item: data.item,
      id: `${id}-${equippedLocation}`,
      type: 'dragleave'
    });
  }
  const drop: EquipDrop = (event, equippedLocation) => {
    event.preventDefault();
    const dragElementData = localStorage.getItem('dragElement')
    if (dragElementData === null) {
      return;
    }
    const data = JSON.parse(dragElementData)
    onEvent({
      uuid: data.uuid,
      item: data.item,
      id: `${id}-${equippedLocation}`,
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
        id={id} className={'head'} item={head(items)} position={1}
        drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave} itemRC={itemRC} selectEvent={selectEvent}
      />

      <EquippedItem
        id={id} className={'neck'} item={neck(items)} position={2}
        drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave} itemRC={itemRC} selectEvent={selectEvent}
      />

      <EquippedItem
        id={id} className={'torso'} item={torso(items)} position={3}
        drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave} itemRC={itemRC} selectEvent={selectEvent}
      />

      <AlternativeEquipment side={'right'} altDisplayed={altDisplayed} setAltDisplayed={setAltDisplayed} />
      { !altDisplayed && (
        <EquippedItem
          id={id} className={'right-hand weapon'} item={right_hand(items)} position={4}
          drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave} itemRC={itemRC} selectEvent={selectEvent}
        />
      )}
      { altDisplayed && (
        <EquippedItem
          id={id} className={'alt-right-hand weapon'} item={alt_right_hand(items)} position={11}
          drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave} itemRC={itemRC} selectEvent={selectEvent}
        />
      )}

      <AlternativeEquipment side={'left'}  altDisplayed={altDisplayed} setAltDisplayed={setAltDisplayed} />
      { !altDisplayed && (
        <EquippedItem
          id={id} className={'left-hand weapon'} item={left_hand(items)} position={5}
          drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave} itemRC={itemRC} selectEvent={selectEvent}
        />
      )}
      { altDisplayed && (
        <EquippedItem
          id={id} className={'alt-left-hand weapon'} item={alt_left_hand(items)} position={12}
          drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave} itemRC={itemRC} selectEvent={selectEvent}
        />
      )}

      <EquippedItem
        id={id} className={'right-finger ring'} item={right_finger(items)} position={6}
        drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave} itemRC={itemRC} selectEvent={selectEvent}
      />

      <EquippedItem
        id={id} className={'left-finger ring'} item={left_finger(items)} position={7}
        drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave} itemRC={itemRC} selectEvent={selectEvent}
      />

      <EquippedItem
        id={id} className={'waist'} item={waist(items)} position={8}
        drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave} itemRC={itemRC} selectEvent={selectEvent}
      />

      <EquippedItem
        id={id} className={'feet'} item={feet(items)} position={9}
        drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave} itemRC={itemRC} selectEvent={selectEvent}
      />

      <EquippedItem
        id={id} className={'hands'} item={hands(items)} position={10}
        drop={drop} dragover={dragover} dragenter={dragenter} dragleave={dragleave} itemRC={itemRC} selectEvent={selectEvent}
      />
    </div>
  )
}

export default Equipped;
