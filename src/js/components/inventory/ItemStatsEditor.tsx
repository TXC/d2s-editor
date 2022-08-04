import * as React from 'react'
import utils from '../../utils'
import type {
  ItemStatsEditorElement,
  StatsRowElement,
  StatValueElement,
  isClass,
  isClassSkill,
  isSkill,
  max,
  min,
  numValues,
  change, add, remove, update,
} from '../../types/components/inventory/ItemStatsEditor'
import {types} from '@dschu012/d2s'

const stats = window.constants.constants.magical_properties
const skills = window.constants.constants.skills.map((e,i)=> { return { i:i, v:e }}).filter(e => e.v != null && e.v.s != null)
const classes = window.constants.constants.classes

const isClass: isClass = (id, idx) => {
  const stat = stats[id];
  if ((stat.dF == 14) && idx == 2) {
    return true;
  }
  if ((stat.dF == 13) && idx == 1) {
    return true;
  }
  return false;
}
const isClassSkill: isClassSkill = (id: number, idx: number) => {
  const stat = stats[id];
  if ((stat.dF == 14) && idx == 1) {
    return true;
  }
  return false;
}
const isSkill: isSkill = (id, idx) => {
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
const max: max = (id) => {
  const stat = stats[id],
        sA = stat.sA ?? 0,
        sB = stat.sB ?? 0
  return utils.shift(1, sB) - 1 - sA
}
const min: min = (id) => {
  //for the stat to be present need value > 0
  const stat = stats[id],
        add = stat.sA ?? 0;
  return Number(-add);
}
const numValues: numValues = (id) => {
  const stat = stats[id];
  if (stat.dF == 14 || stat.e == 2) {
    return 3;
  }
  if (stat.e == 3) {
    return 4;
  }
  if (stat.sP) {
    return 2;
  }
  return 1;
}

const ClassValues: StatValueElement = ({itemStat, rowId, update, i}) => {
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

const ClassSkillValues: StatValueElement = ({itemStat, rowId, update, i}) => {
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

const SkillValues: StatValueElement = ({itemStat, rowId, update, i}) => {
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

const StatsRow: StatsRowElement = ({rowId, itemStat, update, remove}) => {

  const change: change = (id, value, idx) => {
    const newData = itemStat,
      maxValue = max(id),
      minValue = min(id)

    if (value > maxValue) {
      newData.values[idx] = maxValue
    } else if (value < minValue) {
      newData.values[idx] = minValue
    } else {
      newData.values[idx] = value
    }
    update(newData, rowId)
  }

  const statRows = stats.map((stat, idx) => (
    <option value={idx} key={idx}>{idx} - {stat.s}</option>
  ))

  const StatValueRows: Array<JSX.Element> = []
  for (const i in utils.range(numValues(itemStat.id))) {
    const idx = (Number(i) + 1)

    if (isClass(itemStat.id, idx) && !isClassSkill(itemStat.id, idx) && !isSkill(itemStat.id, idx)) {
      StatValueRows.push(
        <ClassValues
          key={`ClassValue${idx}`}
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
          key={`ClassSkillValue${idx}`}
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
          key={`SkillValue${idx}`}
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
          key={`UnknownValue${idx}`}
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

const ItemStatsEditor: ItemStatsEditorElement = ({itemStats, id, change}) => {
  const [content, setContent] = React.useState<types.IMagicProperty[]>(itemStats);

  const add: add = () => {
    const emptyItem: types.IMagicProperty = {
      id: 0,
      name: '',
      values: [],
      description: '',
      visible: false,
      op_value: 0,
      op_stats: [],
    }
    setContent(prev => {
      prev.push(emptyItem)
      return prev
    })
  }
  const remove: remove = (idx) => {
    setContent(list => list.filter((_, id) => id !== idx))
  }
  const update: update = (data, idx) => {
    content[idx] = data
    setContent(content)
  }

  let ItemStatRows: Array<JSX.Element> = [];
  const MapStatRows = () => {
    ItemStatRows = content.map((itemStat, idx) => (
      <StatsRow
        key={`StatRow${itemStat.id}`}
        rowId={idx}
        itemStat={itemStat}
        update={update}
        remove={remove}
      />
    ))
  }

  React.useEffect(() => {
    MapStatRows()
    change(content)
  }, [content]);
  MapStatRows();

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
