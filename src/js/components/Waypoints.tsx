//import * as React from 'react'
import {
  updateWP,
  updateAct,
  updateDiff,
  Act,
  WaypointsElement,
  Difficulty,
  WaypointElement,
  ActElement,
  DifficultyElement
} from '../types/components/Waypoints'

const waypoints: Array<Act> = [
  {
    key: 'act_i', label: 'Act I', all: false,
    waypoints: [
      {key: 'rogue_encampement', label: 'Rogue Encampement'},
      {key: 'cold_plains', label: 'Cold Plains'},
      {key: 'stony_field', label: 'Stoney Field'},
      {key: 'dark_woods', label: 'Dark Woods'},
      {key: 'black_marsh', label: 'Black Marsh'},
      {key: 'outer_cloister', label: 'Outer Cloister'},
      {key: 'jail_lvl_1', label: 'Jail Lvl 1'},
      {key: 'inner_cloister', label: 'Inner Cloister'},
      {key: 'catacombs_lvl_2', label: 'Catacombs Lvl 2'},
    ]
  },
  {
    key: 'act_ii', label: 'Act II', all: false,
    waypoints: [
      {key: 'lut_gholein', label: 'Lut Gholein'},
      {key: 'sewers_lvl_2', label: 'Sewers Lvl 2'},
      {key: 'dry_hills', label: 'Dry Hills'},
      {key: 'halls_of_the_dead_lvl_2', label: 'Halls of the Dead Lvl 2'},
      {key: 'far_oasis', label: 'Far Oasis'},
      {key: 'lost_city', label: 'Lost City'},
      {key: 'palace_cellar_lvl_1', label: 'Palace Cellar Lvl 1'},
      {key: 'arcane_sanctuary', label: 'Arcane Sanctuary'},
      {key: 'canyon_of_the_magi', label: 'Canyon of the Magi'},
    ]
  },
  {
    key: 'act_iii', label: 'Act III', all: false,
    waypoints: [
      {key: 'kurast_docks', label: 'Kurast Docks'},
      {key: 'spider_forest', label: 'Spider Forest'},
      {key: 'great_marsh', label: 'Great Marsh'},
      {key: 'flayer_jungle', label: 'Flayer Jungle'},
      {key: 'lower_kurast', label: 'Lower Kurast'},
      {key: 'kurast_bazaar', label: 'Kurast Bazaar'},
      {key: 'upper_kurast', label: 'Upper Kurast'},
      {key: 'travincal', label: 'Travincal'},
      {key: 'durance_of_hate_lvl_2', label: 'Durance of Hate Lvl 2'},
    ]
  },
  {
    key: 'act_iv', label: 'Act IV', all: false,
    waypoints: [
      {key: 'the_pandemonium_fortress', label: 'Pandemonium Fortress'},
      {key: 'city_of_the_damned', label: 'City of the Damned'},
      {key: 'river_of_flame', label: 'River of Flame'},
    ]
  },
  {
    key: 'act_v', label: 'Act V', all: false,
    waypoints: [
      {key: 'harrogath', label: 'Harrogath'},
      {key: 'frigid_highlands', label: 'Frigid Highlands'},
      {key: 'arreat_plateau', label: 'Arreat Plateau'},
      {key: 'crystalline_passage', label: 'Crystalline Passage'},
      {key: 'halls_of_pain', label: 'Halls of Pain'},
      {key: 'glacial_trail', label: 'Glacial Trail'},
      {key: 'frozen_tundra', label: 'Frozen Tundra'},
      {key: 'the_ancients_way', label: 'The Ancients\' Way'},
      {key: 'worldstone_keep_lvl_2', label: 'Worldstone Keep Lvl 2'},
    ]
  },
];

const Waypoint: WaypointElement = ({saveData, difficulty, act, waypoint, updateWP}) => {
  // @ts-ignore
  const defaultValue = saveData.header.waypoints[difficulty.key][act.key][waypoint.key]

  return (
    <li>
      <div className="custom-control custom-switch">
        <input
          className="custom-control-input"
          type="checkbox"
          id={`Waypoint${difficulty.key}${act.key}${waypoint.key}`}
          defaultChecked={defaultValue}
          value={1}
          onChange={() => updateWP(difficulty, act, waypoint)}
        />
        <label
          className="custom-control-label"
          htmlFor={`Waypoint${difficulty.key}${act.key}${waypoint.key}`}
        >
          {waypoint.label}
        </label>
      </div>
    </li>
  )
}

const Act: ActElement = ({saveData, difficulty, act, updateWP, updateAct}) => {
  const waypointRows = act.waypoints.map(waypoint => {
    return (
      <Waypoint
        key={`Waypoint-${difficulty.key}-${act.key}-${waypoint.key}`}
        saveData={saveData}
        difficulty={difficulty}
        act={act}
        waypoint={waypoint}
        updateWP={updateWP}
      />
    )
  })

  return (
    <li>
      <div className="custom-control custom-switch">
        <input
          className="custom-control-input"
          type="checkbox"
          id={`Act${difficulty.key}${act.key}`}
          defaultChecked={act.all}
          value={1}
          onChange={() => updateAct(difficulty, act)}
        />
        <label
          className="custom-control-label"
          htmlFor={`Act${difficulty.key}${act.key}`}
        >
          {act.label}
        </label>
      </div>
      <ul>
        {waypointRows.length > 0 ? waypointRows : []}
      </ul>
    </li>
  )
}

const Difficulty: DifficultyElement = ({
  saveData,
  difficulty,
  updateWP,
  updateDiff,
  updateAct,
}) => {
  const actRows = waypoints.map(act => {
    return (
      <Act
        key={`Act-${difficulty.key}-${act.key}`}
        saveData={saveData}
        difficulty={difficulty}
        act={act}
        updateWP={updateWP}
        updateAct={updateAct}
      />
    )
  })

  return (
    <div className="col-md-4 p-2">
      <ul>
        <li>
          <div className="custom-control custom-switch">
            <input
              className="custom-control-input"
              type="checkbox"
              id={`Difficulty${difficulty.key}`}
              defaultChecked={difficulty.all}
              value={1}
              onChange={() => updateDiff(difficulty)}
            />
            <label
              className="custom-control-label"
              htmlFor={`Difficulty${difficulty.key}`}
            >
              {difficulty.label}
            </label>
          </div>
          <ul>
            {actRows.length > 0 ? actRows : []}
          </ul>
        </li>
      </ul>
    </div>
  )
}

const Waypoints: WaypointsElement = ({saveData, updateSaveData}) => {
  const difficulties: Array<Difficulty> = [
    {key: 'normal', all: false, label: 'Normal', acts: JSON.parse(JSON.stringify(waypoints))},
    {key: 'nm', all: false, label: 'Nightmare', acts: JSON.parse(JSON.stringify(waypoints))},
    {key: 'hell', all: false, label: 'Hell', acts: JSON.parse(JSON.stringify(waypoints))}
  ]

  const updateWP: updateWP = (difficulty, act, wp) => {
    // @ts-ignore
    const value = !saveData.header.waypoints[difficulty.key][act.key][wp.key];
    if (value !== act.all && act.all) {
      act.all = false;
    }
    if (value !== difficulty.all && difficulty.all) {
      difficulty.all = false;
    }
  }
  const updateAct: updateAct = (difficulty, act) => {
    const newData = saveData
    for (const wp of act.waypoints) {
      // @ts-ignore
      newData.header.waypoints[difficulty.key][act.key][wp.key] = !act.all;
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

  const difficultyRow = difficulties.map(row => {
    return (
      <Difficulty
        key={`Diff-${row.key}`}
        saveData={saveData}
        difficulty={row}
        updateWP={updateWP}
        updateDiff={updateDiff}
        updateAct={updateAct}
      />
    )
  })

  return (
    <div className="form-row">
      {difficultyRow.length > 0 ? difficultyRow : []}
    </div>
  )
}

export default Waypoints
