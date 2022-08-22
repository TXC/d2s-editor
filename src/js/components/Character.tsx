import * as React from 'react'
import utils from '../utils'
import * as d2s from '@dschu012/d2s'
import {Dropdown} from 'react-bootstrap'
import {updateSaveData} from './App'

type CharacterProps = {
  updateSaveData: updateSaveData;
}
const Character = ({updateSaveData}: CharacterProps) => {
  const id = React.useId()
  const newChar= (index: number) => {
    const charPack = utils.getCharPack()
    const bytes = utils.b64ToArrayBuffer(charPack[index]);
    readBuffer(bytes);
  }
  const onFileLoad = (event: ProgressEvent<FileReader>, filename: string) => {
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
  const onFileChange = (event: React.FormEvent<HTMLInputElement>) => {
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
  const readBuffer = (bytes: Uint8Array, filename: string|null = null) => {
    updateSaveData(null)
    d2s.read(bytes, window.constants.constants).then(response => {
      if (filename !== null) {
        response.header.name = filename.split('.')[0]
      }
      updateSaveData(response)
    });
  }

  return (
    <div className="form-group mb-4">
      <div className="input-group">
        <div className="form-control custom-file">
          <input
            type="file"
            name="d2sFile"
            className="custom-file-input"
            accept=".d2s"
            placeholder="*.d2s"
            onChange={onFileChange}
            id={id}
          />
          <label
            className="custom-file-label"
            htmlFor={id}
          >
            *.d2s
          </label>
        </div>
        <Dropdown>
          <Dropdown.Toggle variant="secondary">Create New</Dropdown.Toggle>

          <Dropdown.Menu>
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
    </div>
  )
}

export default Character
