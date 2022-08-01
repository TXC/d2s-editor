import type {D2CS} from "../d2c";
import type {updateSaveData} from "./App"

type SkillColProps = {
  noOfRows: number;
  updateSaveData: updateSaveData;
  saveData: D2CS;
  rowId: number;
};
export type SkillColElement = (props: SkillColProps) => JSX.Element;

type SkillsProps = {
  saveData: D2CS;
  updateSaveData: updateSaveData;
}
export type SkillsElement = (props: SkillsProps) => JSX.Element;
