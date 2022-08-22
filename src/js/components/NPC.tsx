import {Form} from 'react-bootstrap'
import {D2CS} from '../types'
import { updateSaveData } from './App'

const npcs: Array<Act> = [
  {
    key: 'act_i', label: 'Act I', all: false,
    npcs: [
      {key: 'akara', label: 'Akara'},
      {key: 'charsi', label: 'Charsi'},
      {key: 'gheed', label: 'Gheed'},
      {key: 'kashya', label: 'Kashya'},
      {key: 'warriv_act_i', label: 'Warriv'},
    ]
  },
  {
    key: 'act_ii', label: 'Act II', all: false,
    npcs: [
      {key: 'drogan', label: 'Drogan'},
      {key: 'elzix', label: 'Elzix'},
      {key: 'fara', label: 'Fara'},
      {key: 'geglash', label: 'Geglash'},
      {key: 'greiz', label: 'Greiz'},
      {key: 'jerhyn', label: 'Jerhyn'},
      {key: 'lysnader', label: 'Lysnader'},
      {key: 'meshif_act_ii', label: 'Meshif'},
      {key: 'warriv_act_ii', label: 'Warriv'},
    ]
  },
  {
    key: 'act_iii', label: 'Act III', all: false,
    npcs: [
      {key: 'alkor', label: 'Alkor'},
      {key: 'ashera', label: 'Ashera'},
      {key: 'cain_act_iii', label: 'Deckard Cain'},
      {key: 'hratli', label: 'Hratli'},
      {key: 'meshif_act_iii', label: 'Meshif'},
      {key: 'natalya', label: 'Natalya'},
      {key: 'ormus', label: 'Ormus'},
    ]
  },
  {
    key: 'act_iv', label: 'Act IV', all: false,
    npcs: [
    ]
  },
  {
    key: 'act_v', label: 'Act V', all: false,
    npcs: [
      {key: 'anya', label: 'Anya'},
      {key: 'cain_act_v', label: 'Deckard Cain'},
      {key: 'malah', label: 'Malah'},
      {key: 'nihlathak', label: 'Nihlathak'},
      {key: 'qualkehk', label: 'Qual-Kehk'},
    ]
  },
]

type updateNPC = (difficulty: Difficulty, act: Act, npc: State, key: string, state: boolean) => void
type updateAct = (difficulty: Difficulty, act: Act) => void
type updateDiff = (difficulty: Difficulty) => void

interface State {
  key: string;
  label: string;
}
interface Act extends State {
  all: boolean;
  npcs: Array<State>;
}
type Difficulty = {
  key: string;
  all: boolean;
  label: string;
  npcs: Array<Act>;
}

type SingleNPCProps = {
  saveData: D2CS;
  difficulty: Difficulty;
  act: Act
  npc: State;
  updateNPC: updateNPC;
}
const SingleNPC = ({saveData, difficulty, act, npc, updateNPC}: SingleNPCProps) => {
  // @ts-ignore
  const defaultValue = saveData.header.npcs[difficulty.key][npc.key]

  return (
    <li>
      <label>{npc.label}</label>
      <ul>
        <li>
          <Form.Switch
            id={`NPCintro${difficulty.key}${npc.key}`}
            defaultChecked={defaultValue.intro}
            value={1}
            onChange={() => updateNPC(difficulty, act, npc, 'intro', !defaultValue.intro)}
            label="Introduced"
          />
        </li>
        <li>
          <Form.Switch
            id={`NPCcongrat${difficulty.key}${npc.key}`}
            defaultChecked={defaultValue.congrats}
            value={1}
            onChange={() => updateNPC(difficulty, act, npc, 'congrats', !defaultValue.congrats)}
            label="Congratulated"
          />
        </li>
      </ul>
    </li>
  )
}

type ActProps = {
  saveData: D2CS;
  difficulty: Difficulty;
  act: Act;
  updateNPC: updateNPC;
  updateAct: updateAct;
};
const Act = ({saveData, difficulty, act, updateNPC, updateAct}: ActProps) => {
  const npcRows = act.npcs.map(npc => {
    return (
      <SingleNPC
        key={`NPC-${difficulty.key}-${act.key}-${npc.key}`}
        saveData={saveData}
        difficulty={difficulty}
        act={act}
        npc={npc}
        updateNPC={updateNPC}
      />
    )
  })

  return (
    <li>
      {npcRows.length > 0 && (
        <>
          <Form.Switch
            id={`NPCAct${difficulty.key}${act.key}`}
            defaultChecked={act.all}
            value={1}
            onChange={() => updateAct(difficulty, act)}
            label={act.label}
          />
          <ul>
            {npcRows}
          </ul>
        </>
      )}
    </li>
  )
}

type DifficultyProps = {
  saveData: D2CS;
  difficulty: Difficulty;
  updateNPC: updateNPC;
  updateAct: updateAct;
  updateDiff: updateDiff;
};
const Difficulty = ({
  saveData,
  difficulty,
  updateNPC,
  updateDiff,
  updateAct,
}: DifficultyProps) => {
  const actRows = npcs.map(act => {
    return (
      <Act
        key={`NPC-Act-${difficulty.key}-${act.key}`}
        saveData={saveData}
        difficulty={difficulty}
        act={act}
        updateNPC={updateNPC}
        updateAct={updateAct}
      />
    )
  })

  return (
    <div className="col-md-4 p-2">
      <ul>
        <li>
          <Form.Switch
            id={`NPCDifficulty${difficulty.key}`}
            defaultChecked={difficulty.all}
            value={1}
            onChange={() => updateDiff(difficulty)}
            label={difficulty.label}
          />
          <ul>
            {actRows.length > 0 ? actRows : []}
          </ul>
        </li>
      </ul>
    </div>
  )
}

type NPCProps = {
  saveData: D2CS;
  updateSaveData: updateSaveData;
}
const NPC = ({saveData, updateSaveData}: NPCProps) => {
  const difficulties: Array<Difficulty> = [
    {key: 'normal', all: false, label: 'Normal', npcs: JSON.parse(JSON.stringify(npcs))},
    {key: 'nm', all: false, label: 'Nightmare', npcs: JSON.parse(JSON.stringify(npcs))},
    {key: 'hell', all: false, label: 'Hell', npcs: JSON.parse(JSON.stringify(npcs))}
  ]


  const updateNPC: updateNPC = (difficulty, act, npc, key, state) => {
    const newData = saveData
    // @ts-ignore
    newData.header.npcs[difficulty.key][npc.key][key] = state
    if (state !== act.all && act.all) {
      act.all = false;
    }
    if (state !== difficulty.all && difficulty.all) {
      difficulty.all = false;
    }
    updateSaveData(newData)
  }
  const updateAct: updateAct = (difficulty, act) => {
    for (const npc of act.npcs) {
      updateNPC(difficulty, act, npc, 'intro', !act.all)
      updateNPC(difficulty, act, npc, 'congrats', !act.all)
    }
  }
  const updateDiff: updateDiff = (difficulty) => {
    for (const act of difficulty.npcs) {
      if (!act.all && difficulty.all) {
        act.all = true;
      } else if (act.all && !difficulty.all) {
        act.all = false;
      }
      updateAct(difficulty, act);
      act.all = !difficulty.all;
    }
  }

  const difficultyRow = difficulties.map(row => {
    return (
      <Difficulty
        key={`NPCDiff-${row.key}`}
        saveData={saveData}
        difficulty={row}
        updateNPC={updateNPC}
        updateDiff={updateDiff}
        updateAct={updateAct}
      />
    )
  })

  return (
    <div className="row">
      {difficultyRow.length > 0 ? difficultyRow : []}
    </div>
  )
}

export default NPC
