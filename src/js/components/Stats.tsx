import * as React from 'react'
import utils from '../utils'
import {D2CS} from '../types'
import {updateSaveData} from './App'
import {IAttributes} from '@dschu012/d2s/lib/d2/types'

type StatsProps = {
  saveData: D2CS;
  updateSaveData: updateSaveData;
}
const Stats = ({saveData, updateSaveData}: StatsProps) => {
  const stats = window.constants.constants.magical_properties
  const sanitizeName = (e: React.FormEvent<HTMLInputElement>) => {
    const name = e.currentTarget.value
    if (['_', '-'].includes(name.substring(0, 1))) {
      return
    }
    if (['_', '-'].includes(name.substring(-1, 1))) {
      return
    }
    const newData = saveData
    newData.header.name = name
    updateSaveData(newData)
  }
  const updateStatus = (key: string, value: number) => {
    const newData = saveData
    switch (key) {
      case 'expansion':
        newData.header.status.expansion = (value === 1)
      break;
      case 'ladder':
        newData.header.status.ladder = (value === 1)
      break;
      case 'hardcore':
        newData.header.status.hardcore = (value === 1)
      break;
      case 'died':
        newData.header.status.died = (value === 1)
      break;
      default:
        return
    }
    updateSaveData(newData)
  }

  const setValue = (id: number, value: number, idx: string) => {
    let newData = saveData
    newData.attributes[idx] = value
    newData = change(id, newData.attributes, idx)
    updateSaveData(newData)
  }
  const max = (id: number) => {
    const stat = stats[id]
    let s = utils.shift(1, stat.cB) - 1
    if (stat.vS) {
      s = Math.floor(utils.shift(s, -stat.vS))
    }
    return s
  }
  const min = (id: number) => {
    if (!id) {
      return 0
    }
    const stat = stats[id]
    if (stat) {
      return 0;
    }
    return 0
  }
  const change = (id: number, values: IAttributes, idx: string) => {
    const maxValue = max(id),
      minValue = min(id)

    if (values[idx] > maxValue) {
      values[idx] = maxValue;
    } else if (values[idx] < minValue) {
      values[idx] = minValue;
    }

    let newData
    if (id == 12) { // Level
      newData = changeLevel(values[idx], saveData.header.level)
      //newData.attributes.experience = xp[values[idx] - 1];
    } else if (id == 3) { // Vitality
      newData = changeVitality(values[idx], saveData.attributes.vitality)
    } else if (id == 1) { // Energy
      newData = changeEnergy(values[idx], saveData.attributes.energy)
    } else {
      newData = saveData
      newData.attributes[idx] = values[idx]
    }
    return newData
  }

  const changeLevel = (val: number, old: number) => {
    const newData = saveData
    newData.header.level = val;
    newData.attributes.level = val;
    newData.attributes.experience = utils.xp[val-1];

    const newLevel = val - old;
    newData.attributes.unused_stats = (newData.attributes.unused_stats ?? 0) + (newLevel * 5);
    newData.attributes.unused_skill_points = (newData.attributes.unused_skill_points ?? 0) + newLevel;
    for(const cCode in window.constants.constants.classes) {
      const stat = window.constants.constants.classes[cCode];
      if(stat.n === newData.header.class) {
        newData.attributes.max_hp += newLevel * stat.s.lpl / 4;
        newData.attributes.current_hp += newLevel * stat.s.lpl / 4;

        newData.attributes.max_stamina += newLevel * stat.s.spl / 4;
        newData.attributes.current_stamina += newLevel * stat.s.spl / 4;

        newData.attributes.max_mana += newLevel * stat.s.mpl / 4;
        newData.attributes.current_mana += newLevel * stat.s.mpl / 4;
        break;
      }
    }
    return newData
  }
  const changeVitality = (val: number, old: number) => {
    const newData = saveData
    const change = val-old;
    for (const cCode in window.constants.constants.classes) {
      const stat = window.constants.constants.classes[cCode];
      if (stat.n === newData.header.class) {
        newData.attributes.max_hp += change * stat.s.lpv / 4;
        newData.attributes.current_hp += change * stat.s.lpv / 4;

        newData.attributes.max_stamina += change * stat.s.spv / 4;
        newData.attributes.current_stamina += change * stat.s.spv / 4;
        break;
      }
    }
    return newData
  }
  const changeEnergy = (val: number, old: number) => {
    const newData = saveData
    const change = val-old;
    for (const cCode in window.constants.constants.classes) {
      const stat = window.constants.constants.classes[cCode];
      if (stat.n === newData.header.class) {
        newData.attributes.max_mana += change * stat.s.mpe / 4;
        newData.attributes.current_mana += change * stat.s.mpe / 4;
        break;
      }
    }
    return newData
  }


  return (
    <div>
      <div className="form-group mt-3">
        <label htmlFor={'name'}>Name</label>
        <input
          type="text"
          className="form-control"
          id={'name'}
          placeholder={'Character Name'}
          minLength={2}
          maxLength={15}
          value={`${saveData.header.name}`}
          onChange={sanitizeName}
          required
        />
      </div>
      <div className="row">
        <div className="col">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id={'expansion'}
              defaultChecked={saveData.header.status.expansion}
              value={1}
              onChange={(e) => updateStatus('expansion', Number(e.currentTarget.value))}
            />
            <label className="form-check-label" htmlFor={'expansion'}>Expansion</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id={'ladder'}
              defaultChecked={saveData.header.status.ladder}
              value={1}
              onChange={(e) => updateStatus('ladder', Number(e.currentTarget.value))}
            />
            <label className="form-check-label" htmlFor={'ladder'}>Ladder</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id={'hardcore'}
              defaultChecked={saveData.header.status.hardcore}
              value={1}
              onChange={(e) => updateStatus('hardcore', Number(e.currentTarget.value))}
            />
            <label className="form-check-label" htmlFor={'hardcore'}>Hardcore</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id={'died'}
              defaultChecked={saveData.header.status.died}
              value={1}
              onChange={(e) => updateStatus('died', Number(e.currentTarget.value))}
            />
            <label className="form-check-label" htmlFor={'died'}>Dead</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <label htmlFor="Level">Level</label>
          <input
            type="number"
            className="form-control"
            id="Level"
            value={saveData.attributes.level}
            min={min(12)}
            max={max(12)}
            onChange={(e) => setValue(12, Number(e.currentTarget.value), 'level')}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="Experience">Experience</label>
          <input
            type="number"
            className="form-control"
            id="Experience"
            readOnly
            defaultValue={saveData.attributes.experience ? saveData.attributes.experience : 0}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <label htmlFor="Life">Life</label>
          <div className="input-group">
            <input
              className="form-control"
              type="number"
              id="Life"
              defaultValue={saveData.attributes.current_hp}
              min={min(6)}
              max={max(6)}
              onChange={(e) => setValue(6, Number(e.currentTarget.value), 'current_hp')}
            />
            <div className="input-group-prepend input-group-append">
              <div className="input-group-text">/</div>
            </div>
            <input
              className="form-control"
              type="number"
              id="MaxLife"
              defaultValue={saveData.attributes.max_hp}
              min={min(7)}
              max={max(7)}
              onChange={(e) => setValue(7, Number(e.currentTarget.value), 'max_hp')}
            />
          </div>
        </div>
        <div className="col-md-3">
          <label htmlFor="Mana">Mana</label>
          <div className="input-group">
            <input
              className="form-control"
              type="number"
              id="Mana"
              value={saveData.attributes.current_mana}
              min={min(8)}
              max={max(8)}
              onChange={(e) => setValue(8, Number(e.currentTarget.value), 'current_mana')}
            />
            <div className="input-group-prepend input-group-append">
              <div className="input-group-text">/</div>
            </div>
            <input
              className="form-control"
              type="number"
              id="MaxMana"
              value={saveData.attributes.max_mana}
              min={min(9)}
              max={max(9)}
              onChange={(e) => setValue(9, Number(e.currentTarget.value), 'max_mana')}
            />
          </div>
        </div>
        <div className="col-md-3">
          <label htmlFor="Stamina">Stamina</label>
          <div className="input-group">
            <input
              className="form-control"
              type="number"
              id="Stamina"
              value={saveData.attributes.current_stamina}
              min={min(6)}
              max={max(6)}
              onChange={(e) => setValue(6, Number(e.currentTarget.value), 'current_stamina')}
            />
            <div className="input-group-prepend input-group-append">
              <div className="input-group-text">/</div>
            </div>
            <input
              className="form-control"
              type="number"
              id="MaxStamina"
              value={saveData.attributes.max_stamina}
              min={min(7)}
              max={max(7)}
              onChange={(e) => setValue(7, Number(e.currentTarget.value), 'max_stamina')}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <label htmlFor="Strength">Strength</label>
          <input
            type="number"
            className="form-control"
            id="Strength"
            value={saveData.attributes.strength}
            min={min(0)}
            max={max(0)}
            onChange={(e) => setValue(0, Number(e.currentTarget.value), 'strength')}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="Dexterity">Dexterity</label>
          <input
            type="number"
            className="form-control"
            id="Dexterity"
            value={saveData.attributes.dexterity}
            min={min(2)}
            max={max(2)}
            onChange={(e) => setValue(2, Number(e.currentTarget.value), 'dexterity')}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="Vitality">Vitality</label>
          <input
            type="number"
            className="form-control"
            id="Vitality"
            value={saveData.attributes.vitality}
            min={min(3)}
            max={max(3)}
            onChange={(e) => setValue(3, Number(e.currentTarget.value), 'vitality')}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="Energy">Energy</label>
          <input
            type="number"
            className="form-control"
            id="Energy"
            value={saveData.attributes.energy}
            min={min(1)}
            max={max(1)}
            onChange={(e) => setValue(1, Number(e.currentTarget.value), 'energy')}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <label htmlFor="UnusedStatPoints">Unused Stat Points</label>
          <input
            type="number"
            className="form-control"
            id="UnusedStatPoints"
            value={saveData.attributes.unused_stats ? saveData.attributes.unused_stats : 0}
            min={min(4)}
            max={max(4)}
            onChange={(e) => setValue(4, Number(e.currentTarget.value), 'unused_stats')}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="UnusedSkillPoints">Unused Skill Points</label>
          <input
            type="number"
            className="form-control"
            id="UnusedSkillPoints"
            value={saveData.attributes.unused_skill_points ? saveData.attributes.unused_skill_points : 0}
            min={min(5)}
            max={max(5)}
            onChange={(e) => setValue(5, Number(e.currentTarget.value), 'unused_skill_points')}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <label htmlFor="Gold">Gold</label>
          <input
            type="number"
            className="form-control"
            id="Gold"
            value={saveData.attributes.gold ? saveData.attributes.gold : 0}
            min={min(14)}
            max={max(14)}
            onChange={(e) => setValue(14, Number(e.currentTarget.value), 'gold')}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="StashedGold">Stashed Gold</label>
          <input
            type="number"
            className="form-control"
            id="StashedGold"
            value={saveData.attributes.stashed_gold ? saveData.attributes.stashed_gold : 0}
            min={min(15)}
            max={max(15)}
            onChange={(e) => setValue(15, Number(e.currentTarget.value), 'stashed_gold')}
          />
        </div>
      </div>
    </div>
  )
}

export default Stats
