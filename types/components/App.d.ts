import * as React from 'react';
import type { D2CItem, D2CS } from '../types';
export declare type updateSaveData = (newData: D2CS | null) => void;
export declare type D2CEvent = {
    uuid?: string;
    item: D2CItem;
    grid?: Array<number>;
    ref?: React.RefObject<HTMLDivElement>;
    location?: locationType;
    type: string;
};
export declare type onEvent = (e: D2CEvent) => void;
export declare type paste = (item: D2CItem | null, position?: locationType) => void;
export declare type locationType = {
    location: number;
    equipped_location?: number;
    x?: number;
    y?: number;
    storage_page?: number;
};
export declare type optionClickedProps = {
    type: string;
    item?: D2CItem;
    grid?: Array<number>;
};
declare const App: () => JSX.Element;
export default App;
