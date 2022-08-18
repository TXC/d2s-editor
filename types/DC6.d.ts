import * as d2s from '@dschu012/d2s';
import { D2CItem } from './types';
declare class DC6Common {
    protected dc6: Uint8Array | null;
    protected setData(data: Uint8Array): void;
    getData(): Uint8Array;
    protected getLong(idx: number): number;
    protected getUByte(idx: number, bytes?: number): number;
}
declare class DC6 extends DC6Common {
    private frameTable;
    version: number;
    termination: number;
    directions: number;
    framesPerDirection: number;
    constructor();
    private load;
    static loadFile(file: string): DC6;
    static loadItem(item: d2s.types.IItem): DC6;
    private readHeader;
    getHeader(): {
        version: number;
        termination: number;
        directions: number;
        framesPerDirection: number;
        frameTable: number[][];
    };
    getFrame(direction: number, frame: number): DC6Frame;
}
declare class DC6Frame extends DC6Common {
    private readonly offset;
    private readonly item;
    private flip;
    private width;
    private height;
    private offset_x;
    private offset_y;
    private next_block;
    private length;
    constructor(dc6: DC6, offset: number, item?: D2CItem | null);
    private readHeader;
    getHeader(): {
        flip: number;
        width: number;
        height: number;
        offset_x: number;
        offset_y: number;
        next_block: number;
        length: number;
    };
    getPaletteData(): any[][] | null;
    getImageB64(): Promise<string>;
}
export default DC6;
