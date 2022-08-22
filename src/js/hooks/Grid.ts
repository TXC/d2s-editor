import * as React from 'react'
import {D2CItem} from '../types'

export type heightWidthType = {
  w: number;
  h: number;
}

export type gridType = {
  [key: string]: heightWidthType;
  inv: heightWidthType;
  stash: heightWidthType;
  cube: heightWidthType;
  belt: heightWidthType;
}

const defaultGrid: gridType = {
  inv: {w: 10, h: 4},
  stash: {w: 10, h: 10},
  cube: {w: 3, h: 4},
  belt: {w: 4, h: 1}
};

export type GridProp = {
  grid: gridType
  calculateBeltSize: (item: D2CItem) => void
  updateGrid: (grid: gridType) => void
  setGrid?: React.Dispatch<React.SetStateAction<gridType>>
}
export type Grid = () => GridProp
export default (): GridProp => {
  const [grid, setGrid] = React.useState<gridType>(defaultGrid)

  const calculateBeltSize = (item: D2CItem) => {
    const newGrid = grid
    if (item.level < 3) {
      newGrid.belt.h = 1
    } else if (item.level >= 3 && item.level < 12) {
      newGrid.belt.h = 2
    } else if (item.level >= 12 && item.level < 27) {
      newGrid.belt.h = 3
    } else if (item.level >= 27) {
      newGrid.belt.h = 4
    }
    setGrid(newGrid)
  }
  const updateGrid = (newGrid: gridType) => {
    setGrid(prev => {
      return Object.assign(prev, newGrid)
    })
  }
  React.useDebugValue(JSON.stringify(grid))

  return {grid, calculateBeltSize, updateGrid, setGrid}
}
