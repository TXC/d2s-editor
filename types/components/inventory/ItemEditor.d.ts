import { D2CItem } from '../../types';
import * as React from 'react';
import { locationType, onEvent } from '../App';
declare type ItemEditorProps = {
    id: number | string;
    item: D2CItem;
    setSelected: React.Dispatch<React.SetStateAction<D2CItem | null>>;
    setLocation: React.Dispatch<React.SetStateAction<locationType | null>>;
    location: locationType | null;
    callOnEvent: onEvent;
};
declare const ItemEditor: ({ id, item, setSelected, location, setLocation, callOnEvent }: ItemEditorProps) => JSX.Element;
export default ItemEditor;
