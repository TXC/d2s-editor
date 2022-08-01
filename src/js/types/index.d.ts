import type {types} from "@dschu012/d2s";

declare global {
  interface Window {
    uuid: string;
    palettes: any;
    constants: {
      constants: types.IConstantData
    }
  }
}

export * from "./components/inventory";
export * as d2 from "./d2";
export * from "./hooks";

export {EquipDrop, EquipDragOver, EquipDragEnter, EquipDragLeave, EquipItemRC, EquipOnSelect, EquippedItemType} from "./Common";
export * as d2c from "./d2c";
//export * from "./html";
export * from "./utils";
