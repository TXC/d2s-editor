import {D2CS} from '../d2c'

interface State {
  key: string;
  label: string;
}
interface Act extends State {
  all: boolean;
  npcs: Array<State>;
}
export type Difficulty = {
  key: string;
  all: boolean;
  label: string;
  npcs: Array<NPCS>;
}

export type updateNPC = (difficulty: Difficulty, act: Act, npc: State, key: string, state: boolean) => void;
export type updateAct = (difficulty: Difficulty, act: Act) => void;
export type updateDiff = (difficulty: Difficulty) => void;

type SingleNPCProps = {
  saveData: D2CS;
  difficulty: Difficulty;
  npc: State;
  updateNPC;
}
export type SingleNPCElement = (props: SingleNPCProps) => JSX.Element

type ActProps = {
  saveData: D2CS;
  difficulty: Difficulty;
  act: Act;
  updateNPC: updateNPC;
  updateAct: updateAct;
};
export type ActElement = (props: ActProps) => JSX.Element;

type DifficultyProps = {
  saveData: D2CS;
  difficulty: Difficulty;
  updateNPC: updateNPC;
  updateAct: updateAct;
  updateDiff: updateDiff;
};
export type DifficultyElement = (props: DifficultyProps) => JSX.Element;

type NPCProps = {
  saveData: D2CS;
  updateSaveData: updateSaveData;
}
export type NPCElement = (props: NPCProps) => JSX.Element;
