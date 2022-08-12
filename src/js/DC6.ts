import * as d2s from '@dschu012/d2s'
import utils from './utils'
import {D2CItem} from './types'

class DC6Common {
  protected dc6: Uint8Array|null = null;

  protected setData (data: Uint8Array) {
    this.dc6 = data
  }

  public getData (): Uint8Array {
    if (this.dc6 === null) {
      throw 'File not loaded yet'
    }
    return this.dc6
  }

  protected getLong (idx: number): number {
    if (this.dc6 === null) {
      throw 'File not loaded yet'
    }

    if (
      typeof this.dc6[idx] === 'undefined'
      || typeof this.dc6[idx + 1] === 'undefined'
      || typeof this.dc6[idx + 2] === 'undefined'
    ) {
      throw 'Undefined indexes'
    }

    return this.dc6[idx] | this.dc6[idx + 1] << 8 | this.dc6[idx + 2] << 16 | this.dc6[idx + 2] << 24
  }

  protected getUByte (idx: number, bytes = 1): number {
    if (this.dc6 === null) {
      throw 'File not loaded yet'
    }

    let result = 0
    for (let i = 0; i < bytes; i++) {
      if (typeof this.dc6[idx + i] === 'undefined') {
        throw `Undefined index (${idx} + ${i})`
      }

      result += Number(this.dc6[idx + i])
    }
    return result
  }
}

class DC6 extends DC6Common {
  private frameTable: number[][] = [];
  public version = 0
  public termination = 0
  public directions = 0
  public framesPerDirection = 0

  public constructor() {
    super()
  }

  private async load (file: string) {
    const response = await fetch(file)
    if (response.status !== 200) {
      throw `Invalid response (${response.status})`
    }
    this.setData(new Uint8Array(await response.arrayBuffer()))
  }

  public static loadFile (file: string) {
    const dc6 = new DC6()
    dc6.load(file)
    return dc6
  }

  public static loadItem(item: d2s.types.IItem) {
    return DC6.loadFile(`data/global/items/${item.inv_file}.dc6`)
  }

  private readHeader() {
    const directions = this.getLong(16),
      framesPerDirection = this.getLong(20)

    let offset = 24
    for (let i = 0; i < directions; i++) {
      if (!this.frameTable[i]) {
        this.frameTable[i] = [];
      }
      for (let j = 0; j < framesPerDirection; j++) {
        this.frameTable[i][j] = this.getLong(offset)
        offset += 4
      }
    }
    this.version = this.getLong(0)
    //this.unknown1 = this.getLong(4)
    //this.unknown2 = this.getLong(8)
    this.termination = this.getUByte(12, 4)
    this.directions = directions
    this.framesPerDirection = framesPerDirection
  }

  public getHeader () {
    this.readHeader()
    return {
      version: this.version,
      termination: this.termination,
      directions: this.directions,
      framesPerDirection: this.framesPerDirection,
      frameTable: this.frameTable,
    }
  }

  public getFrame(direction: number, frame: number): DC6Frame {
    if (!this.frameTable[direction]) {
      console.log(this.frameTable)
      throw 'Invalid frameTable'
    }

    const offset = this.frameTable[direction][frame]
    if (!offset) {
      throw 'Unable to locate offset'
    }
    return new DC6Frame(this, offset)
  }
}

class DC6Frame extends DC6Common {
  private readonly offset: number
  private readonly item: D2CItem | null
  private flip = 0
  private width = 0
  private height = 0
  private offset_x = 0
  private offset_y = 0    // from bottom border, not up
  private next_block = 0
  private length = 0

  public constructor(dc6: DC6, offset: number, item: D2CItem | null = null) {
    super()
    this.setData(dc6.getData())
    this.offset = offset
    this.item = item
    this.readHeader()
  }

  private readHeader () {
    this.flip = this.getLong(this.offset)
    this.width = this.getLong(this.offset + 4)
    this.height = this.getLong(this.offset + 8)
    this.offset_x = this.getLong(this.offset + 12)
    this.offset_y = this.getLong(this.offset + 16)
    //this.unknown = this.getLong(this.offset + 20)
    this.next_block = this.getLong(this.offset + 24)
    this.length = this.getLong(this.offset + 28)
  }

  public getHeader () {
    this.readHeader()
    return {
      flip: this.flip,
      width: this.width,
      height: this.height,
      offset_x: this.offset_x,
      offset_y: this.offset_y,
      next_block: this.next_block,
      length: this.length
    }
  }

  public getPaletteData () {
    this.readHeader()
    let x = 0, y = this.height - 1
    const indexed = []
    if (this.width === 0 || this.height === 0) {
      return null
    }
    for (let i = 0; i < this.height; i += 1) {
      indexed[i] = Array(this.width).fill(255)
    }

    for (let i = 0; i < this.length;) {
      const b = this.getUByte(this.offset + i++)
      if (b === 0x80) {         //eol
        x = 0
        y--
      } else if (b & 0x80) {    //transparent repeat for N bytes
        x += b & 0x7F
      } else {                  //read N bytes
        for (let j = 0; j < b; j++) {
          indexed[y][x++] = this.getUByte(this.offset + i++)
        }
      }
    }
    return indexed
  }

  public async getImageB64 () {
    const indexed = this.getPaletteData()
    const canvas = document.createElement('canvas'),
          context = canvas.getContext('2d')

    if (indexed === null) {
      throw 'Invalid palette'
    }

    if (context === null) {
      throw 'Invalid context'
    }

    const data = context.createImageData(this.width, this.height)
    canvas.height = this.height
    canvas.width = this.width

    let palettes = localStorage.getItem('palettes')
    if (palettes === null) {
      palettes = await utils.getPalettes()
    } else {
      palettes = JSON.parse(palettes)
    }
    if (palettes === null) {
      throw 'Invalid Palette JSON data stored!'
    }

    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        let paletteIdx = indexed[y][x]
        const offset = (y * this.width + x) * 4
        if (paletteIdx === 255) { //transparent
          continue;
        }
        if (this.item !== null && this.item.transform_color && this.item.inv_transform) {
          const transformIdx = utils.colors[this.item.transform_color]
          if (transformIdx >= 0 && palettes[this.item.inv_transform]) {
            paletteIdx = palettes[this.item.inv_transform][transformIdx][paletteIdx]
          }
        }

        // @ts-ignore
        const rgb = palettes['ACT1'][paletteIdx]
        data.data[offset] = rgb[0]
        data.data[offset + 1] = rgb[1]
        data.data[offset + 2] = rgb[2]
        data.data[offset + 3] = 255
      }
    }

    // put data to context at (0, 0)
    context.putImageData(data, 0, 0)

    // output image
    const src = canvas.toDataURL('image/png')
    canvas.remove()
    return src
  }
}

export default DC6
