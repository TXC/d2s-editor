import * as React from 'react';
import type { D2CItem } from '../../types';
export declare type itemRC = ($event: React.MouseEvent, item: D2CItem) => void;
declare type ItemProps = {
    item: D2CItem;
    clazz?: string;
    clickEvent?: () => void;
    contextMenuEvent?: React.MouseEventHandler;
};
declare const Item: ({ item, clazz, clickEvent, contextMenuEvent }: ItemProps) => JSX.Element;
export default Item;
