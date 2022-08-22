import {Tab, Row, Col, Nav, Dropdown} from 'react-bootstrap'
import Grid from './inventory/Grid'
import Equipped from './inventory/Equipped'
import {equipped, belt, inventory, stash, cube} from '../Common'
import * as React from 'react'
import {D2CS} from '../types'
import {Hook, onEvent, paste} from './App'
import AddItemModal from './modal/AddItem'

type GridRowProps = {
  hook: Hook
  label: string
  rowProp: string
}
const GridRow = ({hook, label, rowProp}: GridRowProps) => {
  if (!hook.grid.grid[rowProp]) {
    hook.grid.grid[rowProp] = {
      w: 0,
      h: 0
    }
  }
  return (
    <div className="row">
      <div className="col">
        <label>{label}</label>
        <div className="input-group">
          <input
            type="number"
            min="1"
            max="20"
            className="form-control"
            defaultValue={hook.grid.grid[rowProp].w}
            onChange={(e) => {
              const newGrid = hook.grid.grid
              newGrid[rowProp].w = Number(e.currentTarget.value)
              hook.grid.updateGrid(newGrid)
            }}
          />
          <div className="input-group-text">,</div>
          <input
            type="number"
            min="1"
            max="20"
            className="form-control"
            defaultValue={hook.grid.grid[rowProp].h}
            onChange={(e) => {
              const newGrid = hook.grid.grid
              newGrid[rowProp].h = Number(e.currentTarget.value)
              hook.grid.updateGrid(newGrid)
            }}
          />
        </div>
      </div>
    </div>
  )
}

type GridSettingsProps = {
  hook: Hook
}
const GridSettings = ({hook}: GridSettingsProps) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="secondary" />

      <Dropdown.Menu>
        <div className="p-3 form-group">
          <GridRow
            hook={hook}
            label={'Inventory'}
            rowProp={'inv'}
          />
          <GridRow
            hook={hook}
            label={'Belt'}
            rowProp={'belt'}
          />
          <GridRow
            hook={hook}
            label={'Stash'}
            rowProp={'stash'}
          />
          <GridRow
            hook={hook}
            label={'Cube'}
            rowProp={'cube'}
          />
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}

type RightMenuProps = {
  hook: Hook
  paste: paste;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const RightMenu = ({hook, paste, setShowModal}: RightMenuProps) => {
  return (
    <div className="btn-group" role="group">
      <GridSettings hook={hook}/>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!hook.clipboard.clipboard}
        onClick={() => { if (hook.clipboard.clipboard) { paste(hook.clipboard.clipboard) } } }
      >
        Paste
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setShowModal(true)}
      >
        Load Item
      </button>
    </div>
  )
}

type ItemsProps = {
  hook: Hook
  saveData: D2CS
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
  onEvent: onEvent
  paste: paste
}
const Items = ({
  hook,
  saveData,
  activeTab,
  setActiveTab,
  onEvent,
  paste,
}: ItemsProps) => {
  const [showModal, setShowModal] = React.useState<boolean>(false);

  return (
    <Tab.Container
      id={'items-tabs'}
      defaultActiveKey={activeTab}
      mountOnEnter={true}
      transition={false}
      onSelect={(e) => {
        if (e) {
          setActiveTab(e)
        }
      }}
    >
      <AddItemModal
        hook={hook}
        showModal={showModal}
        setShowModal={setShowModal}
        paste={paste}
      />
      <Row className={'mt-3'}>
        <Col md={6} className={'btn-group overflow-auto offset-md-3'} role={'group'}>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link
                eventKey="equipped"
                className={'btn btn-secondary'}
              >
                Equipped
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="belt"
                className={'btn btn-secondary'}
              >
                Belt
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="inventory"
                className={'btn btn-secondary'}
              >
                Inventory
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="stash"
                className={'btn btn-secondary'}
              >
                Stash
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="cube"
                className={'btn btn-secondary'}
              >
                Cube
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={3}>
          <RightMenu
            hook={hook}
            paste={paste}
            setShowModal={setShowModal}
          />
        </Col>
      </Row>
      <Tab.Content>
        <Tab.Pane eventKey={'equipped'}>
          <Equipped
            expansion={saveData.header.status.expansion}
            items={equipped(saveData)}
            hook={hook}
            onEvent={onEvent}
          />
        </Tab.Pane>
        <Tab.Pane eventKey={'belt'}>
          <Grid
            id={'BeltGrid'}
            hook={hook}
            width={hook.grid.grid.belt.w}
            height={hook.grid.grid.belt.h}
            items={belt(saveData)}
            page={0}
            onEvent={onEvent}
          />
        </Tab.Pane>
        <Tab.Pane eventKey={'inventory'}>
          <Grid
            id={'InventoryGrid'}
            hook={hook}
            width={hook.grid.grid.inv.w}
            height={hook.grid.grid.inv.h}
            items={inventory(saveData)}
            page={1}
            onEvent={onEvent}
          />
        </Tab.Pane>
        <Tab.Pane eventKey={'stash'}>
          <Grid
            id={'StashGrid'}
            hook={hook}
            width={hook.grid.grid.stash.w}
            height={hook.grid.grid.stash.h}
            items={stash(saveData)}
            page={5}
            onEvent={onEvent}
          />
        </Tab.Pane>
        <Tab.Pane eventKey={'cube'}>
          <Grid
            id={'CubeGrid'}
            hook={hook}
            width={hook.grid.grid.cube.w}
            height={hook.grid.grid.cube.h}
            items={cube(saveData)}
            page={4}
            onEvent={onEvent}
          />
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  )
}

export default Items;
