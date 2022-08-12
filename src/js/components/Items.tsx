import {Tab, Row, Col, Nav, Modal, Button} from 'react-bootstrap'
import Grid from './inventory/Grid'
import Equipped from './inventory/Equipped'
import {equipped, belt, inventory, stash, cube} from '../Common'
import * as React from 'react'
import {D2CItem, D2CS, ItemPack, KeyValue} from '../types'
import utils from '../utils'
import * as d2s from '@dschu012/d2s'
import Item from './inventory/Item'
import Select from 'react-select'
import {onEvent, paste} from './App'
import type {gridType} from '../hooks/Grid'

type GridRowProps = {
  gridChange: (grid: gridType) => void;
  label: string;
  rowProp: string;
  grid: gridType;
}
const GridRow = ({gridChange, label, rowProp, grid}: GridRowProps) => {
  if (!grid[rowProp]) {
    grid[rowProp] = {
      w: 0,
      h: 0
    }
  }
  return (
    <div className="form-row">
      <div className="col-md-12">
        <label>{label}</label>
        <div className="input-group">
          <input
            type="number"
            min="1"
            max="20"
            className="form-control"
            defaultValue={grid[rowProp].w}
            onChange={(e) => {
              const newGrid = grid
              newGrid[rowProp].w = Number(e.currentTarget.value)
              gridChange(newGrid)
            }}
          />
          <div className="input-group-prepend input-group-append">
            <div className="input-group-text">,</div>
          </div>
          <input
            type="number"
            min="1"
            max="20"
            className="form-control"
            defaultValue={grid[rowProp].h}
            onChange={(e) => {
              const newGrid = grid
              newGrid[rowProp].h = Number(e.currentTarget.value)
              gridChange(newGrid)
            }}
          />
        </div>
      </div>
    </div>
  )
}

type GridSettingsProps = {
  gridChange: (grid: gridType) => void;
  grid: gridType;
}
const GridSettings = ({gridChange, grid}: GridSettingsProps) => {
  return (
    <>
      <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown"/>
      <div className="dropdown-menu dropdown-menu-right">
        <div className="p-3 form-group">
          <GridRow
            gridChange={gridChange}
            label={'Inventory'}
            rowProp={'inv'}
            grid={grid}
          />
          <GridRow
            gridChange={gridChange}
            label={'Belt'}
            rowProp={'belt'}
            grid={grid}
          />
          <GridRow
            gridChange={gridChange}
            label={'Stash'}
            rowProp={'stash'}
            grid={grid}
          />
          <GridRow
            gridChange={gridChange}
            label={'Cube'}
            rowProp={'cube'}
            grid={grid}
          />
        </div>
      </div>
    </>
  )
}

type RightMenuProps = {
  gridChange: (grid: gridType) => void;
  grid: gridType;
  clipboard: D2CItem | null;
  paste: paste;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const RightMenu = ({gridChange, grid, clipboard, paste, setShowModal}: RightMenuProps) => {
  return (
    <div className="float-right">
      <GridSettings
        gridChange={gridChange}
        grid={grid}
      />
      <button
        type="button"
        className="btn btn-primary"
        disabled={!clipboard}
        onClick={() => { if (clipboard) { paste(clipboard) } } }
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

type AddItemModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isThemed: boolean;
  itemPack: ItemPack;
  paste: paste;
}
const AddItemModal = ({showModal, setShowModal, itemPack, isThemed, paste}: AddItemModalProps) => {
  const [preview, setPreview] = React.useState<D2CItem | null>(null);

  const itemRows = itemPack.map(item => {
    //const keyName = item.key.replace(/\W/gm, '_')
    return {
      value: item,
      label: item.key
    }
  })

  const previewItem = async (itemData: KeyValue) => {
    const bytes = utils.b64ToArrayBuffer(itemData.value)
    await readItem(bytes, 0x60)
  }
  const onItemFileLoad = async (ev: ProgressEvent<FileReader>) => {
    // @ts-ignore
    const itemData = ev.result
    if (itemData === null) {
      throw 'Invalid data'
    }
    // @ts-ignore
    await readItem(itemData, 0x60);
    if (preview !== null) {
      paste(preview);
    }
  }
  const onItemFileChange = (event: React.FormEvent<HTMLInputElement>) => {
    const itemData = event.currentTarget.files
    const reader = new FileReader();
    if (itemData === null) {
      throw 'Invalid data'
    }
    reader.addEventListener('load', e => onItemFileLoad(e))
    reader.readAsArrayBuffer(itemData[0])
    event.currentTarget.value = '';
    handleClose()
  }
  const readItem = async (bytes: Uint8Array, version: number) => {
    const itemData = await d2s.readItem(bytes, version, window.constants.constants);
    if (itemData === null) {
      throw 'Value is null'
    }
    setPreview(itemData)
    await utils.setPropertiesOnItem(preview);
  }
  const loadBase64Item = async () => {
    try {
      const b64 = prompt('Please enter your base64 string for item.');
      if (b64 === null || b64.length < 1) {
        return;
      }
      const bytes = utils.b64ToArrayBuffer(b64);
      await readItem(bytes, 0x60);
      if (preview !== null) {
        paste(preview);
      }
    } catch (e) {
      alert('Failed to read item.');
    }
    handleClose()
  }
  const loadItem = () => {
    if (preview !== null) {
      paste(preview);
    }
    handleClose()
  }
  const handleClose = () => setShowModal(false);

  return (
    <Modal show={showModal} onHide={handleClose} dialogClassName={isThemed ? 'theme-d2' : ''}>
      <Modal.Header closeButton>
        <Modal.Title>Select an Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row d-flex justify-content-center mt-3 pl-5 pr-5">
          {preview && (
            <Item
              id={'preview'}
              item={preview}
              clazz={'item-edit'}
            />
          )}
        </div>
        <label htmlFor={'ItemSelect'}>Item</label>
        <Select
          id={'ItemSelect'}
          onChange={e => { if (e && e.value) { previewItem(e.value) } }}
          className={'react-select-container'}
          classNamePrefix={'react-select'}
          onBlur={(e) => { e.preventDefault(); return false}}
          options={itemRows}
        />
      </Modal.Body>
      <Modal.Footer>
        <input style={{display: 'none'}} type="file" name="d2iFile" onChange={onItemFileChange} id="d2iFile"/>
        <label htmlFor="d2iFile" className="mb-0 btn btn-primary">Load From File</label>
        <Button variant="primary" onClick={loadBase64Item}>
          Load From String
        </Button>
        <Button variant="primary" onClick={loadItem}>Load</Button>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

type ItemsProps = {
  saveData: D2CS;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  gridChange: (grid: gridType) => void;
  grid: gridType;
  onEvent: onEvent;
  selectEvent: React.Dispatch<React.SetStateAction<D2CItem | null>>;
  clipboard: D2CItem | null;
  paste: paste;
  isThemed: boolean;
  itemPack: ItemPack;
}
const Items = ({
  saveData,
  activeTab,
  setActiveTab,
  isThemed,
  itemPack,
  grid,
  gridChange,
  onEvent,
  selectEvent,
  clipboard,
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
        showModal={showModal}
        setShowModal={setShowModal}
        itemPack={itemPack}
        isThemed={isThemed}
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
            grid={grid}
            gridChange={gridChange}
            clipboard={clipboard}
            paste={paste}
            setShowModal={setShowModal}
          />
        </Col>
      </Row>
      <Tab.Content>
        <Tab.Pane eventKey={'equipped'}>
          <Equipped
            id={'Equipped'}
            expansion={saveData.header.status.expansion}
            items={equipped(saveData)}
            selectEvent={selectEvent}
            onEvent={onEvent}
          />
        </Tab.Pane>
        <Tab.Pane eventKey={'belt'}>
          <Grid
            id={'BeltGrid'}
            width={grid.belt.w}
            height={grid.belt.h}
            items={belt(saveData)}
            page={0}
            selectEvent={selectEvent}
            onEvent={onEvent}
          />
        </Tab.Pane>
        <Tab.Pane eventKey={'inventory'}>
          <Grid
            id={'InventoryGrid'}
            width={grid.inv.w}
            height={grid.inv.h}
            items={inventory(saveData)}
            page={1}
            selectEvent={selectEvent}
            onEvent={onEvent}
          />
        </Tab.Pane>
        <Tab.Pane eventKey={'stash'}>
          <Grid
            id={'StashGrid'}
            width={grid.stash.w}
            height={grid.stash.h}
            items={stash(saveData)}
            page={5}
            selectEvent={selectEvent}
            onEvent={onEvent}
          />
        </Tab.Pane>
        <Tab.Pane eventKey={'cube'}>
          <Grid
            id={'CubeGrid'}
            width={grid.cube.w}
            height={grid.cube.h}
            items={cube(saveData)}
            page={4}
            selectEvent={selectEvent}
            onEvent={onEvent}
          />
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  )
}

export default Items;
