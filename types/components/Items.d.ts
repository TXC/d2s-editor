import * as React from 'react';
import { D2CItem, D2CS, ItemPack } from '../types';
import { onEvent, paste } from './App';
import type { gridType } from '../hooks/Grid';
declare type ItemsProps = {
    saveData: D2CS;
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    gridChange: (grid: gridType) => void;
    grid: gridType;
    onEvent: onEvent;
    selectEvent: React.Dispatch<React.SetStateAction<D2CItem | null>>;
    clipboard: D2CItem | null;
    paste: paste;
    isThemed: boolean;
    itemPack: ItemPack;
};
declare const Items: ({ saveData, activeTab, setActiveTab, isThemed, itemPack, grid, gridChange, onEvent, selectEvent, clipboard, paste, }: ItemsProps) => JSX.Element;
export default Items;
