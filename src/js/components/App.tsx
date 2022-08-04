import * as React from 'react'
import * as d2s from '@dschu012/d2s'
import Stats from './Stats'
import Waypoints from './Waypoints'
import Quests from './Quests'
import Skills from './Skills'
import Items from './Items'
import MessageViewer from './MessageViewer'
import NPC from './NPC'
import utils from '../utils'
import useGrid from '../hooks/Grid'
import {Dropdown, Tab, Nav, Button, ButtonGroup, Container, Col, Row, Modal} from 'react-bootstrap'

import type {
  AppElement,
  MainElement,
  NavBarElement,
  RowBottomElement,
  CharacterElement,
  locationType,
  D2CEvent,
  onEvent,
  paste,
  newChar,
  shareItem,
  saveFile,
  canPlaceItem,
  findSafeLocation,
  deleteItem,
  onMove,
  readBuffer,
  updateItemPack,
  updateSaveData,
  gridChange,
  onFileLoad,
  onFileChange,
  getLocationBasedOnActiveTab, optionClickedType, SelectedItemModalElement,
} from '../types/components/App'
import type {heightWidthType} from '../types/hooks/Grid'
import type {D2CItem, D2CS} from '../types/d2c'
import type {ItemPack} from '../types/d2'
import type {notificationType, addNotification, removeNotification} from '../types/components/MessageViewer'
import {equipped, RCGridMenu, RCItemMenu, waist} from '../Common'
import Mercenary from './Mercenary'
import ItemEditor from './inventory/ItemEditor';
//import DC6 from "../DC6";

// region JSX functions
const NavBar: NavBarElement = ({toggleTheme}) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="octicon octicon-clippy navbar-brand">
        <i className="fa fa-fw fa-github"></i>
        <a href="https://github.com/TXC">TXC</a> /
        <a className="font-weight-bold" href="https://github.com/TXC/d2s-editor">d2s-editor</a>
      </div>
      <button className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" onClick={() => toggleTheme()}>Change Theme</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

const Character: CharacterElement = ({updateSaveData}) => {
  const newChar: newChar = (index) => {
    const charPack = utils.getCharPack()
    const bytes = utils.b64ToArrayBuffer(charPack[index]);
    readBuffer(bytes);
  }
  const onFileLoad: onFileLoad = (event, filename) => {
    if (!event.currentTarget) {
      throw 'Invalid object'
    }
    // @ts-ignore
    const itemData = event.currentTarget.result
    if (itemData === null || !(itemData instanceof ArrayBuffer)) {
      throw 'Invalid data'
    }
    readBuffer(new Uint8Array(itemData), filename);
  }
  const onFileChange: onFileChange = (event) => {
    const itemData = event.currentTarget.files
    if (itemData === null) {
      throw 'Invalid data'
    }
    const reader = new FileReader();
    reader.addEventListener('load', e => {
      onFileLoad(e, itemData[0].name)
    })
    reader.readAsArrayBuffer(itemData[0]);
    //event.currentTarget.value = '';
  }
  const readBuffer: readBuffer = (bytes, filename = null) => {
    updateSaveData(null)
    d2s.read(bytes, window.constants.constants).then(response => {
      if (filename !== null) {
        response.header.name = filename.split('.')[0]
      }
      updateSaveData(response)
    });
  }

  return (
    <div className="form-group">
      <div className="input-group">
        <div className="custom-file">
          <input
            type="file"
            name="d2sFile"
            accept=".d2s"
            onChange={onFileChange}
            id="d2sFile"
          />
          <label
            className="custom-file-label"
            htmlFor="d2sFile"
          >
            *.d2s
          </label>
        </div>
        <div>
          <Dropdown>
            <Dropdown.Toggle variant="secondary">Create New</Dropdown.Toggle>

            <Dropdown.Menu align="right" >
              <Dropdown.Item onClick={() => newChar(0)}>Amazon</Dropdown.Item>
              <Dropdown.Item onClick={() => newChar(1)}>Sorceress</Dropdown.Item>
              <Dropdown.Item onClick={() => newChar(2)}>Necromancer</Dropdown.Item>
              <Dropdown.Item onClick={() => newChar(3)}>Paladin</Dropdown.Item>
              <Dropdown.Item onClick={() => newChar(4)}>Barbarian</Dropdown.Item>
              <Dropdown.Item onClick={() => newChar(5)}>Druid</Dropdown.Item>
              <Dropdown.Item onClick={() => newChar(6)}>Assassin</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="input-group-append"><span> </span></div>
      </div>
    </div>
  )
}

const RowBottom: RowBottomElement = ({saveData, updateSaveData}) => {
  const maxGold = () => {
    if (saveData === null) {
      return;
    }
    const newData = saveData
    newData.attributes.gold = saveData.header.level * 10000
    newData.attributes.stashed_gold = 2500000
    updateSaveData(newData)
  }
  const unlockQs = () => {
    if (saveData === null) {
      return;
    }
    const newData = saveData

    function update(difficulty: string, act: string, quest: string, attributes: Array<string> | null, amount: number | null) {
      if (newData === null) {
        return;
      }

      // @ts-ignore
      if (!newData.header[difficulty]) {
        // @ts-ignore
        newData.header[difficulty] = {}
      }

      // @ts-ignore
      if (!newData.header[difficulty][act]) {
        // @ts-ignore
        newData.header[difficulty][act] = {}
      }
      // @ts-ignore
      if (!newData.header[difficulty][act][quest]) {
        // @ts-ignore
        newData.header[difficulty][act][quest] = {}
      }
      // @ts-ignore
      if (newData.header[difficulty][act][quest].is_completed === false) {
        // @ts-ignore
        newData.header[difficulty][act][quest].is_completed = true;
        if (quest === 'prison_of_ice') {
          // @ts-ignore
          newData.header[difficulty][act][quest].consumed_scroll = true;
        } else {
          if (attributes === null) {
            return
          }
          if (amount === null) {
            amount = 0
          }
          for (const attribute of attributes) {
            newData.attributes[attribute] = (newData.attributes[attribute] ?? 0) + amount;
          }
        }
      }
    }

    for (const diff of ['quests_normal', 'quests_nm', 'quests_hell']) {
      update(diff, 'act_i', 'den_of_evil', ['unused_skill_points'], 1);
      update(diff, 'act_ii', 'radaments_lair', ['unused_skill_points'], 1);
      update(diff, 'act_iii', 'lam_esens_tome', ['unused_stats'], 5);
      update(diff, 'act_iii', 'the_golden_bird', ['max_hp', 'current_hp'], 20);
      update(diff, 'act_iv', 'the_fallen_angel', ['unused_skill_points'], 2);
      update(diff, 'act_v', 'prison_of_ice', null, null);
    }
    updateSaveData(newData)
  }
  const unlockHell = () => {
    if (saveData === null) {
      return;
    }
    const newData = saveData
    for (const i of ['quests_normal', 'quests_nm', 'quests_hell']) {
      // @ts-ignore
      if (!newData.header[i]) {
        // @ts-ignore
        newData.header[i] = {}
      }

      for (const j of ['act_i', 'act_ii', 'act_iii', 'act_iv', 'act_v']) {
        // @ts-ignore
        if (!newData.header[i][j]) {
          // @ts-ignore
          newData.header[i][j] = null
        }

        // @ts-ignore
        newData.header[i][j].introduced = true;
        // @ts-ignore
        newData.header[i][j].completed = true;
      }
      // @ts-ignore
      newData.header[i].act_i.sisters_to_the_slaughter.is_completed = true;
      // @ts-ignore
      newData.header[i].act_ii.the_summoner.is_completed = true;
      // @ts-ignore
      newData.header[i].act_ii.tainted_sun.is_completed = true;
      // @ts-ignore
      newData.header[i].act_ii.the_horadric_staff.is_completed = true;
      // @ts-ignore
      newData.header[i].act_ii.arcane_sanctuary.is_completed = true;
      // @ts-ignore
      newData.header[i].act_ii.the_seven_tombs.is_completed = true;
      // @ts-ignore
      newData.header[i].act_iii.khalims_will.is_completed = true;
      // @ts-ignore
      newData.header[i].act_iii.the_blackened_temple.is_completed = true;
      // @ts-ignore
      newData.header[i].act_iii.the_guardian.is_completed = true;
      // @ts-ignore
      newData.header[i].act_iv.terrors_end.is_completed = true;
      // @ts-ignore
      newData.header[i].act_v.rite_of_passage.is_completed = true;
      // @ts-ignore
      newData.header[i].act_v.eve_of_destruction.is_completed = true;
    }

    for (const i of ['normal', 'nm', 'hell']) {
      // @ts-ignore
      if (!newData.header.waypoints[i]) {
        // @ts-ignore
        newData.header.waypoints[i] = {}
      }

      // @ts-ignore
      newData.header.waypoints[i].act_i.rogue_encampement = true;
      // @ts-ignore
      newData.header.waypoints[i].act_ii.lut_gholein = true;
      // @ts-ignore
      newData.header.waypoints[i].act_iii.kurast_docks = true;
      // @ts-ignore
      newData.header.waypoints[i].act_iv.the_pandemonium_fortress = true;
      // @ts-ignore
      newData.header.waypoints[i].act_v.harrogath = true;
    }
    newData.header.progression = 15;
    updateSaveData(newData)
  }
  const unlockAllWPs = (): void => {
    if (saveData === null) {
      return
    }
    const newData = saveData
    for (const i of ['normal', 'nm', 'hell']) {
      // @ts-ignore
      for (const a in newData.header.waypoints[i]) {
        // @ts-ignore
        for (const w in newData.header.waypoints[i][a]) {
          // @ts-ignore
          newData.header.waypoints[i][a][w] = true;
        }
      }
    }
    updateSaveData(newData)
  }
  const setLvl99 = (): void => {
    if (saveData === null) {
      return
    }
    const newData = saveData
    newData.header.level = 99;
    updateSaveData(newData)
  }
  const setAllSkills20 = (): void => {
    if (saveData === null) {
      return;
    }
    const newData = saveData
    for (let i = 0; i < saveData.skills.length; i++) {
      newData.skills[i].points = 20;
    }
    updateSaveData(newData)
  }
  const saveFile: saveFile = (version: number): void => {
    if (saveData === null) {
      return;
    }

    const newData = saveData
    newData.header.version = version
    updateSaveData(newData)

    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);

    d2s.write(saveData, window.constants.constants).then(response => {
      const blob = new Blob([response], {type: 'octet/stream'});
      link.href = window.URL.createObjectURL(blob);
      link.download = saveData.header.name + '.d2s';
      link.click();
      link.remove();
    });
  }

  return (
    <Container fluid>
      <Row xs={1}>
        <Col xs={12} className="mb-2">
          <ButtonGroup className="mr-2">
            <Button onClick={unlockHell}>Unlock Hell</Button>
            <Button onClick={unlockAllWPs}>Unlock All WPs</Button>
            <Button onClick={setLvl99}>Set Level 99</Button>
            <Button onClick={setAllSkills20}>Set All Skills 20</Button>
            <Button onClick={unlockQs}>Complete Skill/Stat Qs</Button>
            <Button onClick={maxGold}>Max Gold</Button>
          </ButtonGroup>
        </Col>
      </Row>

      <Row xs={1}>
        <Col xs={12}>
          <ButtonGroup className="mr-2">
            <Button id="saveD2" onClick={() => saveFile(0x60)}>Save D2</Button>
            <Button id="saveD2R" onClick={() => saveFile(0x61)}>Save D2R</Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Container>
  )
}

const SelectedItemModal: SelectedItemModalElement = ({isThemed, selected, setSelected, location, callOnEvent}) => {
  const handleClose = () => setSelected(null);

  return (
    <Modal
      animation={false}
      size="lg"
      show={selected !== null}
      onHide={handleClose}
      dialogClassName={isThemed ? 'theme-d2' : ''}
    >
      <Modal.Header closeButton>
        <Modal.Title>Selected Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selected !== null && (
          <ItemEditor
            id={'Selected'}
            item={selected}
            location={location}
            callOnEvent={callOnEvent}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-start">
          { selected !== null && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => callOnEvent({type: 'share', item: selected })}
              >Share</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => callOnEvent({type: 'copy', item: selected })}
              >Copy</button>
              { selected.location_id !== 6 && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => callOnEvent({type: 'delete', item: selected })}
                >Delete</button>
              )}
            </>
          )}
        </div>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
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
const MainContent: MainElement = ({
  saveData,
  updateSaveData,
  gridChange,
  notifications,
  removeNotification,
  activeTab,
  setActiveTab,
  onEvent,
  selectEvent,
  grid,
  clipboard,
  paste,
  isThemed,
  itemPack
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState<string>('stats');

  return (
    <div className="row">
      <div className="offset-lg-2 col-lg-8 mt-2">
        <div className="card bg-light">
          <div className="card-body">
            <div className="alert alert-primary" role="alert">
              This editor is still a work in progress. Some things may not work. Found a bug? <a
              href="https://github.com/TXC/d2s-editor/issues/new">Report it.</a>
            </div>
            <form id="d2sForm">
              <fieldset>
                <Character updateSaveData={updateSaveData} />
                <MessageViewer messages={notifications} removeMessage={removeNotification}/>
                {saveData !== null && (
                  <Tab.Container
                    id={'tabs'}
                    defaultActiveKey={selectedIndex}
                    onSelect={(e) => {
                      if (e) {
                        setSelectedIndex(e)
                      }
                    }}
                  >
                    <Nav variant={'tabs'}>
                      <Nav.Item>
                        <Nav.Link eventKey="stats">Stats</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="waypoints">Waypoints</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="npcs">NPCs</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="quests">Quests</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="skills">Skills</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="items">Items</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="mercenary">Mercenary</Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content className="main">
                      <Tab.Pane eventKey={'stats'} transition={false}>
                        <Stats
                          saveData={saveData}
                          updateSaveData={updateSaveData}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey={'waypoints'} transition={false}>
                        <Waypoints
                          saveData={saveData}
                          updateSaveData={updateSaveData}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey={'npcs'} transition={false}>
                        <NPC
                          saveData={saveData}
                          updateSaveData={updateSaveData}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey={'quests'} transition={false}>
                        <Quests
                          saveData={saveData}
                          updateSaveData={updateSaveData}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey={'skills'} transition={false}>
                        <Skills
                          saveData={saveData}
                          updateSaveData={updateSaveData}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey={'items'} transition={false}>
                        <Items
                          saveData={saveData}
                          gridChange={gridChange}
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                          onEvent={onEvent}
                          selectEvent={selectEvent}
                          grid={grid}
                          clipboard={clipboard}
                          paste={paste}
                          isThemed={isThemed}
                          itemPack={itemPack}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey={'mercenary'} transition={false}>
                        <Mercenary
                          id={'mercenary'}
                          saveData={saveData}
                          updateSaveData={updateSaveData}
                          selectEvent={selectEvent}
                        />
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                )}
              </fieldset>
              {saveData !== null && (
                <>
                  <br/>
                  <RowBottom
                    saveData={saveData}
                    updateSaveData={updateSaveData}
                  />
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const App: AppElement = () => {
  const {grid, updateGrid} = useGrid();

  const themed = localStorage.getItem('themed') === 'true'

  const [notifications, setNotification] = React.useState<notificationType[]>([]);
  const [clipboard, setClipboard] = React.useState<D2CItem | null>(null);
  const [selected, setSelected] = React.useState<D2CItem | null>(null);
  const [location, setLocation] = React.useState<locationType | null>(null);
  const [saveData, setSaveData] = React.useState<D2CS | null>(null);
  const [itemPack, setItemPack] = React.useState<ItemPack>(utils.getItemPack());
  const [isThemed, setTheme] = React.useState<boolean>(themed);
  const [activeTab, setActiveTab] = React.useState<string>('equipped');

  const optionClicked: optionClickedType = (event) => {
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
  const gridChange: gridChange = (grid) => {
    updateGrid(grid)
  }

  // region App functions
  const canPlaceItem: canPlaceItem = (item, loc, x, y) => {
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
  const findSafeLocation: findSafeLocation = (item) => {
    const loop = (obj: heightWidthType, type: number): false | Array<number> => {
      for (let i = 0; i < obj.w; i++) {
        for (let j = 0; j < obj.h; j++) {
          if (canPlaceItem(item, type, i, j)) {
            return [0, 0, i, j, type];
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
    return [4, 0, 4, 0, 0];
  }
  const paste: paste = (item, position = []) => {
    if (saveData === null) {
      return
    }
    const copy = JSON.parse(JSON.stringify(item != null ? item : clipboard));
    const pos = position.length > 0 ? position : findSafeLocation(copy);
    copy.location_id = pos[0];
    copy.equipped_id = pos[1];
    copy.position_x = pos[2];
    copy.position_y = pos[3];
    copy.alt_position_id = pos[4];
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
  const deleteItem: deleteItem = (list, idx) => {
    list.splice(idx, 1);
    setSelected(null);
  }
  const onEvent: onEvent = (e) => {
    if (e.type == 'share') {
      shareItem(e.item);
    }
    else if (e.type == 'copy') {
      setClipboard(JSON.parse(JSON.stringify(e.item)));
    }
    else if (e.type == 'update') {
      d2s.enhanceItems([e.item], window.constants.constants);
      updateSaveData(saveData)
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
      if (!e.id) {
        return
      }

      const element = document.getElementById(e.id);
      if (element === null) {
        return
      }
      Object.assign(element.style, {
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
      if (!e.location || !e.id) {
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
        const element = document.getElementById(e.id);
        if (element === null) {
          return
        }
        Object.assign(element.style, {
          backgroundColor: 'green',
          width: `calc(var(--grid-size) * ${item.inv_width})`,
          height: `calc(var(--grid-size) * ${item.inv_height})`
        })
      }
    }
    else if (e.type == 'dragleave') {
      if (!e.id) {
        return
      }
      const element = document.getElementById(e.id);
      if (element === null) {
        return
      }
      Object.assign(element.style, {
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
        paste(e.item, [locationId, e.location.equipped_location, e.grid[0], e.grid[1], storagePage]);
      } else {
        paste(e.item);
      }
    }
  }
  const getLocationBasedOnActiveTab: getLocationBasedOnActiveTab = () => {
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
  const onMove: onMove = (item: D2CItem, e: D2CEvent) => {
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
  const shareItem: shareItem = async (item: D2CItem) => {
    const bytes = await d2s.writeItem(item, 0x60, window.constants.constants);
    const base64 = utils.arrayBufferToBase64(bytes);
    await navigator.clipboard.writeText(base64);
    addNotification({
      alert: 'alert alert-info',
      message: 'Item data copied to clipboard. Use load from string to share it with someone.'
    });
  }
  const addItemsPackBases = async (constCategory: object, categoryName: string): Promise<void> => {
    const newItems = [];
    for (const item of Object.entries(constCategory)) {
      if (item[1].n) {
        const newItem = Object();
        const value = item[1];
        newItem.type = item[0];
        newItem.quality = 2;
        newItem.level = 41;
        newItem.inv_width = value.iw;
        newItem.inv_height = value.ih;
        newItem.categories = value.c;
        newItem.identified = 1;
        if (newItem.categories.indexOf('Weapon') > -1) {
          newItem.base_damage = {
            'mindam': value.mind,
            'maxdam': value.maxd,
            'twohandmindam': value.min2d,
            'twohandmaxdmm': value.max2d
          }
        }
        if (newItem.categories.indexOf('Any Armor') > -1) {
          newItem.defense_rating = value.maxac;
        }
        newItem.max_durability = value.durability;
        newItem.current_durability = value.durability;
        newItems.push(newItem);
      }
    }

    await d2s.enhanceItems(newItems, window.constants.constants);
    for (const item of newItems) {
      const bytes = await d2s.writeItem(item, 0x60, window.constants.constants);
      const base64 = utils.arrayBufferToBase64(bytes);
      const category = item.categories[0];
      updateItemPack({
        key: './Bases/' + categoryName + '/' + category + '/' + item.type_name + '.d2i',
        value: base64
      });
    }
  }

  const addNotification: addNotification = (data) => {
    setNotification(prev => {
      return [...new Set([data, ...prev])]
    })

  }
  const removeNotification: removeNotification = (idx): void => {
    setNotification(list => {
      list.splice(idx, 1)
      return list
    })
  }

  const toggleTheme = (): void => {
    setTheme(!isThemed)
  }
  const updateItemPack: updateItemPack = (newData) => {
    const newPack = itemPack
    newPack.push(newData)
    setItemPack(newPack)
  }
  const updateSaveData: updateSaveData = (newData) => {
    if (newData === null) {
      setSaveData(null)
      return
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

    addItemsPackBases(window.constants.constants.weapon_items, 'Weapons');
    addItemsPackBases(window.constants.constants.armor_items, 'Armor');
  }, [])

  React.useEffect(() => {
    localStorage.setItem('themed', isThemed ? 'true' : 'false');
  }, [isThemed])

  // updateLocation
  React.useEffect(() => {
    if (selected === null) {
      setLocation(null)
      return;
    }
    setLocation({
      location: selected.location_id,
      equipped_location: selected.equipped_id,
      x: selected.position_x,
      y: selected.position_y,
      storage_page: selected.alt_position_id
    })
  }, [selected])

  // setPropertiesOnSave
  React.useEffect(() => {
    if (saveData === null) {
      return;
    }
    const oldData = saveData;
    [...saveData.items, ...saveData.merc_items, ...saveData.corpse_items, saveData.golem_item].forEach((item) => {
      utils.setPropertiesOnItem(item)
    });
    saveData.items = saveData.items.map((item) => {
      if (item.location_id !== 2) {
        return item
      }
      item.position_x = ((item.position_y * 4) + item.position_x)
      item.position_y = 0
      return item;
    })

    const waistItem = waist(equipped(saveData))
    if (waistItem) {
      const newGrid = grid
      if (waistItem.level < 3) {
        newGrid.belt.h = 1
      } else if (waistItem.level > 3 && waistItem.level < 12) {
        newGrid.belt.h = 2
      } else if (waistItem.level > 12 && waistItem.level < 27) {
        newGrid.belt.h = 3
      } else if (waistItem.level > 27) {
        newGrid.belt.h = 4
      }
      gridChange(newGrid)
    }

    if (JSON.stringify(oldData) !== JSON.stringify(saveData)) {
      setSaveData(saveData)
    }
  }, [saveData])

      //<Prutt/>
  return (
    <div className={isThemed ? 'theme-d2' : ''}>
      <NavBar toggleTheme={toggleTheme}/>
      <RCItemMenu optionClicked={optionClicked} />
      <RCGridMenu optionClicked={optionClicked} />
      <SelectedItemModal
        isThemed={isThemed}
        location={location}
        selected={selected}
        setSelected={setSelected}
        callOnEvent={onEvent}
      />
      <div className="container-fluid">
        <MainContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onEvent={onEvent}
          selectEvent={setSelected}
          saveData={saveData}
          updateSaveData={updateSaveData}
          notifications={notifications}
          removeNotification={removeNotification}
          gridChange={gridChange}
          grid={grid}
          paste={paste}
          clipboard={clipboard}
          isThemed={isThemed}
          itemPack={itemPack}
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
