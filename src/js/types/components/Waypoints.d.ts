import type {D2CS} from "../d2c";
import type {updateSaveData} from "./App"

interface State {
  key: string;
  label: string;
}
interface Act extends State {
  all: boolean;
  waypoints: Array<State>;
}

export type Difficulty = {
  key: string;
  all: boolean;
  label: string;
  acts: Array<Act>;
}

export type updateWP = (difficulty: Difficulty, act: Act, wp: State) => void;
export type updateAct = (difficulty: Difficulty, act: Act) => void;
export type updateDiff = (difficulty: Difficulty) => void;

type WaypointProps = {
  saveData: D2CS;
  difficulty: Difficulty;
  act: Act;
  waypoint: State;
  updateWP: updateWP;
};
export type WaypointElement = (props: WaypointProps) => JSX.Element;

type ActProps = {
  saveData: D2CS;
  difficulty: Difficulty;
  act: Act;
  updateWP: updateWP;
  updateAct: updateAct;
};
export type ActElement = (props: ActProps) => JSX.Element;

type DifficultyProps = {
  saveData: D2CS;
  difficulty: Difficulty;
  updateWP: updateWP;
  updateDiff: updateDiff;
  updateAct: updateAct;
};
export type DifficultyElement = (props: DifficultyProps) => JSX.Element;

type WaypointsProps = {
  saveData: D2CS;
  updateSaveData: updateSaveData;
}
export type WaypointsElement = (props: WaypointsProps) => JSX.Element;
