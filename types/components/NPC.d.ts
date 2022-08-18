import { D2CS } from '../types';
import { updateSaveData } from './App';
declare type NPCProps = {
    saveData: D2CS;
    updateSaveData: updateSaveData;
};
declare const NPC: ({ saveData, updateSaveData }: NPCProps) => JSX.Element;
export default NPC;
