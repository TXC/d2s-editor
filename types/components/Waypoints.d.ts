import { D2CS } from '../types';
import { updateSaveData } from './App';
declare type WaypointsProps = {
    saveData: D2CS;
    updateSaveData: updateSaveData;
};
declare const Waypoints: ({ saveData, updateSaveData }: WaypointsProps) => JSX.Element;
export default Waypoints;
