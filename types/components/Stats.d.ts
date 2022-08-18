import { D2CS } from '../types';
import { updateSaveData } from './App';
declare type StatsProps = {
    saveData: D2CS;
    updateSaveData: updateSaveData;
};
declare const Stats: ({ saveData, updateSaveData }: StatsProps) => JSX.Element;
export default Stats;
