import {Hook, paste} from '../App'
import * as React from 'react'
import {D2CItem, ItemPack} from '../../types'
import utils from '../../utils'
import * as d2s from '@dschu012/d2s'
import {Button, Modal} from 'react-bootstrap'
import Item from '../inventory/Item'
import Select from 'react-select'

type ItemPackData = {
  value: string
  label: string
}

const itemPack: ItemPack = utils.getItemPack()
const addItemsPackBases = async (constCategory: object, categoryName: string): Promise<void> => {
  const newItems = [];
  for (const item of Object.entries(constCategory)) {
    if (!item[1].n) {
      continue
    }
    const newItem = Object()
    const value = item[1]
    newItem.type = item[0]
    newItem.quality = 2
    newItem.level = 41
    newItem.inv_width = value.iw
    newItem.inv_height = value.ih
    newItem.categories = value.c
    newItem.identified = 1
    if (newItem.categories.indexOf('Weapon') > -1) {
      newItem.base_damage = {
        'mindam': value.mind,
        'maxdam': value.maxd,
        'twohandmindam': value.min2d,
        'twohandmaxdmm': value.max2d
      }
    }
    if (newItem.categories.indexOf('Any Armor') > -1) {
      newItem.defense_rating = value.maxac
    }
    newItem.max_durability = value.durability
    newItem.current_durability = value.durability
    newItems.push(newItem)
  }

  await d2s.enhanceItems(newItems, window.constants.constants);
  for (const item of newItems) {
    const bytes = await d2s.writeItem(item, 0x60, window.constants.constants)
    const base64 = utils.arrayBufferToBase64(bytes)
    const category = item.categories[0]
    itemPack.push({
      key: './Bases/' + categoryName + '/' + category + '/' + item.type_name + '.d2i',
      value: base64
    })
  }
}

const addItemPacks = (): ItemPackData[] => {
  addItemsPackBases(window.constants.constants.weapon_items, 'Weapons')
  addItemsPackBases(window.constants.constants.armor_items, 'Armor')
  return itemPack.map(item => {
    //const keyName = item.key.replace(/\W/gm, '_')
    return {
      value: item.value,
      label: item.key
    }
  })
}

type AddItemModalProps = {
  hook: Hook
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  paste: paste;
}
const AddItem = ({hook, showModal, setShowModal, paste}: AddItemModalProps) => {
  const [preview, setPreview] = React.useState<D2CItem | null>(null);

  const previewItem = async (itemData: string) => {
    await readItem(utils.b64ToArrayBuffer(itemData), 0x60)
  }
  const onItemFileLoad = async (ev: ProgressEvent<FileReader>) => {
    // @ts-ignore
    const itemData = ev.result
    if (itemData === null) {
      throw 'Invalid data'
    }
    // @ts-ignore
    await readItem(itemData, 0x60);
    if (preview !== null) {
      paste(preview);
    }
  }
  const onItemFileChange = (event: React.FormEvent<HTMLInputElement>) => {
    const itemData = event.currentTarget.files
    const reader = new FileReader();
    if (itemData === null) {
      throw 'Invalid data'
    }
    reader.addEventListener('load', e => onItemFileLoad(e))
    reader.readAsArrayBuffer(itemData[0])
    event.currentTarget.value = '';
    handleClose()
  }
  const readItem = async (bytes: Uint8Array, version: number) => {
    const itemData = await d2s.readItem(bytes, version, window.constants.constants);
    if (itemData === null) {
      throw 'Value is null'
    }
    setPreview(itemData)
    await utils.setPropertiesOnItem(preview);
  }
  const loadBase64Item = async () => {
    try {
      const b64 = prompt('Please enter your base64 string for item.');
      if (b64 === null || b64.length < 1) {
        return;
      }
      const bytes = utils.b64ToArrayBuffer(b64);
      await readItem(bytes, 0x60);
      if (preview !== null) {
        paste(preview);
      }
    } catch (e) {
      alert('Failed to read item.');
    }
    handleClose()
  }
  const loadItem = () => {
    if (preview !== null) {
      paste(preview);
    }
    handleClose()
  }
  const handleClose = () => setShowModal(false);

  const itemPacks = addItemPacks();
  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      dialogClassName={hook.theme.isThemed ? 'theme-d2' : ''}
    >
      <Modal.Header closeButton>
        <Modal.Title>Select an Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row d-flex justify-content-center mt-3 pl-5 pr-5">
          {preview && (
            <Item
              item={preview}
              clazz={'item-edit'}
            />
          )}
        </div>
        <label htmlFor={'ItemSelect'}>Item</label>
        <Select<ItemPackData>
          id={'ItemSelect'}
          onChange={e => { if (e && e.value) { previewItem(e.value) } }}
          className={'react-select-container'}
          classNamePrefix={'react-select'}
          onBlur={(e) => { e.preventDefault(); return false}}
          value={{value: '', label: ''}}
          options={itemPacks}
        />
      </Modal.Body>
      <Modal.Footer>
        <input style={{display: 'none'}} type="file" name="d2iFile" onChange={onItemFileChange} id="d2iFile"/>
        <label htmlFor="d2iFile" className="mb-0 btn btn-primary">Load From File</label>
        <Button variant="primary" onClick={loadBase64Item}>
          Load From String
        </Button>
        <Button variant="primary" onClick={loadItem}>Load</Button>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddItem
