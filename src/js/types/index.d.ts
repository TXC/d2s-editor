import type {types} from '@dschu012/d2s'

declare global {
  interface Window {
    uuid: string;
    palettes: any;
    constants: {
      constants: types.IConstantData
    }
  }
}

export * from './d2'
export * from './d2c'
