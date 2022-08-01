import * as React from 'react'
import {gridType} from '../types'

export default () => {
    const defaultGrid: gridType = {
      inv: { w: 10, h: 4 },
      stash: { w: 10, h: 10 },
      cube: { w: 3, h: 4 },
      belt: { w: 4, h: 1 }
    };

    let gridObject
    const lsGrid = localStorage.getItem('grid')
    if (lsGrid === null) {
        gridObject = defaultGrid
    } else {
        gridObject = JSON.parse(lsGrid)
    }

    const [grid, setGrid] = React.useState<gridType>(gridObject)

    React.useEffect(() => {
        localStorage.setItem('grid', JSON.stringify(grid));
    }, [grid])

    const updateGrid = (newGrid: gridType) => {
        setGrid(prev => {
            return Object.assign(prev, newGrid)
        })
    }

    return { grid, updateGrid, setGrid }
}
