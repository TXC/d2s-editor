//import * as React from 'react'
import {D2CS} from '../types'
import { updateSaveData } from './App';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons'

const flags: Array<string> = ['is_completed', 'is_requirement_completed', 'is_received',
  'unk3', 'unk4', 'unk5', 'unk6', 'consumed_scroll', 'unk8', 'unk9', 'unk10',
  'unk11', 'closed', 'done_recently', 'unk14', 'unk15']

const quests: Array<Act> = [
  {
    key: 'act_i', label: 'Act I', all: false,
    quests: [
      {key: 'den_of_evil', label: 'Den Of Evil', values: [{key: 'is_completed', label: 'Completed'}]},
      {
        key: 'sisters_burial_grounds',
        label: 'Sisters\' Burial Grounds',
        values: [{key: 'is_completed', label: 'Completed'}]
      },
      {
        key: 'the_search_for_cain',
        label: 'Search for Cain',
        values: [{key: 'unk10', label: 'Cow King Killed'}, {key: 'is_completed', label: 'Completed'}]
      },
      {key: 'the_forgotten_tower', label: 'The Forgotten Tower', values: [{key: 'is_completed', label: 'Completed'}]},
      {key: 'tools_of_the_trade', label: 'Tools of the Trade', values: [{key: 'is_completed', label: 'Completed'}]},
      {
        key: 'sisters_to_the_slaughter',
        label: 'Sisters to the Slaughter',
        values: [{key: 'is_completed', label: 'Completed'}]
      },
    ]
  },
  {
    key: 'act_ii', label: 'Act II', all: false,
    quests: [
      {key: 'radaments_lair', label: 'Radament\'s Lair', values: [{key: 'is_completed', label: 'Completed'}]},
      {key: 'the_horadric_staff', label: 'The Horadric Staff', values: [{key: 'is_completed', label: 'Completed'}]},
      {key: 'tainted_sun', label: 'Tainted Sun', values: [{key: 'is_completed', label: 'Completed'}]},
      {key: 'arcane_sanctuary', label: 'Arcane Sanctuary', values: [{key: 'is_completed', label: 'Completed'}]},
      {key: 'the_summoner', label: 'The Summoner', values: [{key: 'is_completed', label: 'Completed'}]},
      {key: 'the_seven_tombs', label: 'The Seven Tombs', values: [{key: 'is_completed', label: 'Completed'}]},
    ]
  },
  {
    key: 'act_iii', label: 'Act III', all: false,
    quests: [
      {key: 'the_golden_bird', label: 'The Golden Bird', values: [{key: 'is_completed', label: 'Completed'}]},
      {
        key: 'blade_of_the_old_religion',
        label: 'Blade of the Old Religion',
        values: [{key: 'is_completed', label: 'Completed'}]
      },
      {key: 'khalims_will', label: 'Khalim\'s Will', values: [{key: 'is_completed', label: 'Completed'}]},
      {key: 'lam_esens_tome', label: 'Lam Esen\'s Tome', values: [{key: 'is_completed', label: 'Completed'}]},
      {key: 'the_blackened_temple', label: 'The Blackened Temple', values: [{key: 'is_completed', label: 'Completed'}]},
      {key: 'the_guardian', label: 'The Guardian', values: [{key: 'is_completed', label: 'Completed'}]},
    ]
  },
  {
    key: 'act_iv', label: 'Act IV', all: false,
    quests: [
      {key: 'the_fallen_angel', label: 'Fallen Angel', values: [{key: 'is_completed', label: 'Completed'}]},
      {key: 'hellforge', label: 'Hell\'s Forge', values: [{key: 'is_completed', label: 'Completed'}]},
      {key: 'terrors_end', label: 'Terror\'s End', values: [{key: 'is_completed', label: 'Completed'}]},
    ]
  },
  {
    key: 'act_v', label: 'Act V', all: false,
    quests: [
      {key: 'siege_on_harrogath', label: 'Siege on Harrogath', values: [{key: 'is_completed', label: 'Completed'}]},
      {
        key: 'rescue_on_mount_arreat',
        label: 'Rescue on Mount Arreat',
        values: [{key: 'is_completed', label: 'Completed'}]
      },
      {
        key: 'prison_of_ice',
        label: 'Prison of Ice',
        values: [{key: 'consumed_scroll ', label: 'Consumed Scroll'}, {key: 'is_completed', label: 'Completed'}]
      },
      {
        key: 'betrayal_of_harrogath',
        label: 'Betrayal of Harrogath',
        values: [{key: 'is_completed', label: 'Completed'}]
      },
      {key: 'rite_of_passage', label: 'Rite of Passage', values: [{key: 'is_completed', label: 'Completed'}]},
      {key: 'eve_of_destruction', label: 'Eve of Destruction', values: [{key: 'is_completed', label: 'Completed'}]},
    ]
  },
];

interface State {
  key: string;
  label: string;
}
interface Quest extends State {
  values: Array<State>
}
interface Act extends State {
  all: boolean;
  quests: Array<Quest>;
}

type updateQuest = (difficulty: Difficulty, act: Act, quest: Quest, state: State, newState: boolean|null) => void
type updateDiff = (difficulty: Difficulty) => void
type updateAct = (difficulty: Difficulty, act: Act) => void
type resetDifficulty = (difficulty: Difficulty) => void
type resetAct = (difficulty: Difficulty, act: Act) => void
type reset = (difficulty: Difficulty, act: Act, quest: Quest) => void

type Difficulty = {
  key: string;
  all: boolean;
  label: string;
  acts: Array<Act>;
}

type QuestProps = {
  saveData: D2CS;
  difficulty: Difficulty;
  act: Act;
  quest: Quest;
  updateQuest: updateQuest;
  reset: reset;
};
const Quest = ({saveData, difficulty, act, quest, updateQuest, reset}: QuestProps) => {
  const questValues = quest.values.map(state => {
    // @ts-ignore
    const defaultValue = saveData.header[difficulty.key][act.key][quest.key][state.key]
    return (
      <li key={`State${difficulty.key}${act.key}${quest.key}${state.key}`}>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={`Quest${difficulty.key}${act.key}${quest.key}${state.key}`}
            defaultChecked={defaultValue}
            value={1}
            onChange={() => updateQuest(difficulty, act, quest, state, null)}
          />
          <label
            className="form-check-label"
            htmlFor={`Quest${difficulty.key}${act.key}${quest.key}${state.key}`}
          >{state.label}</label>
        </div>
      </li>
    )
  })

  return (
    <li>
      <label>{quest.label}</label>
      <button
        type="button"
        className="btn btn-link"
        title="Reset Quest"
        onClick={() => reset(difficulty, act, quest)}
      >
        <FontAwesomeIcon icon={faRotateLeft} />
      </button>
      <ul>
        {questValues.length > 0 ? questValues : []}
      </ul>
    </li>
  )
}

type ActProps = {
  saveData: D2CS;
  difficulty: Difficulty;
  act: Act;
  updateQuest: updateQuest;
  updateAct: updateAct;
  resetAct: resetAct;
  reset: reset;
};
const Act = ({saveData, difficulty, act, updateQuest, updateAct, resetAct, reset}: ActProps) => {
  const questRows = act.quests.map(quest => {
    return (
      <Quest
        key={`Quest${difficulty.key}${act.key}${quest.key}`}
        saveData={saveData}
        difficulty={difficulty}
        act={act}
        quest={quest}
        updateQuest={updateQuest}
        reset={reset}
      />
    )
  })

  return (
    <li>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={`Act${difficulty.key}${act.key}`}
          defaultChecked={act.all}
          value={1}
          onChange={() => updateAct(difficulty, act)}
        />
        <label
          className="form-check-label"
          htmlFor={`Act${difficulty.key}${act.key}`}
        >
          {act.label}
        </label>
        <button
          type="button"
          className="btn btn-link btn-sm"
          title="Reset Act"
          onClick={() => resetAct(difficulty, act)}
        >
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
      </div>
      <ul>
        {questRows.length > 0 ? questRows : []}
      </ul>
    </li>
  )
}

type DifficultyProps = {
  saveData: D2CS;
  difficulty: Difficulty;
  updateQuest: updateQuest;
  updateDiff: updateDiff;
  updateAct: updateAct;
  resetDifficulty: resetDifficulty;
  resetAct: resetAct;
  reset: reset;
};
const Difficulty = ({
  saveData,
  difficulty,
  updateQuest,
  updateDiff,
  updateAct,
  resetDifficulty,
  resetAct,
  reset
}: DifficultyProps) => {
  const actRows = quests.map(act => {
    return (
      <Act
        key={`Act${difficulty.key}${act.key}`}
        saveData={saveData}
        difficulty={difficulty}
        act={act}
        updateQuest={updateQuest}
        updateAct={updateAct}
        resetAct={resetAct}
        reset={reset}
      />
    )
  })

  return (
    <div className="col-md-4 p-3">
      <ul>
        <li>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id={`Difficulty${difficulty.key}`}
              defaultChecked={difficulty.all}
              value={1}
              onChange={() => updateDiff(difficulty)}
            />
            <label
              className="form-check-label"
              htmlFor={`Difficulty${difficulty.key}`}
            >
              {difficulty.label}
            </label>
            <button
              type="button"
              className="btn btn-link btn-sm"
              title="Reset Difficulty"
              onClick={() => resetDifficulty(difficulty)}
            >
              <FontAwesomeIcon icon={faRotateLeft} />
            </button>
          </div>
          <ul>
            {actRows.length > 0 ? actRows : []}
          </ul>
        </li>
      </ul>
    </div>
  )
}

type QuestsProps = {
  saveData: D2CS;
  updateSaveData: updateSaveData;
}
const Quests = ({saveData, updateSaveData}: QuestsProps) => {
  const difficulties: Array<Difficulty> = [
    {key: 'quests_normal', all: false, label: 'Normal', acts: JSON.parse(JSON.stringify(quests))},
    {key: 'quests_nm', all: false, label: 'Nightmare', acts: JSON.parse(JSON.stringify(quests))},
    {key: 'quests_hell', all: false, label: 'Hell', acts: JSON.parse(JSON.stringify(quests))}
  ]

  const updateQuest: updateQuest = (difficulty, act, quest, state, newState) => {
    const newData = saveData

    const questReward = (attributes: string[], amount: number, newState: boolean|null) => {
      if (newState === false) {
        amount *= -1;
      }
      for (const attribute of attributes) {
        newData.attributes[attribute] = (saveData.attributes[attribute] == null ? 0 : saveData.attributes[attribute]) + amount;
      }
    }

    // @ts-ignore
    if (newState != null && newState === saveData.header[difficulty.key][act.key][quest.key][state.key]) {
      return;
    }
    if (newState == null) {
      // @ts-ignore
      newState = !saveData.header[difficulty.key][act.key][quest.key][state.key];
    }
    if (['den_of_evil', 'radaments_lair'].indexOf(quest.key) > -1) {
      questReward(['unused_skill_points'], 1, newState);
    } else if (quest.key === 'the_fallen_angel') {
      questReward(['unused_skill_points'], 2, newState);
    } else if (quest.key === 'lam_esens_tome') {
      questReward(['unused_stats'], 5, newState);
    } else if (quest.key === 'the_golden_bird') {
      questReward(['current_hp', 'max_hp'], 20, newState);
    }
    if (act.all !== newState && act.all) {
      act.all = false;
    }
    if (difficulty.all !== newState && difficulty.all) {
      difficulty.all = false;
    }
    updateSaveData(newData)
  }
  const updateDiff: updateDiff = (difficulty) => {
    for (const act of difficulty.acts) {
      if (!act.all && difficulty.all) {
        act.all = true;
      } else if (act.all && !difficulty.all) {
        act.all = false;
      }
      updateAct(difficulty, act);
      act.all = !difficulty.all;
    }
  }
  const updateAct: updateAct = (difficulty, act) => {
    for (const q of act.quests) {
      for (const state of q.values) {
        // @ts-ignore
        saveData.header[difficulty.key][act.key][q.key][state.key] = !act.all;
        updateQuest(difficulty, act, q, state, !act.all);
      }
    }
  }
  const resetDifficulty: resetDifficulty = (difficulty) => {
    for (const act of difficulty.acts) {
      resetAct(difficulty, act);
    }
    difficulty.all = false;
  }
  const resetAct: resetAct = (difficulty, act) => {
    for (const q of act.quests) {
      reset(difficulty, act, q);
    }
    act.all = false;
  }
  const reset: reset = (difficulty, act, quest) => {
    for (const flag of flags) {
      // @ts-ignore
      if (flag === 'is_completed' && saveData.header[difficulty.key][act.key][quest.key][flag] === true) {
        const flagState = {
          key: flag,
          label: flag
        }
        updateQuest(difficulty, act, quest, flagState, false);
      }
      // @ts-ignore
      saveData.header[difficulty.key][act.key][quest.key][flag] = false;
    }
  }

  const difficultyRow = difficulties.map(row => {
    return (
      <Difficulty
        key={`Diff${row.key}`}
        saveData={saveData}
        difficulty={row}
        updateQuest={updateQuest}
        updateDiff={updateDiff}
        updateAct={updateAct}
        resetDifficulty={resetDifficulty}
        resetAct={resetAct}
        reset={reset}
      />
    )
  })

  return (
    <div className="row">
      {difficultyRow.length > 0 ? difficultyRow : []}
    </div>
  )
}
export default Quests

