import React from 'react';
import { D2CS, D2CItem } from '../types';
import { updateSaveData } from './App';
declare type MercenaryProps = {
    id: string;
    saveData: D2CS;
    updateSaveData: updateSaveData;
    selectEvent: React.Dispatch<React.SetStateAction<D2CItem | null>>;
};
declare const Mercenary: ({ id, saveData, updateSaveData, selectEvent }: MercenaryProps) => JSX.Element;
export default Mercenary;
