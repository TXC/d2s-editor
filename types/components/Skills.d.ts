import { D2CS } from '../types';
import { updateSaveData } from './App';
declare type SkillsProps = {
    saveData: D2CS;
    updateSaveData: updateSaveData;
};
declare const Skills: ({ saveData, updateSaveData }: SkillsProps) => JSX.Element;
export default Skills;
