import {types} from '@dschu012/d2s'
import Item from './Item'
import ItemStatsEditor from './ItemStatsEditor'
import {
  D2CItem,
  MagicPrefix,
  MagicSuffix,
  RareName,
  SetItem,
  UniqueItem,
} from '../../types'
import * as React from 'react'
import {locationType, onEvent} from '../App'

type ItemRowType = {
  n?: string;
  eq1n?: string;
  eq2n?: string;
}
type ItemRow = [
  key: string,
  object: ItemRowType
]
type ItemBasicProps = {
  id: number|string;
  item: D2CItem;
  setSelected: React.Dispatch<React.SetStateAction<D2CItem | null>>;
}
type ItemLocationProps = {
  id: number|string;
  setLocation: React.Dispatch<React.SetStateAction<locationType | null>>;
  location: locationType;
  onMove: () => void;
}
type MagicPrefixRow = {
  v: MagicPrefix | null;
  i: number;
}
type MagicSuffixRow = {
  v: MagicSuffix | null;
  i: number;
}
type RareNameRow = {
  v: RareName | null;
  i: number;
}
type UniqueItemRow = {
  v: UniqueItem | null;
  i: number;
}
type SetItemRow = {
  v: SetItem | null;
  i: number;
}

const ItemRows = (entries: Array<ItemRowType>) => {
  const Items: Array<ItemRow> = Object.entries(entries)
  const ItemsRows: Array<JSX.Element> = []
  for(const [key, object] of Items) {
    if (!object.n) {
      continue
    }
    const ItemRow = (
      <option value={key} key={key}>{object.n}</option>
    )
    ItemsRows.push(ItemRow)
  }
  return ItemsRows
}

const ItemBooleanAttributes = ({id, item, setSelected}: ItemBasicProps) => {
  return (
    <div className="form-row mb-3">
      <div className="col-md-12">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            id={`Compact${id}`}
            defaultChecked={item.simple_item === 1}
            value={1}
            onChange={e => {
              const newItem = item
              newItem.simple_item = Number(e.currentTarget.value)
              setSelected(newItem)
            }}
          />
          <label htmlFor={`Compact${id}`} className="form-check-label">Compact</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            id={`Identified${id}`}
            defaultChecked={item.identified === 1}
            value={1}
            onChange={e => {
              const newItem = item
              newItem.identified = Number(e.currentTarget.value)
              setSelected(newItem)
            }}
          />
          <label htmlFor={`Identified${id}`} className="form-check-label">Identified</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            id={`Socketed${id}`}
            defaultChecked={item.socketed === 1}
            value={1}
            onChange={e => {
              const newItem = item
              newItem.socketed = Number(e.currentTarget.value)
              setSelected(newItem)
            }}
          />
          <label htmlFor={`Socketed${id}`} className="form-check-label">Socketed</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            id={`Ethereal${id}`}
            defaultChecked={item.ethereal === 1}
            value={1}
            onChange={e => {
              const newItem = item
              newItem.ethereal = Number(e.currentTarget.value)
              setSelected(newItem)
            }}
          />
          <label htmlFor={`Ethereal${id}`} className="form-check-label">Ethereal</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            id={`Runeword${id}`}
            defaultChecked={item.given_runeword === 1}
            value={1}
            onChange={e => {
              const newItem = item
              newItem.given_runeword = Number(e.currentTarget.value)
              setSelected(newItem)
            }}
          />
          <label htmlFor={`Runeword${id}`} className="form-check-label">Runeword</label>
        </div>
      </div>
    </div>
  )
}

const ItemLocation = ({id, location, setLocation, onMove}: ItemLocationProps) => {
  const locationsRows = [
    { key: 0, value: 'Stored' },
    { key: 1, value: 'Equipped' },
    { key: 4, value: 'Cursor' }
  ].map(l => (
    <option value={l.key} key={`Location${l.key}`}>{l.value}</option>
  ))
  const equippedLocationRows = [
    { key: 1, value: 'Head' },
    { key: 2, value: 'Neck' },
    { key: 3, value: 'Torso' },
    { key: 4, value: 'Right Hand' },
    { key: 5, value: 'Left Hand' },
    { key: 6, value: 'Right Finger' },
    { key: 7, value: 'Left Finger' },
    { key: 8, value: 'Waist' },
    { key: 9, value: 'Boots' },
    { key: 10, value: 'Gloves' },
    { key: 11, value: 'Alternate Right Hand' },
    { key: 12, value: 'Alternate Left Hand' }
  ].map(l => (
    <option value={l.key} key={`EquipLocation${l.key}`}>{l.key}</option>
  ))
  const storagePagesRows = [
    { key: 1, value: 'Inventory' },
    { key: 4, value: 'Cube' },
    { key: 5, value: 'Stash' }
  ].map(l => (
    <option value={l.key} key={`StoragePage${l.key}`}>{l.value}</option>
  ))

  return (
    <div className="form-row">
      <div className="col-md-4">
        <label htmlFor={`Location${id}`}>Location</label>
        <select
          className="form-control"
          id={`Location${id}`}
          defaultValue={location.location}
          onChange={e => {
            const newData = Object.assign({}, location, {location: Number(e.currentTarget.value)})
            setLocation(newData)
          }}
        >
          { locationsRows.length > 0 ? locationsRows : [] }
        </select>
      </div>
      { location.location === 1 && (
        <div className="col-md-4">
          <label htmlFor={`EquippedLocation${id}`}>Equipped Location</label>
          <select
            className="form-control"
            id={`EquippedLocation${id}`}
            defaultValue={location.equipped_location}
            onChange={e => {
              const newData = Object.assign({}, location, {equipped_location: Number(e.currentTarget.value)})
              setLocation(newData)
            }}
          >
            { equippedLocationRows.length > 0 ? equippedLocationRows : [] }
          </select>
        </div>
      )}
      { location.location === 0 && (
        <>
          <div className="col-md-2">
            <label htmlFor={`StorageLocation${id}`}>Storage Location</label>
            <select
              className="form-control"
              id={`StorageLocation${id}`}
              defaultValue={location.storage_page}
              onChange={e => {
                const newData = Object.assign({}, location, {storage_page: Number(e.currentTarget.value)})
                setLocation(newData)
              }}
            >
              { storagePagesRows.length > 0 ? storagePagesRows : [] }
            </select>
          </div>
          <div className="col-md-1">
            <label htmlFor={`X${id}`}>X</label>
            <input
              type="number"
              min="0"
              max="20"
              className="form-control"
              id={`X${id}`}
              defaultValue={location.x}
              onChange={e => {
                const newData = Object.assign({}, location, {x: Number(e.currentTarget.value)})
                setLocation(newData)
              }}
            />
          </div>
          <div className="col-md-1">
            <label htmlFor={`Y${id}`}>Y</label>
            <input
              type="number"
              min="0"
              max="20"
              className="form-control"
              id={`Y${id}`}
              defaultValue={location.y}
              onChange={e => {
                const newData = Object.assign({}, location, {y: Number(e.currentTarget.value)})
                setLocation(newData)
              }}
            />
          </div>
        </>
      )}
      <div>
        <label>&nbsp;</label>
        <button
          type="button"
          className="form-control btn btn-primary"
          onClick={() => onMove()}
        >
          Move Item
        </button>
      </div>
    </div>
  )
}

const ItemType = ({id, item, setSelected}: ItemBasicProps) => {
  const armorItemsRows = ItemRows(window.constants.constants.armor_items)
  const weaponItemsRows = ItemRows(window.constants.constants.weapon_items)
  const otherItemsRows = ItemRows(window.constants.constants.other_items)

  const max = (id: D2CItem) => {
    if (!window.constants.constants.other_items[id.type]) {
      return 1
    }
    const stat = window.constants.constants.other_items[id.type]
    return Number(stat.cMaxStack ?? 1)
  }
  const min = (id: D2CItem) => {
    if (!window.constants.constants.other_items[id.type]) {
      return 0
    }
    const stat = window.constants.constants.other_items[id.type]
    return Number(stat.cMinStack ?? 0)
  }

  return (
    <div className="form-row">
      <div className="col-md-6">
        <label htmlFor={`Type${id}`}>Type</label>
        <select
          className="form-control"
          id={`Type${id}`}
          defaultValue={item.type}
          onChange={e => {
            const newItem = item
            newItem.type = e.currentTarget.value
            setSelected(newItem)
          }}
        >
          <optgroup label="Armor">
            { armorItemsRows.length > 0 ? armorItemsRows : [] }
          </optgroup>
          <optgroup label="Weapons">
            { weaponItemsRows.length > 0 ? weaponItemsRows : [] }
          </optgroup>
          <optgroup label="Misc">
            { otherItemsRows.length > 0 ? otherItemsRows : [] }
          </optgroup>
        </select>
      </div>
      <div className="col-md-4">
        <label htmlFor={`Quantity${id}`}>Quantity</label>
        <input
          type="number"
          className="form-control"
          id={`Quantity${id}`}
          min={min(item)}
          max={max(item)}
          defaultValue={item.quantity ?? 1}
          readOnly={!item.quantity}
          onChange={e => {
            const newItem = item
            newItem.quantity = Number(e.currentTarget.value)
            setSelected(newItem)
          }}
        />
      </div>
    </div>
  )
}

const ItemComplexItem = ({id, item, setSelected}: ItemBasicProps) => {
  const rarityRows = [
    { key: 1, value: 'Low' },
    { key: 2, value: 'Normal' },
    { key: 3, value: 'Superior' },
    { key: 4, value: 'Magic' },
    { key: 5, value: 'Set' },
    { key: 6, value: 'Rare' },
    { key: 7, value: 'Unique' },
    { key: 8, value: 'Crafted' }
  ].map(r => (
    <option value={r.key} key={r.key}>{r.key} - {r.value}</option>
  ))

  return (
    <div className="form-row">
      <div className="col-md-4">
        <label htmlFor={`ILvl${id}`}>Item Level</label>
        <input
          type="number"
          className="form-control"
          id={`ILvl${id}`}
          defaultValue={item.level}
          onChange={e => {
            const newItem = item
            newItem.level = Number(e.currentTarget.value)
            setSelected(newItem)
          }}
        />
      </div>
      <div className="col-md-4">
        <label htmlFor={`Rarity${id}`}>Rarity</label>
        <select
          className="form-control"
          id={`Rarity${id}`}
          defaultValue={item.quality}
          onChange={e => {
            const newItem = item
            newItem.quality = Number(e.currentTarget.value)
            setSelected(newItem)
          }}
        >
          { rarityRows.length > 0 ? rarityRows : [] }
        </select>
      </div>
      { item.socketed !== 0 && (
        <div className="col-md-4">
          <label htmlFor={`Sockets${id}`}>Sockets</label>
          <input
            type="number"
            className="form-control"
            id={`Sockets${id}`}
            defaultValue={item.total_nr_of_sockets}
            min="0"
            max="6"
            onChange={e => {
              const newItem = item
              newItem.total_nr_of_sockets = Number(e.currentTarget.value)
              setSelected(newItem)
            }}
          />
        </div>
      )}
    </div>
  )
}

const ItemCategories = ({id, item, setSelected}: ItemBasicProps) => {
  return (
    <div className="form-row">
      <div className="col-md-4">
        <label htmlFor={`curDur${id}`}>Current durability</label>
        <input
          type="number"
          className="form-control"
          id={`curDur${id}`}
          defaultValue={item.current_durability}
          onChange={e => {
            const newItem = item
            newItem.current_durability = Number(e.currentTarget.value)
            setSelected(newItem)
          }}
        />
      </div>
      <div className="col-md-4">
        <label htmlFor={`maxDur${id}`}>Maximum durability</label>
        <input
          type="number"
          className="form-control"
          id={`maxDur${id}`}
          defaultValue={item.max_durability}
          onChange={e => {
            const newItem = item
            newItem.max_durability = Number(e.currentTarget.value)
            setSelected(newItem)
          }}
        />
        <small className="text-muted form-text">(0 = indestructible)</small>
      </div>
      { item.defense_rating && (
        <div className="col-md-4">
          <label htmlFor={`Def${id}`}>Defense</label>
          <input
            type="number"
            className="form-control"
            id={`Def${id}`}
            defaultValue={item.defense_rating}
            onChange={e => {
              const newItem = item
              newItem.defense_rating = Number(e.currentTarget.value)
              setSelected(newItem)
            }}
          />
        </div>
      )}
      { item.base_damage && item.base_damage.mindam && item.base_damage.maxdam && (
        <div className="col-md-4">
          <label htmlFor={`OHD${id}`}>One-Hand Damage</label>
          <input
            type="text"
            className="form-control"
            id={`OHD${id}`}
            placeholder={`${item.base_damage.mindam} to ${item.base_damage.maxdam}`}
            readOnly={true}
          />
        </div>
      )}
      { item.base_damage && item.base_damage.twohandmindam && item.base_damage.twohandmaxdam && (
        <div className="col-md-4">
          <label htmlFor={`THD${id}`}>Two-Hand Damage</label>
          <input
            type="text"
            className="form-control"
            id={`THD${id}`}
            placeholder={`${item.base_damage.twohandmindam} to ${item.base_damage.twohandmaxdam}`}
            readOnly={true}
          />
        </div>
      )}
    </div>
  )
}

const ItemMagicSettings = ({id, item, setSelected}: ItemBasicProps) => {
  const prefixRows = window.constants.constants.magic_prefixes
    .map((e: MagicPrefix, i: number)=> { return { i:i, v:e }})
    .filter((e: MagicSuffixRow) => typeof e.v?.n !== 'undefined')
    .map((s: MagicPrefixRow) => (
    <option value={s.v?.n ?? ''} key={s.i}>{s.i} - {s.v?.n}</option>
  ))
  const suffixRows = window.constants.constants.magic_suffixes
    .map((e: MagicSuffix, i: number) => { return { i:i, v:e }})
    .filter((e: MagicSuffixRow) => typeof e.v?.n !== 'undefined')
    .map((s: MagicSuffixRow) => (
        <option value={s.v?.n ?? ''} key={s.i}>{s.i} - {s.v?.n}</option>
      )
    )

  return (
    <div className="form-row">
      <div className="col-md-6">
        <label htmlFor={`Prefix${id}`}>Prefix</label>
        <select
          className="form-control"
          id={`Prefix${id}`}
          defaultValue={item.magic_prefix_name}
          onChange={e => {
            const newItem = item
            newItem.magic_prefix_name = String(e.currentTarget.value)
            setSelected(newItem)
          }}
        >
          <option value="0">None</option>
          { prefixRows.length > 0 ? prefixRows : [] }
        </select>
      </div>
      <div className="col-md-6">
        <label htmlFor={`Suffix${id}`}>Suffix</label>
        <select
          className="form-control"
          id={`Suffix${id}`}
          defaultValue={item.magic_suffix_name}
          onChange={e => {
            const newItem = item
            newItem.magic_suffix_name = String(e.currentTarget.value)
            setSelected(newItem)
          }}
        >
          <option value="0">None</option>
          { suffixRows.length > 0 ? suffixRows : [] }
        </select>
      </div>
    </div>
  )
}

const ItemRareCraftedSettings = ({id, item, setSelected}: ItemBasicProps) => {
  const rareNamesRows = window.constants.constants.rare_names
    .map((e: RareName, i: number)=> { return { i:i, v:e }})
    .filter((e: RareNameRow) => typeof e.v?.n !== 'undefined')
    .map((s: RareNameRow) => (
      <option value={s.v?.n ?? ''} key={s.i}>{s.i} - {s.v?.n}</option>
    ))

  return (
    <div className="form-row">
      <div className="col-md-6">
        <label htmlFor={`RareName1-${id}`}>Rare Name 1</label>
        <select
          className="form-control"
          id={`RareName1-${id}`}
          defaultValue={item.rare_name}
          onChange={e => {
            const newItem = item
            newItem.rare_name = String(e.currentTarget.value)
            setSelected(newItem)
          }}
        >
          { rareNamesRows.length > 0 ? rareNamesRows : [] }
        </select>
      </div>
      <div className="col-md-6">
        <label htmlFor={`RareName2-${id}`}>Rare Name 2</label>
        <select
          className="form-control"
          id={`RareName2-${id}`}
          defaultValue={item.rare_name2}
          onChange={e => {
            const newItem = item
            newItem.rare_name2 = String(e.currentTarget.value)
            setSelected(newItem)
          }}
        >
          { rareNamesRows.length > 0 ? rareNamesRows : [] }
        </select>
      </div>
    </div>
  )
}

const ItemSetItemSettings = ({id, item, setSelected}: ItemBasicProps) => {
  const setItemsRows = window.constants.constants.set_items
    .map((e: SetItem, i: number)=> { return { i:i, v:e }})
    .filter((e: SetItemRow) => typeof e.v?.n !== 'undefined')
    .map((s: SetItemRow) => (
      <option value={s.i} key={s.i}>{s.i} - {s.v?.n}</option>
    ))

  return (
    <div className="form-row">
      <div className="col-md-12">
        <label htmlFor={`SetName${id}`}>Set Name</label>
        <select
          className="form-control"
          id={`SetName${id}`}
          defaultValue={item.set_id}
          onChange={e => {
            const newItem = item
            newItem.set_id = Number(e.currentTarget.value)
            setSelected(newItem)
          }}
        >
          { setItemsRows.length > 0 ? setItemsRows : [] }
        </select>
      </div>
    </div>
  )
}

const ItemUniqueItemSettings = ({id, item, setSelected}: ItemBasicProps) => {
  const unqItemsRows = window.constants.constants.unq_items
    .map((e: UniqueItem, i: number)=> { return { i:i, v:e }})
    .filter((e: UniqueItemRow) => typeof e.v?.n !== 'undefined')
    .map((s: UniqueItemRow) => (
        <option value={s.i} key={s.i}>{s.i} - {s.v?.n}</option>
    ))

  return (
    <div className="form-row">
      <div className="col-md-4">
        <label htmlFor={`UniqueName${id}`}>Unique Name</label>
        <select
          className="form-control"
          id={`UniqueName${id}`}
          defaultValue={item.unique_id}
          onChange={e => {
            const newItem = item
            newItem.unique_id = Number(e.currentTarget.value)
            setSelected(newItem)
          }}
        >
          { unqItemsRows.length > 0 ? unqItemsRows : [] }
        </select>
      </div>
    </div>
  )
}

type ItemEditorProps = {
  id: number|string;
  item: D2CItem;
  setSelected: React.Dispatch<React.SetStateAction<D2CItem | null>>;
  setLocation: React.Dispatch<React.SetStateAction<locationType | null>>;
  location: locationType | null;
  callOnEvent: onEvent;
}
const ItemEditor = ({id, item, setSelected, location, setLocation, callOnEvent}: ItemEditorProps) => {
  const onMove = () => {
    if (location === null) {
      return
    }
    callOnEvent({ item: item, location: location, type: 'move' })
  }

  let setAttributesList: Array<JSX.Element> = []
  if (item.set_attributes) {
    setAttributesList = item.set_attributes.map((attribute, idx) => (
      <div key={`SetAttr${idx}`} className="mt-3 border border-light">
        <div>{`Set Stats List ${idx}`}</div>
        <ItemStatsEditor
          key={`SetAttributes-${idx}`}
          itemStats={attribute}
          id={`Set${id}-${idx}`}
          updateStats={(data: types.IMagicProperty[]) => {
            const newItem = item
            newItem.set_attributes[idx] = data
            setSelected(newItem)
          }}
        />
      </div>
    ))
  }

  let socketedItemsList: Array<JSX.Element> = []
  if (item.socketed_items) {
    socketedItemsList = item.socketed_items.map((_, idx) => (
    <div key={`Socketed${idx}`} className="mt-3 border border-light">
        <div>{`Socketed Item ${idx}`}</div>
        <ItemStatsEditor
          key={`SocketedAttributes-${idx}`}
          itemStats={item.socketed_items[idx].magic_attributes}
          id={`Socketed${id}-${idx}`}
          updateStats={(data: types.IMagicProperty[]) => {
            const newItem = item
            newItem.socketed_items[idx].magic_attributes = data
            setSelected(newItem)
          }}
        />
      </div>
    ))
  }

  return (
    <div>
      <div className="row d-flex justify-content-center mb-3">
        <Item
          id="item-editor"
          item={item}
          clazz="item item-edit"
        />
      </div>
      <ItemBooleanAttributes id={id} item={item} setSelected={setSelected} />
      {/* <div className="form-row" ref="moveItemErrors"/> */ }
      { location && (
        <ItemLocation
          id={id}
          setLocation={setLocation}
          location={location}
          onMove={onMove}
        />
      )}
      <ItemType id={id} item={item} setSelected={setSelected}/>
      { !item.simple_item && (
      <div>
        <ItemComplexItem id={id} item={item} setSelected={setSelected}/>

        { item.categories && (item.categories.indexOf('Any Armor') > -1 || item.categories.indexOf('Weapon') > -1) && (
          <ItemCategories id={id} item={item} setSelected={setSelected}/>
        )}
        { item.quality === 4 && (
          <ItemMagicSettings id={id} item={item} setSelected={setSelected}/>
        )}
        { item.quality === 6 || item.quality === 8 && (
          <ItemRareCraftedSettings id={id} item={item} setSelected={setSelected}/>
        )}
        {/* crashes game */}
        { item.quality === 5 && (
          <ItemSetItemSettings id={id} item={item} setSelected={setSelected}/>
        )}
        { item.quality === 7 && (
          <ItemUniqueItemSettings id={id} item={item} setSelected={setSelected}/>
        )}

        { item.magic_attributes && (
          <div id="magic_attributes" className="mt-3 border border-light">
            <div>Item Stats</div>
            <ItemStatsEditor
              key="MagicAttributes"
              itemStats={item.magic_attributes}
              id={`Magic${id}`}
              updateStats={(data: types.IMagicProperty[]) => {
                const newItem = item
                newItem.magic_attributes = data
                setSelected(newItem)
              }}
            />
          </div>
        )}
        { item.runeword_attributes && (
          <div id="runeword_attributes" className="mt-3 border border-light">
            <div>Runeword Stats</div>
            <ItemStatsEditor
              key="RunewordAttributes"
              itemStats={item.runeword_attributes}
              id={`Runeword${id}`}
              updateStats={(data: types.IMagicProperty[]) => {
                const newItem = item
                newItem.runeword_attributes = data
                setSelected(newItem)
              }}
            />
          </div>
        )}
        { item.set_attributes && (
          <div id="set_attributes">
            { setAttributesList.length > 0 ? setAttributesList : [] }
          </div>
        )}
        { item.socketed_items && (
          <div id="socketed_items">
            { socketedItemsList.length > 0 ? socketedItemsList : [] }
          </div>
        )}
      </div>
      )}
  </div>
  )
}

export default ItemEditor
