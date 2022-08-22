import {EquippedItem, head, torso, right_hand, left_hand, mercenary} from '../Common'
import utils from '../utils'
import React from 'react'
import {D2CS} from '../types'
import {Hook, updateSaveData} from './App'

const nameRogueScouts = [
  'Aliza',
  'Amplisa',
  'Annor',
  'Abhaya',
  'Elly',
  'Paige',
  'Basanti',
  'Blaise',
  'Kyoko',
  'Klaudia',
  'Kundri',
  'Kyle',
  'Visala',
  'Elexa',
  'Floria',
  'Fiona',
  'Gwinni',
  'Gaile',
  'Hannah',
  'Heather',
  'Iantha',
  'Diane',
  'Isolde',
  'Divo',
  'Ithera',
  'Itonya',
  'Liene',
  'Maeko',
  'Mahala',
  'Liaza',
  'Meghan',
  'Olena',
  'Oriana',
  'Ryann',
  'Rozene',
  'Raissa',
  'Sharyn',
  'Shikha',
  'Debi',
  'Tylena',
  'Wendy',
]
const nameDesertMercenaries = [
  'Hazade',
  'Alhizeer',
  'Azrael',
  'Ahsab',
  'Chalan',
  'Haseen',
  'Razan',
  'Emilio',
  'Pratham',
  'Fazel',
  'Jemali',
  'Kasim',
  'Gulzar',
  'Mizan',
  'Leharas',
  'Durga',
  'Neeraj',
  'Ilzan',
  'Zanarhi',
  'Waheed',
  'Vikhyat',
]
const nameEasternSorcerors = [
  'Jelani',
  'Barani',
  'Jabari',
  'Devak',
  'Raldin',
  'Telash',
  'Ajheed',
  'Narphet',
  'Khaleel',
  'Phaet',
  'Geshef',
  'Vanji',
  'Haphet',
  'Thadar',
  'Yatiraj',
  'Rhadge',
  'Yashied',
  'Jarulf',
  'Flux',
  'Scorch',
]
const nameBarbarians = [
  'Varaya',
  'Khan',
  'Klisk',
  'Bors',
  'Brom',
  'Wiglaf',
  'Hrothgar',
  'Scyld',
  'Healfdane',
  'Heorogar',
  'Halgaunt',
  'Hygelac',
  'Egtheow',
  'Bohdan',
  'Wulfgar',
  'Hild',
  'Heatholaf',
  'Weder',
  'Vikhyat',
  'Unferth',
  'Sigemund',
  'Heremod',
  'Hengest',
  'Folcwald',
  'Frisian',
  'Hnaef',
  'Guthlaf',
  'Oslaf',
  'Yrmenlaf',
  'Garmund',
  'Freawaru',
  'Eadgils',
  'Onela',
  'Damien',
  'Erfor',
  'Weohstan',
  'Wulf',
  'Bulwye',
  'Lief',
  'Magnus',
  'Klatu',
  'Drus',
  'Hoku',
  'Kord',
  'Uther',
  'Ip',
  'Ulf',
  'Tharr',
  'Kaelim',
  'Ulric',
  'Alaric',
  'Ethelred',
  'Caden',
  'Elgifu',
  'Tostig',
  'Alcuin',
  'Emund',
  'Sigurd',
  'Gorm',
  'Hollis',
  'Ragnar',
  'Torkel',
  'Wulfstan',
  'Alban',
  'Barloc',
  'Bill',
  'Theodoric',
]

const mercenaryTypes = [
  {type: 'rogue', mercenary: 'Rogue Scout', attribute: 'Fire Arrow', difficulty: 'Normal',},
  {type: 'rogue', mercenary: 'Rogue Scout', attribute: 'Cold Arrow', difficulty: 'Normal',},
  {type: 'rogue', mercenary: 'Rogue Scout', attribute: 'Fire Arrow', difficulty: 'Nightmare',},
  {type: 'rogue', mercenary: 'Rogue Scout', attribute: 'Cold Arrow', difficulty: 'Nightmare',},
  {type: 'rogue', mercenary: 'Rogue Scout', attribute: 'Fire Arrow', difficulty: 'Hell',},
  {type: 'rogue', mercenary: 'Rogue Scout', attribute: 'Cold Arrow', difficulty: 'Hell',},
  {type: 'desert', mercenary: 'Desert Mercenary', attribute: 'Combat', difficulty: 'Normal',},
  {type: 'desert', mercenary: 'Desert Mercenary', attribute: 'Defensive', difficulty: 'Normal',},
  {type: 'desert', mercenary: 'Desert Mercenary', attribute: 'Offensive', difficulty: 'Normal',},
  {type: 'desert', mercenary: 'Desert Mercenary', attribute: 'Combat', difficulty: 'Nightmare',},
  {type: 'desert', mercenary: 'Desert Mercenary', attribute: 'Defensive', difficulty: 'Nightmare',},
  {type: 'desert', mercenary: 'Desert Mercenary', attribute: 'Offensive', difficulty: 'Nightmare',},
  {type: 'desert', mercenary: 'Desert Mercenary', attribute: 'Combat', difficulty: 'Hell',},
  {type: 'desert', mercenary: 'Desert Mercenary', attribute: 'Defensive', difficulty: 'Hell',},
  {type: 'desert', mercenary: 'Desert Mercenary', attribute: 'Offensive', difficulty: 'Hell',},
  {type: 'eastern', mercenary: 'Eastern Sorceror', attribute: 'Fire Spells', difficulty: 'Normal',},
  {type: 'eastern', mercenary: 'Eastern Sorceror', attribute: 'Cold Spells', difficulty: 'Normal',},
  {type: 'eastern', mercenary: 'Eastern Sorceror', attribute: 'Lightning Spells', difficulty: 'Normal',},
  {type: 'eastern', mercenary: 'Eastern Sorceror', attribute: 'Fire Spells', difficulty: 'Nightmare',},
  {type: 'eastern', mercenary: 'Eastern Sorceror', attribute: 'Cold Spells', difficulty: 'Nightmare',},
  {type: 'eastern', mercenary: 'Eastern Sorceror', attribute: 'Lightning Spells', difficulty: 'Nightmare',},
  {type: 'eastern', mercenary: 'Eastern Sorceror', attribute: 'Fire Spells', difficulty: 'Hell',},
  {type: 'eastern', mercenary: 'Eastern Sorceror', attribute: 'Cold Spells', difficulty: 'Hell',},
  {type: 'eastern', mercenary: 'Eastern Sorceror', attribute: 'Lightning Spells', difficulty: 'Hell',},
  {type: 'barbarian', mercenary: 'Barbarian', attribute: '', difficulty: 'Normal',},
  {type: 'barbarian', mercenary: 'Barbarian', attribute: '', difficulty: 'Normal',},
  {type: 'barbarian', mercenary: 'Barbarian', attribute: '', difficulty: 'Nightmare',},
  {type: 'barbarian', mercenary: 'Barbarian', attribute: '', difficulty: 'Nightmare',},
  {type: 'barbarian', mercenary: 'Barbarian', attribute: '', difficulty: 'Hell',},
  {type: 'barbarian', mercenary: 'Barbarian', attribute: '', difficulty: 'Hell',},
]

type ItemsProps = {
  id: string
  hook: Hook
  saveData: D2CS
}
const Items = ({id, hook, saveData}: ItemsProps) => {
  const items = mercenary(saveData)

  return (
    <div className="inventory">
      <EquippedItem
        id={id} hook={hook} className={'head'} item={head(items)} position={1}
      />

      <EquippedItem
        id={id} hook={hook} className={'torso'} item={torso(items)} position={3}
      />

      <EquippedItem
        id={id} hook={hook} className={'right-hand weapon'} item={right_hand(items)} position={4}
      />

      <EquippedItem
        id={id} hook={hook} className={'left-hand weapon'} item={left_hand(items)} position={5}
      />
    </div>
  )
}

type MercenaryProps = {
  id: string
  hook: Hook
  saveData: D2CS
  updateSaveData: updateSaveData
}
const Mercenary = ({id, hook, saveData, updateSaveData}: MercenaryProps) => {
  const mercTypeId = saveData.header.merc_type,
        mercNameId = saveData.header.merc_name_id,
        mercExp = saveData.header.merc_experience ?? 0,
        mercIsDead = saveData.header.dead_merc ?? 0,
        mercType = mercenaryTypes[mercTypeId]
  let mercName, mercLevel;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    const newData = saveData
    // @ts-ignore
    newData.header[name] = value
    updateSaveData(newData)
  }

  switch (mercType.type) {
    case 'rogue':
      mercName = nameRogueScouts[mercNameId]
      break;
    case 'desert':
      mercName = nameDesertMercenaries[mercNameId]
      break;
    case 'eastern':
      mercName = nameEasternSorcerors[mercNameId]
      break;
    case 'barbarian':
      mercName = nameBarbarians[mercNameId]
      break;
    default:
      throw 'Undefined Mercenary Type'
  }

  utils.xp.forEach((xp, idx) => {
    if (utils.xp[idx-1] < mercExp && mercExp > xp) {
      mercLevel = (idx + 1)
    }
  })

  return (
    <div id={id}>
      <div className="form-group mt-2">
        <label htmlFor={'mercenaryname'}>Name</label>
        <input
          type="text"
          className="form-control"
          id={'mercenaryname'}
          placeholder={'Mercenary Name'}
          value={mercName}
          readOnly
          onChange={handleInputChange}
        />
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="checkbox"
          id={'isDead'}
          defaultChecked={mercIsDead === 1}
          value={1}
          readOnly
          onChange={handleInputChange}
        />
        <label className="form-check-label" htmlFor={'isDead'}>Is Dead</label>
      </div>
      <div className="form-row">
        <div className="col-md-2">
          <label htmlFor="mercenaryLevel">Level</label>
          <input
            type="number"
            className="form-control"
            id="mercenaryLevel"
            value={mercLevel}
            readOnly
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2">
          <label htmlFor="mercenaryExperience">Experience</label>
          <input
            type="number"
            className="form-control"
            id="mercenaryExperience"
            defaultValue={mercExp}
            readOnly
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="col-md-2">
          <label htmlFor="mercenaryType">Type</label>
          <input
            type="text"
            className="form-control"
            id="mercenaryType"
            value={mercType.mercenary}
            readOnly
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2">
          <label htmlFor="mercenaryAttribute">Attribute</label>
          <input
            type="text"
            className="form-control"
            id="mercenaryAttribute"
            value={mercType.attribute}
            readOnly
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2">
          <label htmlFor="mercenaryDifficulty">Difficulty</label>
          <input
            type="text"
            className="form-control"
            id="mercenaryDifficulty"
            defaultValue={mercType.difficulty}
            readOnly
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div>
        <Items
          id={id}
          hook={hook}
          saveData={saveData}
        />
      </div>
    </div>
  )
}

export default Mercenary
