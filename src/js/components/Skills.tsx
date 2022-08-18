import * as React from 'react'
import utils from '../utils'
import {D2CS} from '../types'
import {updateSaveData} from './App'

type updateSkill = (e: React.ChangeEvent<HTMLInputElement>, colId: number) => void
type SkillProps = {
  colId: number
  saveData: D2CS
  updateSkill: updateSkill
}
const Skill = ({colId, saveData, updateSkill}: SkillProps) => {
  return (
    (
      <div key={`Skill${saveData.skills[colId].id}`} className="m-3">
        <label
          htmlFor={`Skill${saveData.skills[colId].id}`}
          className="form-label"
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
          onChange={(e) => updateSkill(e, colId)}
        />
      </div>
    )
  )
}

type SkillColProps = {
  noOfRows: number;
  updateSaveData: updateSaveData;
  saveData: D2CS;
  rowId: number;
};
const SkillCol = ({rowId, noOfRows, saveData, updateSaveData}: SkillColProps) => {
  const updateSkill: updateSkill = (e, colId) => {
    const newData = saveData
    newData.skills[colId].points = Number(e.currentTarget.value)
    updateSaveData(newData)
  }
  const Cols = []
  for (const i in utils.range(noOfRows)) {
    const colId = ((rowId * noOfRows) + Number(i))
    const col = (
      <Skill
        key={`Skill${colId}`}
        colId={colId}
        saveData={saveData}
        updateSkill={updateSkill}
        />
    )
    Cols.push(col);
  }
  return (
    <>
      { Cols.length > 0 ? Cols : [] }
    </>
  )
}

type SkillsProps = {
  saveData: D2CS;
  updateSaveData: updateSaveData;
}
const Skills = ({saveData, updateSaveData}: SkillsProps) => {
  const [allSkills, setAllSkills] = React.useState<number|null>(null)

  const noOfSkills = saveData.skills.length,
        noOfCols = 6,
        noOfRows = noOfSkills / noOfCols,
        Rows = []
  for (const i in utils.range(noOfCols)) {
    const row = (
      <div className="col-md-2" key={`SC${i}`}>
        <div className="row">
          <SkillCol
            rowId={Number(i)}
            noOfRows={noOfRows}
            saveData={saveData}
            updateSaveData={updateSaveData}
          />
        </div>
      </div>
    )
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
      <div className="row mb-3">
        { Rows.length > 0 ? Rows : [] }
      </div>

      <div className="row">
        <div className={'col-md-3 input-group'}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={setAll}
          >
            Set All To
          </button>
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
