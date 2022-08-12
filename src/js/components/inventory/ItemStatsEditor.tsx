import utils from '../../utils'
import {types} from '@dschu012/d2s'

const stats = window.constants.constants.magical_properties
const skills = window.constants.constants.skills.map((e,i)=> { return { i:i, v:e }}).filter(e => e.v != null && e.v.s != null)
const classes = window.constants.constants.classes

const isClass = (id: number, idx: number) => {
  const stat = stats[id];
  if ((stat.dF == 14) && idx == 2) {
    return true;
  }
  if ((stat.dF == 13) && idx == 1) {
    return true;
  }
  return false;
}
const isClassSkill = (id: number, idx: number) => {
  const stat = stats[id];
  if ((stat.dF == 14) && idx == 1) {
    return true;
  }
  return false;
}
const isSkill = (id: number, idx: number) => {
  const stat = stats[id];
  if (stat.dF == 14) {
    return false;
  }
  if (stat.sP) {
    if (stat.e == 3 || stat.e == 2) {
      return idx == 2;
    } else {
      return idx == 1;
    }
  }
  return false;
}
const max = (id: number) => {
  const stat = stats[id],
        sA = stat.sA ?? 0,
        sB = stat.sB ?? 0
  return utils.shift(1, sB) - 1 - sA
}
const min = (id: number) => {
  //for the stat to be present need value > 0
  const stat = stats[id],
        add = stat.sA ?? 0;
  return Number(-add);
}
const numValues = (id: number) => {
  const stat = stats[id];
  if (stat.dF == 14 || stat.e == 2) {
    return 3
  }
  if (stat.e == 3) {
    return 4
  }
  if (stat.sP) {
    return 2
  }
  if (stat.np) {
    return stat.np
  }
  return 1
}

type StatValueProps = {
  itemStat: types.IMagicProperty;
  rowId: number;
  update: (data: types.IMagicProperty, idx: number) => void
  i: number;
}
const ClassValues = ({itemStat, rowId, update, i}: StatValueProps) => {
  const classRows = classes.map((c, idx) => (
    <option value={idx} key={idx}>{c.co}</option>
  ))

  return (
    <div className="col-md-2" id={`classStat${itemStat.id}-${i}`}>
      <select
        id={`Stat${itemStat.id}Value${i}`}
        className="form-control"
        defaultValue={itemStat.values[i]}
        onChange={e => {
          itemStat.values[i] = Number(e.currentTarget.value)
          update(itemStat, rowId)
        }}
      >
        { classRows.length > 0 ? classRows : [] }
      </select>
    </div>
  )
}

const ClassSkillValues = ({itemStat, rowId, update, i}: StatValueProps) => {
  const classSkillRows = classes[itemStat.values[i]].ts.map((t: string, idx: number) => (
    <option value={idx} key={idx}>{t}</option>
  ))

  return (
    <div className="col-md-2" id={`classSkillStat${itemStat.id}-${i}`}>
      <select
        id={`Stat${itemStat.id}Value${i}`}
        className="form-control"
        defaultValue={itemStat.values[i]}
        onChange={e => {
          itemStat.values[i] = Number(e.currentTarget.value)
          update(itemStat, rowId)
        }}
      >
        { classSkillRows.length > 0 ? classSkillRows : [] }
      </select>
    </div>
  )
}

const SkillValues = ({itemStat, rowId, update, i}: StatValueProps) => {
  const skillRows = skills.map(s => (
    <option value={s.i} key={s.i}>{s.v.s}</option>
  ))
  return (
    <div className="col-md-2" id={`skillStat${itemStat.id}-${i}`}>
      <select
        id={`Stat${itemStat.id}Value${i}`}
        className="form-control"
        defaultValue={itemStat.values[i]}
        onChange={e => {
          itemStat.values[i] = Number(e.currentTarget.value)
          update(itemStat, rowId)
        }}
      >
        { skillRows.length > 0 ? skillRows : [] }
      </select>
    </div>
  )
}

type StatsRowProps = {
  rowId: number
  itemStat: types.IMagicProperty
  update: (data: types.IMagicProperty, idx: number) => void
  remove: (idx: number) => void
}
const StatsRow = ({rowId, itemStat, update, remove}: StatsRowProps) => {

  const change = (id: number, value: number, idx: number) => {
    const newData = itemStat,
      maxValue = max(id),
      minValue = min(id)

    console.log(itemStat, idx)
    if (value > maxValue) {
      newData.values[idx] = maxValue
    } else if (value < minValue) {
      newData.values[idx] = minValue
    } else {
      newData.values[idx] = value
    }
    console.log(newData, idx)
    update(newData, rowId)
  }

  const statRows = stats.map((stat, idx) => (
    <option value={idx} key={idx}>{idx} - {stat.s}</option>
  ))

  const StatValueRows: Array<JSX.Element> = []
  const StatValueNum = numValues(itemStat.id)
  for (const i in utils.range(StatValueNum)) {
    const idx = (Number(i) + 1)

    if (isClass(itemStat.id, idx) && !isClassSkill(itemStat.id, idx) && !isSkill(itemStat.id, idx)) {
      StatValueRows.push(
        <ClassValues
          key={`ClassValue${idx}-${rowId}`}
          rowId={rowId}
          itemStat={itemStat}
          update={update}
          i={Number(i)}
        />
      )
    }
    else if (!isClass(itemStat.id, idx) && isClassSkill(itemStat.id, idx) && !isSkill(itemStat.id, idx)) {
      StatValueRows.push(
        <ClassSkillValues
          key={`ClassSkillValue${idx}-${rowId}`}
          rowId={rowId}
          itemStat={itemStat}
          update={update}
          i={Number(i)}
        />
      )
    }
    else if (!isClass(itemStat.id, idx) && !isClassSkill(itemStat.id, idx) && isSkill(itemStat.id, idx)) {
      StatValueRows.push(
        <SkillValues
          key={`SkillValue${idx}-${rowId}`}
          rowId={rowId}
          itemStat={itemStat}
          update={update}
          i={Number(i)}
        />
      )
    }
    else if (!isClass(itemStat.id, idx) && !isClassSkill(itemStat.id, idx) && !isSkill(itemStat.id, idx)) {
      StatValueRows.push(
        <div
          key={`UnknownValue${idx}-${rowId}`}
          className="col-md-2"
          id={`itemStat${itemStat.id}-${i}`}
        >
          <input
            type="number"
            className="form-control"
            id={`Stat${itemStat.id}Value${i}`}
            min={min(itemStat.id)}
            max={max(itemStat.id)}
            defaultValue={itemStat.values[i]}
            onChange={e => change(itemStat.id, Number(e.currentTarget.value), Number(i))}
          />
        </div>
      )
    }
  }

  return (
    <div className="form-row" id={`Row${itemStat.id}`}>
      <div className="col-md-4">
        <div className="form-row">
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-link red"
              onClick={() => remove(rowId)}
            >&times;</button>
          </div>
          <div className="col-md-10">
            <select
              className="form-control"
              id={`Stat${rowId}`}
              defaultValue={itemStat.id}
              onChange={e => {
                const newItemStat = itemStat
                newItemStat.id = Number(e.currentTarget.value)
                update(newItemStat, rowId)
              }}
            >
              { statRows.length > 0 ? statRows : [] }
            </select>
          </div>
        </div>
        {/* <label htmlFor={`Stat${id}`}>Stat</label> */}
      </div>
      { StatValueRows.length > 0 ? StatValueRows : [] }
    </div>
  )
}

type updateStats = (data: types.IMagicProperty[]) => void
type ItemStatsEditorProps = {
  itemStats: types.IMagicProperty[];
  id: string;
  updateStats: updateStats
}
const ItemStatsEditor = ({itemStats, id, updateStats}: ItemStatsEditorProps) => {
  const add = () => {
    const emptyItem: types.IMagicProperty = {
      id: 0,
      name: '',
      values: [],
      description: '',
      visible: false,
      op_value: 0,
      op_stats: [],
    }
    itemStats.push(emptyItem)
    updateStats(itemStats)
  }
  const remove = (idx: number) => {
    updateStats(itemStats.filter((_, id) => id !== idx))
  }
  const update = (data: types.IMagicProperty, idx: number) => {
    const newData = itemStats
    newData[idx] = data
    updateStats(newData)
  }

  const ItemStatRows: Array<JSX.Element> = itemStats.map((itemStat, idx) => (
    <StatsRow
      key={`StatRow${itemStat.id}-${idx}`}
      rowId={idx}
      itemStat={itemStat}
      update={update}
      remove={remove}
    />
  ))

  return (
    <div id={id}>
      <div className="form-row">
        <div className="col-md-4">Stat</div>
        <div className="col-md-2">Value</div>
      </div>
      { ItemStatRows.length > 0 ? ItemStatRows : [] }
      <div className="form-row">
        <button
          type="button"
          className="btn btn-link"
          onClick={() => add()}
        >Add Stat</button>
      </div>
    </div>
  )
}

export default ItemStatsEditor
