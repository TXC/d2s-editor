import * as React from 'react'
import utils from '../utils'
import type {SkillsElement, SkillColElement} from '../types/components/Skills'

const SkillCol: SkillColElement = ({rowId, noOfRows, saveData, updateSaveData}) => {
  const Cols = []
  for (const i in utils.range(noOfRows)) {
    const colId = ((rowId * noOfRows) + Number(i))
    const col = (
      <div key={`col${colId}`} className="col-md-12">
        <label
          htmlFor={`Skill${saveData.skills[colId].id}`}
        >
          {saveData.skills[colId].name}
        </label>
        <input
          type="number"
          className="form-control"
          id={`Skill${saveData.skills[colId].id}`}
          min="0"
          max="20"
          defaultValue={saveData.skills[colId].points}
          onChange={(e) => {
            const newData = saveData
            newData.skills[colId].points = Number(e.currentTarget.value)
            updateSaveData(newData)
          }}
        />
      </div>
    )
    Cols.push(col);
  }
  return (
    <>
      { Cols.length > 0 ? Cols : [] }
    </>
  )
}

const Skills: SkillsElement = ({saveData, updateSaveData}) => {
  const [allSkills, setAllSkills] = React.useState<number|null>(null)

  const noOfSkills = saveData.skills.length,
        noOfCols = 6,
        noOfRows = noOfSkills / noOfCols,
        Rows = []
  let rowId = 0
  for (const i in utils.range(noOfCols)) {
    const row = (
      <div
        key={`SkillColumn-${i}${rowId}`}
        className="col-md-2"
      >
        <div className="row">
          <SkillCol
            key={`SkillCol-${i}${rowId}`}
            rowId={rowId}
            noOfRows={noOfRows}
            saveData={saveData}
            updateSaveData={updateSaveData}
          />
        </div>
      </div>
    )
    rowId++
    Rows.push(row);
  }

  const setAll = () => {
    if(allSkills === null || allSkills === undefined) {
      return
    }
    const newData = saveData
    for (let i = 0; i < newData.skills.length; i++) {
      newData.skills[i].points = allSkills
    }
    updateSaveData(newData)
    setAllSkills(null)
  }

  return (
    <div>
      <div className="form-row">
        { Rows.length > 0 ? Rows : [] }
      </div>
      <br />
      <div className="form-row">
        <div className={'col-md-3 input-group'}>
          <div className="input-group-prepend">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={setAll}
            >
              Set All To
            </button>
          </div>
          <input
            className="form-control"
            type="number"
            min="0"
            max="20"
            defaultValue={allSkills === null ? 0 : allSkills}
            onChange={e => {
              setAllSkills(Number(e.currentTarget.value))
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Skills
