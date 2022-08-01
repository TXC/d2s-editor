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

const ClassValues: StatValueElement = ({id, itemStat, setContent, i}) => {
  const classRows = classes.map((c, idx) => (
    <option value={idx} key={idx}>{c.co}</option>
  ))

  return (
    <div className="col-md-2" id={`classStat${itemStat.id}-${i}`}>
      <select
        id={`Stat${id}Value${i}`}
        className="form-control"
        defaultValue={itemStat.values[i]}
        onChange={e => {
          itemStat.values[i] = Number(e.currentTarget.value)
          setContent(itemStat)
        }}
      >
        { classRows.length > 0 ? classRows : [] }
      </select>
    </div>
  )
}

const ClassSkillValues: StatValueElement = ({id, itemStat, setContent, i}) => {
  const classSkillRows = classes[itemStat.values[i]].ts.map((t: string, idx: number) => (
    <option value={idx} key={idx}>{t}</option>
  ))

  return (
    <div className="col-md-2" id={`classSkillStat${itemStat.id}-${i}`}>
      <select
        id={`Stat${id}Value${i}`}
        className="form-control"
        defaultValue={itemStat.values[i]}
        onChange={e => {
          itemStat.values[i] = Number(e.currentTarget.value)
          setContent(itemStat)
        }}
      >
        { classSkillRows.length > 0 ? classSkillRows : [] }
      </select>
    </div>
  )
}

const SkillValues: StatValueElement = ({id, itemStat, setContent, i}) => {
  const skillRows = skills.map(s => (
    <option value={s.i} key={s.i}>{s.v.s}</option>
  ))
  return (
    <div className="col-md-2" id={`skillStat${itemStat.id}-${i}`}>
      <select
        id={`Stat${id}Value${i}`}
        className="form-control"
        defaultValue={itemStat.values[i]}
        onChange={e => {
          itemStat.values[i] = Number(e.currentTarget.value)
          setContent(itemStat)
        }}
      >
        { skillRows.length > 0 ? skillRows : [] }
      </select>
    </div>
  )
}

const StatsRow: StatsRowElement = ({rowId, itemStat, update, remove}) => {
  const [content, setContent] = React.useState(itemStat)

  React.useEffect(() => {
    update(content, rowId)
  }, [content]);

  const change: change = (id, values, idx) => {
    const newData = itemStat,
      maxValue = max(id),
      minValue = min(id)

    if (values[idx] > maxValue) {
      newData.values[idx] = maxValue
    } else if (values[idx] < minValue) {
      newData.values[idx] = minValue
    }
    setContent(newData);
  }

  const statRows = stats.map((stat, idx) => (
    <option value={idx} key={idx}>{idx} - {stat.s}</option>
  ))

  const StatValueRows: Array<JSX.Element> = []
  for (const i in utils.range(numValues(content.id))) {
    const idx = (Number(i) + 1)

    if (isClass(itemStat.id, idx) && !isClassSkill(itemStat.id, idx) && !isSkill(itemStat.id, idx)) {
      StatValueRows.push(
        <ClassValues
          id={rowId}
          itemStat={itemStat}
          setContent={setContent}
          i={Number(i)}
        />
      )
    }
    else if (!isClass(itemStat.id, idx) && isClassSkill(itemStat.id, idx) && !isSkill(itemStat.id, idx)) {
      StatValueRows.push(
        <ClassSkillValues
          id={rowId}
          itemStat={itemStat}
          setContent={setContent}
          i={Number(i)}
        />
      )
    }
    else if (!isClass(itemStat.id, idx) && !isClassSkill(itemStat.id, idx) && isSkill(itemStat.id, idx)) {
      StatValueRows.push(
        <SkillValues
          id={rowId}
          itemStat={itemStat}
          setContent={setContent}
          i={Number(i)}
        />
      )
    }
    else if (!isClass(itemStat.id, idx) && !isClassSkill(itemStat.id, idx) && !isSkill(itemStat.id, idx)) {
      StatValueRows.push(
        <div className="col-md-2" id={`itemStat${itemStat.id}-${i}`}>
          <input
            type="number"
            className="form-control"
            id={`Stat${rowId}Value${i}`}
            min={min(itemStat.id)}
            max={max(itemStat.id)}
            defaultValue={itemStat.values[i]}
            onInput={() => change(itemStat.id, itemStat.values, Number(i))}
          />
        </div>
      )
    }
  }

  return (
    <div className="form-row" id={`Row${rowId}`}>
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
                content.id = Number(e.currentTarget.value)
                setContent(content)
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

const ItemStatsEditor: ItemStatsEditorElement = ({itemStats, id, onChange}) => {
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
      return [...new Set([emptyItem, ...prev])]
    })
  }
  const remove: remove = (idx) => {
    setContent(list => {
      list.splice(idx, 1)
      return list
    })
  }
  const update: update = (data, idx) => {
    content[idx] = data
    setContent(content)
  }

  React.useEffect(() => {
    onChange(content)
  }, [content]);

  const ItemStatRows = content.map((itemStat, idx) => (
    <StatsRow key={`Row${idx}`} rowId={idx} itemStat={itemStat} update={update} remove={remove} />
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
