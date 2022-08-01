import type {D2CS} from "../d2c";
import type {updateSaveData} from "./App"

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

export type Difficulty = {
  key: string;
  all: boolean;
  label: string;
  acts: Array<Act>;
}

export type questReward = (difficulty: string, act: string, quest: string, state: string, attributes: Array<string>, amount: number, newState: boolean|null) => void;
export type updateQuest = (difficulty: Difficulty, act: Act, quest: Quest, state: State, newState: boolean|null) => void;
export type updateDiff = (difficulty: Difficulty) => void;
export type updateAct = (difficulty: Difficulty, act: Act) => void;
export type resetDifficulty = (difficulty: Difficulty) => void;
export type resetAct = (difficulty: Difficulty, act: Act) => void;
export type reset = (difficulty: Difficulty, act: Act, quest: Quest) => void;

type QuestProps = {
  saveData: D2CS;
  difficulty: Difficulty;
  act: Act;
  quest: Quest;
  updateQuest: updateQuest;
  reset: reset;
};
export type QuestElement = (props: QuestProps) => JSX.Element;

type ActProps = {
  saveData: D2CS;
  difficulty: Difficulty;
  act: Act;
  updateQuest: updateQuest;
  updateAct: updateAct;
  resetAct: resetAct;
  reset: reset;
};
export type ActElement = (props: ActProps) => JSX.Element;

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
export type DifficultyElement = (props: DifficultyProps) => JSX.Element;

type QuestsProps = {
  saveData: D2CS;
  updateSaveData: updateSaveData;
}
export type QuestsElement = (props: QuestsProps) => JSX.Element;
