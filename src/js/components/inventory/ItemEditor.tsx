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
import DropDown, {singleProperty} from '../DropDown'

type ItemRowType = {
  n?: string;
  eq1n?: string;
  eq2n?: string;
}
type ItemRow = [string, ItemRowType]
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

const locationsRows = [
  { value: 0, label: 'Stored' },
  { value: 1, label: 'Equipped' },
  { value: 4, label: 'Cursor' }
]
const equippedLocationRows = [
  { value: 1, label: 'Head' },
  { value: 2, label: 'Neck' },
  { value: 3, label: 'Torso' },
  { value: 4, label: 'Right Hand' },
  { value: 5, label: 'Left Hand' },
  { value: 6, label: 'Right Finger' },
  { value: 7, label: 'Left Finger' },
  { value: 8, label: 'Waist' },
  { value: 9, label: 'Boots' },
  { value: 10, label: 'Gloves' },
  { value: 11, label: 'Alternate Right Hand' },
  { value: 12, label: 'Alternate Left Hand' }
]
const storagePagesRows = [
  { value: 1, label: 'Inventory' },
  { value: 4, label: 'Cube' },
  { value: 5, label: 'Stash' }
]

const ItemRows = (entries: Array<ItemRowType>) => {
  const Items: Array<ItemRow> = Object.entries(entries)
  const ItemsRows: Array<singleProperty> = []
  for(const [key, object] of Items) {
    if (!object.n) {
      continue
    }
    ItemsRows.push({value: key, label: object.n})
  }
  return ItemsRows
}

const ItemBooleanAttributes = ({id, item, setSelected}: ItemBasicProps) => {
  return (
    <div className="row mb-3">
      <div className="col-12">
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
  return (
    <div className="row g-3">
      <div className="col-4">
        <label className="form-label" htmlFor={`Location${id}`}>Location</label>
        <DropDown
          onChange={e => {
            if (e === null) {
              return
            }
            const newData = Object.assign({}, location, {location: Number(e.value)})
            setLocation(newData)
          }}
          value={locationsRows.filter(row => row.value === location.location)}
          options={locationsRows}
        />
      </div>
      { location.location === 1 && (
        <div className="col-6">
          <label className="form-label" htmlFor={`EquippedLocation${id}`}>Equipped Location</label>
          <DropDown
            onChange={e => {
              if (e === null) {
                return
              }
              const newData = Object.assign({}, location, {equipped_location: Number(e.value)})
              setLocation(newData)
            }}
            value={equippedLocationRows.filter(row => row.value === location.equipped_location)}
            options={equippedLocationRows}
          />
        </div>
      )}
      { location.location === 0 && (
        <>
          <div className="col-3">
            <label className="form-label" htmlFor={`StorageLocation${id}`}>Storage Location</label>
            <DropDown
              onChange={e => {
                if (e === null) {
                  return
                }
                const newData = Object.assign({}, location, {storage_page: Number(e.value)})
                setLocation(newData)
              }}
              value={storagePagesRows.filter(row => row.value === location.storage_page)}
              options={storagePagesRows}
            />
          </div>
          <div className="col-3">
            <label className="form-label">Storage position</label>
            <div className="input-group">
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
              <div className="input-group-text">,</div>
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
          </div>
        </>
      )}
      <div className="col-md-2">
        <label className="form-label">&nbsp;</label>
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
  const itemsRows = [
    {
      label: 'Armor',
      options: ItemRows(window.constants.constants.armor_items)
    },
    {
      label: 'Weapons',
      options: ItemRows(window.constants.constants.weapon_items)
    }, {
      label: 'Misc',
      options: ItemRows(window.constants.constants.other_items)
    }
  ]

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

  let itemRow
  itemsRows.forEach(r => {
    const x = r.options.filter(row => row.value == item.type)
    if (x.length > 0) {
      itemRow = x.pop()
    }
  })
  return (
    <div className="row g-3">
      <div className="col-6">
        <label className="form-label" htmlFor={`Type${id}`}>Type</label>
        <DropDown
          onChange={option => {
            if (option !== null) {
              const newItem = item
              newItem.type = String(option.value)
              setSelected(newItem)
            }
          }}
          value={itemRow}
          options={itemsRows}
        />
      </div>
      <div className="col-6">
        <label className="form-label" htmlFor={`Quantity${id}`}>Quantity</label>
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
    { value: 1, label: 'Low' },
    { value: 2, label: 'Normal' },
    { value: 3, label: 'Superior' },
    { value: 4, label: 'Magic' },
    { value: 5, label: 'Set' },
    { value: 6, label: 'Rare' },
    { value: 7, label: 'Unique' },
    { value: 8, label: 'Crafted' }
  ]

  return (
    <div className="row g-3">
      <div className="col-4">
        <label className="form-label" htmlFor={`ILvl${id}`}>Item Level</label>
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
      <div className="col-4">
        <label className="form-label" htmlFor={`Rarity${id}`}>Rarity</label>
        <DropDown
          onChange={option => {
            if (option !== null) {
              const newItem = item
              newItem.quality = Number(option.value)
              setSelected(newItem)
            }
          }}
          value={rarityRows.filter(row => row.value === item.quality).pop()}
          options={rarityRows}
        />
      </div>
      { item.socketed !== 0 && (
        <div className="col-4">
          <label className="form-label" htmlFor={`Sockets${id}`}>Sockets</label>
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
    <div className="row g-3">
      <div className="col-4">
        <label className="form-label" htmlFor={`curDur${id}`}>Current durability</label>
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
      <div className="col-4">
        <label className="form-label" htmlFor={`maxDur${id}`}>Maximum durability</label>
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
        <div className="col-4">
          <label className="form-label" htmlFor={`Def${id}`}>Defense</label>
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
        <div className="col-4">
          <label className="form-label" htmlFor={`OHD${id}`}>One-Hand Damage</label>
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
        <div className="col-4">
          <label className="form-label" htmlFor={`THD${id}`}>Two-Hand Damage</label>
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
    .map((s: MagicPrefixRow) => {
      return {
        value: s.v?.n ?? '',
        label: `${s.i} - ${s.v?.n}`
      }
    })
  const suffixRows = window.constants.constants.magic_suffixes
    .map((e: MagicSuffix, i: number) => { return { i:i, v:e }})
    .filter((e: MagicSuffixRow) => typeof e.v?.n !== 'undefined')
    .map((s: MagicSuffixRow) => {
      return {
        value: s.v?.n ?? '',
        label: `${s.i} - ${s.v?.n}`
      }
    })

  prefixRows.unshift({value: '0', label: 'None'})
  suffixRows.unshift({value: '0', label: 'None'})

  return (
    <div className="row g-3">
      <div className="col-6">
        <label className="form-label" htmlFor={`Prefix${id}`}>Prefix</label>
        <DropDown
          onChange={option => {
            if (option !== null) {
              const newItem = item
              newItem.magic_prefix_name = String(option.value)
              setSelected(newItem)
            }
          }}
          value={prefixRows.filter(row => row.value === item.magic_prefix_name)}
          options={prefixRows}
        />
      </div>
      <div className="col-6">
        <label className="form-label" htmlFor={`Suffix${id}`}>Suffix</label>
        <DropDown
          onChange={option => {
            if (option !== null) {
              const newItem = item
              newItem.magic_suffix_name = String(option.value)
              setSelected(newItem)
            }
          }}
          value={suffixRows.filter(row => row.value === item.magic_suffix_name)}
          options={suffixRows}
        />
      </div>
    </div>
  )
}

const ItemRareCraftedSettings = ({id, item, setSelected}: ItemBasicProps) => {
  const rareNamesRows = window.constants.constants.rare_names
    .map((e: RareName, i: number)=> { return { i:i, v:e }})
    .filter((e: RareNameRow) => typeof e.v?.n !== 'undefined')
    .map((s: RareNameRow) => {
      return {
        value: s.v?.n ?? '',
        label: `${s.i} - ${s.v?.n}`
      }
    })

  return (
    <div className="row g-3">
      <div className="col-6">
        <label className="form-label" htmlFor={`RareName1-${id}`}>Rare Name 1</label>

        <DropDown
          onChange={option => {
            if (option !== null) {
              const newItem = item
              newItem.rare_name = String(option.value)
              setSelected(newItem)
            }
          }}
          value={rareNamesRows.filter(row => row.value === item.rare_name)}
          options={rareNamesRows}
        />
      </div>
      <div className="col-6">
        <label className="form-label" htmlFor={`RareName2-${id}`}>Rare Name 2</label>
        <DropDown
          onChange={option => {
            if (option !== null) {
              const newItem = item
              newItem.rare_name2 = String(option.value)
              setSelected(newItem)
            }
          }}
          value={rareNamesRows.filter(row => row.value === item.rare_name2)}
          options={rareNamesRows}
        />
      </div>
    </div>
  )
}

const ItemSetItemSettings = ({id, item, setSelected}: ItemBasicProps) => {
  const setItemsRows = window.constants.constants.set_items
    .map((e: SetItem, i: number)=> { return { i:i, v:e }})
    .filter((e: SetItemRow) => typeof e.v?.n !== 'undefined')
    .map((s: SetItemRow) => {
      return {
        value: s.i,
        label: `${s.i} - ${s.v?.n}`
      }
    })

  return (
    <div className="row g-3">
      <div className="col-12">
        <label className="form-label" htmlFor={`SetName${id}`}>Set Name</label>
        <DropDown
          onChange={option => {
            if (option !== null) {
              const newItem = item
              newItem.set_id = Number(option.value)
              setSelected(newItem)
            }
          }}
          value={setItemsRows.filter(row => row.value === item.set_id)}
          options={setItemsRows}
        />
      </div>
    </div>
  )
}

const ItemUniqueItemSettings = ({id, item, setSelected}: ItemBasicProps) => {
  const unqItemsRows = window.constants.constants.unq_items
    .map((e: UniqueItem, i: number)=> { return { i:i, v:e }})
    .filter((e: UniqueItemRow) => typeof e.v?.n !== 'undefined')
    .map((s: UniqueItemRow) => {
      return {
        value: s.i,
        label: `${s.i} - ${s.v?.n}`
      }
    })

  return (
    <div className="row g-3">
      <div className="col-4">
        <label className="form-label" htmlFor={`UniqueName${id}`}>Unique Name</label>
        <DropDown
          onChange={option=> {
            if (option !== null) {
              const newItem = item
              newItem.unique_id = Number(option.value)
              setSelected(newItem)
            }
          }}
          value={unqItemsRows.filter(row => row.value === item.unique_id)}
          options={unqItemsRows}
        />
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
      <div key={`${id}SetAttr${idx}`} className="mt-3 border border-light">
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
    <div key={`${id}Socketed${idx}`} className="mt-3 border border-light">
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
    <div className="container">
      <div className="d-flex justify-content-center mb-3">
        <Item
          item={item}
          clazz="item item-edit"
        />
      </div>
      <ItemBooleanAttributes id={id} item={item} setSelected={setSelected} />
      {/* <div className="row" ref="moveItemErrors"/> */ }
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
      <>
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

        { item.magic_attributes && item.magic_attributes.length > 0 && (
          <div id="magic_attributes" className="mt-3 border border-light">
            <div>Item Stats</div>
            <ItemStatsEditor
              key="MagicAttributes"
              itemStats={item.magic_attributes}
              id={`${id}Magic`}
              updateStats={(data: types.IMagicProperty[]) => {
                const newItem = item
                newItem.magic_attributes = data
                setSelected(newItem)
              }}
            />
          </div>
        )}
        { item.runeword_attributes && item.runeword_attributes.length > 0 && (
          <div id="runeword_attributes" className="mt-3 border border-light">
            <div>Runeword Stats</div>
            <ItemStatsEditor
              key="RunewordAttributes"
              itemStats={item.runeword_attributes}
              id={`${id}Runeword`}
              updateStats={(data: types.IMagicProperty[]) => {
                const newItem = item
                newItem.runeword_attributes = data
                setSelected(newItem)
              }}
            />
          </div>
        )}
        { item.set_attributes && item.set_attributes.length > 0 && (
          <div id="set_attributes">
            { setAttributesList.length > 0 ? setAttributesList : [] }
          </div>
        )}
        { item.socketed_items && item.socketed_items.length > 0 && (
          <div id="socketed_items">
            { socketedItemsList.length > 0 ? socketedItemsList : [] }
          </div>
        )}
      </>
      )}
  </div>
  )
}

export default ItemEditor
