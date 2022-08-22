import * as React from 'react'
import * as d2s from '@dschu012/d2s'
import utils from '../utils'
import useGrid, {GridProp} from '../hooks/Grid'
import useTheme, {ThemeProp} from '../hooks/Theme'
import useClipBoard, {ClipboardProp} from '../hooks/ClipBoard'
import useNotification, {NotificationProp} from '../hooks/Notifications'
import useSelectedItem, {LocationProp, locationType, SelectedProp} from '../hooks/SelectedItem'
import SelectedItemModal from './modal/SelectedItem'
import NavigationBar from './NavBar'
import MainContent from './Main'
import type {heightWidthType} from '../hooks/Grid'
import type {D2CItem, D2CS} from '../types'
import {equipped, RCGridMenu, RCItemMenu, waist} from '../Common'
//import DC6 from "../DC6";

export type updateSaveData = (newData: D2CS|null) => void
export type D2CEvent = {
  uuid?: string;
  item: D2CItem;
  grid?: Array<number>;
  ref?: React.RefObject<HTMLDivElement>;
  location?: locationType,
  type: string;
}
export type onEvent = (e: D2CEvent) => void;
export type paste = (item: D2CItem|null, position?: locationType) => void;
export type optionClickedProps = {
  type: string;
  item?: D2CItem;
  grid?: Array<number>;
}

/*
const Prutt = () => {
  const [img, setImg] = React.useState<string|null>(null);

  const dc6 = DC6.loadFile('data/global/ui/SPELLS/skltree_s_back.dc6')
  setTimeout(() => {
    const imgHdr = dc6.getHeader(),
          frame = dc6.getFrame(0, 6)


    frame.getImageB64().then(data => {
      if (data) {
        setImg(data)
      }
    })
      console.log(imgHdr, frame)
  }, 1000)

  return (
    <div>
      {img && (
        <img src={img} alt="" style={{ float: 'left' }} />
      )}
    </div>
  )
}
*/

export type Hook = {
  grid: GridProp
  theme: ThemeProp
  notification: NotificationProp
  clipboard: ClipboardProp
  selected: SelectedProp
  location: LocationProp
}

const App = () => {
  const {grid, calculateBeltSize, updateGrid} = useGrid()
  const {isThemed, toggleTheme} = useTheme()
  const {notifications, addNotification, removeNotification} = useNotification()
  const {setSelected, selected, setLocation, location} = useSelectedItem()
  const {clipboard, setClipboard} = useClipBoard()
  const Hook: Hook = {
    grid: {grid: grid, calculateBeltSize: calculateBeltSize, updateGrid: updateGrid},
    theme: {isThemed: isThemed, toggleTheme: toggleTheme},
    notification: {notifications: notifications, removeNotification: removeNotification, addNotification: addNotification},
    clipboard: {clipboard: clipboard, setClipboard: setClipboard},
    selected: {selected: selected, setSelected: setSelected},
    location: {location: location, setLocation: setLocation}
  }

  const [saveData, setSaveData] = React.useState<D2CS | null>(null);
  const [activeTab, setActiveTab] = React.useState<string>('equipped');

  const optionClicked = (event: optionClickedProps) => {
    switch (event.type) {
      case 'Delete':
        if (!event.item) {
          throw 'Invalid object'
        }
        onEvent({
          type: 'delete',
          item: event.item
        });
        break;
      case 'Copy':
        if (!event.item) {
          throw 'Invalid object'
        }
        onEvent({
          type: 'copy',
          item: event.item
        });
        break;
      case 'Share':
        if (!event.item) {
          throw 'Invalid object'
        }
        onEvent({
          type: 'share',
          item: event.item
        });
        break;
      case 'Paste At':
        if (!event.grid || clipboard == null) {
          break;
        }
        onEvent({
          type: 'pasteAt',
          item: clipboard,
          grid: event.grid
        });
        break;
      case 'Select':
        if (!event.item) {
          throw 'Invalid object'
        }
        setSelected(event.item);
        break;
    }
  }

  // region App functions
  const canPlaceItem = (item: D2CItem, loc: number, x: number, y: number) => {
    if (saveData === null) {
      return false
    }
    let bounds
    if (loc == 4) {
      bounds = grid.cube
    } else if (loc == 5) {
      bounds = grid.stash
    } else {
      bounds = grid.inv
    }
    if ((x + item.inv_width) > bounds.w) {
      return false
    }
    if ((y + item.inv_height) > bounds.h) {
      return false
    }
    const rect = [x, y, x + item.inv_width, y + item.inv_height];
    const closeItems = saveData.items.filter(
      item => item.location_id === 0 && item.alt_position_id === loc,
    )
    for (const closeItem of closeItems) {
      const r = [closeItem.position_x, closeItem.position_y, closeItem.position_x + closeItem.inv_width, closeItem.position_y + closeItem.inv_height]
      if (utils.contains(rect, r) || utils.overlaps(rect, r)) {
        return false
      }
    }
    return true
  }
  const findSafeLocation = (item: D2CItem) => {
    const loop = (obj: heightWidthType, type: number): locationType | false => {
      for (let i = 0; i < obj.w; i++) {
        for (let j = 0; j < obj.h; j++) {
          if (canPlaceItem(item, type, i, j)) {
            return {
              location: 0,
              equipped_location: 0,
              x: i,
              y: j,
              storage_page: type
            }
          }
        }
      }
      return false;
    }
    let result;
    //inv = 1, cube = 4, stash = 5
    if ((result = loop(grid.inv, 1)) !== false) {
      return result;
    }
    if ((result = loop(grid.stash, 5)) !== false) {
      return result;
    }
    if ((result = loop(grid.cube, 4)) !== false) {
      return result;
    }
    return {
      location: 4,
      equipped_location: 0,
      x: 4,
      y: 0,
      storage_page: 0
    }
  }
  const paste: paste = (item, position) => {
    if (saveData === null) {
      return
    }
    const copy = JSON.parse(JSON.stringify(item != null ? item : clipboard));

    const pos = !position ? findSafeLocation(copy) : position
    copy.location_id = pos.location;
    copy.equipped_id = pos.equipped_location;
    copy.position_x = pos.x;
    copy.position_y = pos.y;
    copy.alt_position_id = pos.storage_page;

    if (copy.location_id === 4) {
      addNotification({
        alert: 'alert alert-warning',
        message: 'Could not find safe location to place item. Placed in mouse buffer.'
      });
    } else {
      const loc = copy.alt_position_id === 1 ? 'inventory' : (copy.alt_position_id === 5 ? 'stash' : 'cube');
      addNotification({
        alert: 'alert alert-info',
        message: `Loaded item in ${loc} at ${copy.position_x}, ${copy.position_y}`
      });
    }
    const newData = saveData
    newData.items.push(copy)
    updateSaveData(newData)
    //saveData.items.push(copy);
    setSelected(copy);
  }
  const deleteItem = (list: D2CItem[], idx: number) => {
    list.splice(idx, 1);
    setSelected(null);
  }
  const onEvent = (e: D2CEvent) => {
    if (e.type == 'share') {
      shareItem(e.item);
    }
    else if (e.type == 'copy') {
      setClipboard(JSON.parse(JSON.stringify(e.item)));
    }
    else if (e.type == 'update') {
      if (saveData === null) {
        return
      }
      d2s.enhanceItems([e.item], window.constants.constants);
      const newData = saveData
      const idx = utils.findIndex(newData.items, e.item);
      newData.items[idx] = e.item;
      console.log(e, idx, newData.items[idx])
      updateSaveData(newData)
      //utils.setPropertiesOnItem(e.item);
    }
    else if (e.type == 'delete') {
      if (saveData === null) {
        return;
      }
      let idx = utils.findIndex(saveData.items, e.item);
      if (idx != -1) {
        deleteItem(saveData.items, idx);
        return
      }
      idx = utils.findIndex(saveData.merc_items, e.item);
      if (idx != -1) {
        deleteItem(saveData.merc_items, idx);
        return
      }
    }
    else if (e.type == 'move') {
      if (!e.ref || !e.ref.current) {
        return
      }

      Object.assign(e.ref.current.style, {
        backgroundColor: '',
        width: '',
        height: ''
      })
      if (window.uuid == e.uuid) {
        if (saveData === null) {
          return;
        }
        const idx = utils.findIndex(saveData.items, e.item);
        onMove(saveData.items[idx], e);
      } else {
        //copy to another tab
        if (onMove(e.item, e)) {
          if (saveData === null) {
            return;
          }
          saveData.items.push(e.item);
        }
      }
    }
    else if (e.type == 'dragenter') {
      if (!e.location) {
        console.error('Missing location')
        return
      }
      if (!e.ref || !e.ref.current) {
        return
      }
      if (!e.location.x) {
        e.location.x = 0;
      }
      if (!e.location.y) {
        e.location.y = 0;
      }
      if (!e.location.storage_page) {
        const {storagePage} = getLocationBasedOnActiveTab()
        e.location.storage_page = storagePage
      }

      const item = e.item;
      if (canPlaceItem(item, e.location.storage_page, e.location.x, e.location.y)) {
        Object.assign(e.ref.current.style, {
          backgroundColor: 'green',
          width: `calc(var(--grid-size) * ${item.inv_width})`,
          height: `calc(var(--grid-size) * ${item.inv_height})`
        })
      }
    }
    else if (e.type == 'dragleave') {
      if (!e.ref || !e.ref.current) {
        return
      }
      Object.assign(e.ref.current.style, {
        backgroundColor: '',
        width: '',
        height: ''
      })
    }
    else if (e.type === 'pasteAt') {
      if (!e.grid || !e.location || !e.location.equipped_location) {
        return
      }
      const {locationId, storagePage} = getLocationBasedOnActiveTab()
      if (canPlaceItem(e.item, storagePage, e.grid[0], e.grid[1])) {
        paste(e.item, {
          location: locationId,
          equipped_location: e.location.equipped_location,
          x: e.grid[0],
          y: e.grid[1],
          storage_page: storagePage
        });
      } else {
        paste(e.item);
      }
    }
  }
  const getLocationBasedOnActiveTab = () => {
    let locationId = 0, storagePage
    switch (activeTab) {
      case 'equipped': // Equipped
        locationId = 1
        storagePage = 1
        break;
      case 'belt': // Belt
        locationId = 2
        storagePage = 1;
        break;
      case 'stash': // Stash
        storagePage = 5;
        break;
      case 'cube': // Cube
        storagePage = 4;
        break;
      default: // Inventory
        locationId = 0
        storagePage = 1;
        break;
    }
    return {
      locationId: locationId,
      storagePage: storagePage
    }
  }
  const onMove = (item: D2CItem, e: D2CEvent) => {
    if (!e.location) {
      throw 'Invalid argument'
    }
    if (e.location.location == 1) {
      if (!e.location.equipped_location) {
        throw 'Invalid argument'
      }
      item.location_id = e.location.location;
      item.equipped_id = e.location.equipped_location;
      item.position_x = 0;
      item.position_y = 0;
      item.alt_position_id = 0;
    }
    else if (e.location.location == 0) {
      if (!e.location.x || !e.location.y || !e.location.storage_page) {
        throw 'Invalid argument'
      }
      if (!canPlaceItem(item, e.location.storage_page, e.location.x, e.location.y)) {
        return false;
      }
      item.location_id = e.location.location;
      item.equipped_id = 0;
      item.position_x = e.location.x;
      item.position_y = e.location.y;
      item.alt_position_id = e.location.storage_page;
    }
    else if (e.location.location == 4) {
      item.location_id = e.location.location;
      item.equipped_id = 0;
      item.position_x = 4; //why?
      item.position_y = 0;
      item.alt_position_id = 0;
    }
    return true;
  }
  const shareItem = async (item: D2CItem) => {
    const bytes = await d2s.writeItem(item, 0x60, window.constants.constants);
    const base64 = utils.arrayBufferToBase64(bytes);
    await navigator.clipboard.writeText(base64);
    addNotification({
      alert: 'alert alert-info',
      message: 'Item data copied to clipboard. Use load from string to share it with someone.'
    });
  }

  const updateSaveData = (newData: D2CS | null) => {
    if (newData === null) {
      setSaveData(null)
      return
    }
    [...newData.items, ...newData.merc_items, ...newData.corpse_items, newData.golem_item].forEach((item) => {
      utils.setPropertiesOnItem(item)
    });
    newData.items = newData.items.map((item) => {
      if (item.location_id !== 2) {
        return item
      }
      item.position_x = ((item.position_y * 4) + item.position_x)
      item.position_y = 0
      return item;
    })

    const waistItem = waist(equipped(newData))
    if (waistItem) {
      calculateBeltSize(waistItem)
    }
    setSaveData(prev => {
      if (prev === null) {
        return Object.assign({}, newData)
      }
      return Object.assign(prev, newData)
    })
  }
  // endregion App functions

  React.useEffect(() => {
    if (localStorage.getItem('palettes') === null) {
      utils.getPalettes()
    }
  }, [])
  //<Prutt/>
  return (
    <div className={isThemed ? 'theme-d2' : ''}>
      <NavigationBar useTheme={useTheme}/>
      <RCItemMenu optionClicked={optionClicked} />
      <RCGridMenu optionClicked={optionClicked} />
      <SelectedItemModal
        hook={Hook}
        callOnEvent={onEvent}
      />
      <div className="container-fluid">
        <MainContent
          hook={Hook}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onEvent={onEvent}
          saveData={saveData}
          updateSaveData={updateSaveData}
          paste={paste}
        />
      </div>
      {isThemed && (
        <div className="text-center mt-3">
          Credits to Dimka-DJZLO at <a href="https://discord.gg/NvfftHY">Phrozen Keep</a> for the theme!
        </div>
      )}
    </div>
  )
}
// endregion JSX functions

export default App
