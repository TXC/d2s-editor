import { D2CS } from '../types';
import { updateSaveData } from './App';
declare type QuestsProps = {
    saveData: D2CS;
    updateSaveData: updateSaveData;
};
declare const Quests: ({ saveData, updateSaveData }: QuestsProps) => JSX.Element;
export default Quests;
