import * as React from 'react';
import type { onEvent } from '../App';
import { D2CItem } from '../../types';
declare type EquippedProps = {
    expansion: boolean;
    items: D2CItem[];
    selectEvent: React.Dispatch<React.SetStateAction<D2CItem | null>>;
    onEvent: onEvent;
};
declare const Equipped: ({ expansion, items, selectEvent, onEvent }: EquippedProps) => JSX.Element;
export default Equipped;
