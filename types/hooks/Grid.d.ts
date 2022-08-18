import * as React from 'react';
export declare type heightWidthType = {
    w: number;
    h: number;
};
export declare type gridType = {
    [key: string]: heightWidthType;
    inv: heightWidthType;
    stash: heightWidthType;
    cube: heightWidthType;
    belt: heightWidthType;
};
declare const _default: () => {
    grid: gridType;
    updateGrid: (newGrid: gridType) => void;
    setGrid: React.Dispatch<React.SetStateAction<gridType>>;
};
export default _default;
