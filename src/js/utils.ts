import * as d2s from '@dschu012/d2s'
import type {D2CItem, ItemPack, CharPack} from './types'
// @ts-ignore
import ItemPackData from './d2/ItemPack';
// @ts-ignore
import CharPackData from './d2/CharPack';

export type UtilsColor = {
  [key: string]: number;
}
const colors: UtilsColor = {
  whit: 0,
  lgry: 1,
  dgry: 2,
  blac: 3,
  lblu: 4,
  dblu: 5,
  cblu: 6,
  lred: 7,
  dred: 8,
  cred: 9,
  lgrn: 10,
  dgrn: 11,
  cgrn: 12,
  lyel: 13,
  dyel: 14,
  lgld: 15,
  dgld: 16,
  lpur: 17,
  dpur: 18,
  oran: 19,
  bwht: 20,
};

export type UtilsColorMap = {
  [key: number]: string;
}
const colormaps: UtilsColorMap = {
  1: 'data/global/items/Palette/grey.dat',
  2: 'data/global/items/Palette/grey2.dat',
  5: 'data/global/items/Palette/greybrown.dat',
  6: 'data/global/items/Palette/invgrey.dat',
  7: 'data/global/items/Palette/invgrey2.dat',
  8: 'data/global/items/Palette/invgreybrown.dat',
};

const xp = [
  0,500,1500,3750,7875,14175,22680,32886,44396,57715,
  72144,90180,112725,140906,176132,220165,275207,344008,430010,537513,
  671891,839864,1049830,1312287,1640359,2050449,2563061,3203826,3902260,4663553,
  5493363,6397855,7383752,8458379,9629723,10906488,12298162,13815086,15468534,17270791,
  19235252,21376515,23710491,26254525,29027522,32050088,35344686,38935798,42850109,47116709,
  51767302,56836449,62361819,68384473,74949165,82104680,89904191,98405658,107672256,117772849,
  128782495,140783010,153863570,168121381,183662396,200602101,219066380,239192444,261129853,285041630,
  311105466,339515048,370481492,404234916,441026148,481128591,524840254,572485967,624419793,681027665,
  742730244,809986056,883294891,963201521,1050299747,1145236814,1248718217,1361512946,1484459201,1618470619,
  1764543065,1923762030,2097310703,2286478756,2492671933,2717422497,2962400612,3229426756,3520485254,3837739017
];

const getItemPack = (): ItemPack => {
  return [...new Set([...ItemPackData])]
}

const getCharPack = (): CharPack => {
  return CharPackData
}

const b64ToArrayBuffer = (base64: string): Uint8Array => {
  const bin = window.atob(base64),
    len = bin.length,
    bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = bin.charCodeAt(i)
  }
  return bytes
}

const arrayBufferToBase64 = (buffer: ArrayBufferLike): string => {
  const bytes = new Uint8Array(buffer),
    len = bytes.byteLength
  let binary = ''
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

const getPalettes = async () => {
  const palettes = Object();
  palettes['ACT1'] = [];
  let response = await fetch('data/global/palette/ACT1/pal.dat');
  let buffer = new Uint8Array(await response.arrayBuffer());
  for (let i = 0; i < 256; i += 1) {
    palettes['ACT1'].push([buffer[i * 3 + 2], buffer[i * 3 + 1], buffer[i * 3]]);
  }
  for (const [k, v] of Object.entries(colormaps)) {
    response = await fetch(v);
    buffer = new Uint8Array(await response.arrayBuffer());
    palettes[k] = [];
    for (let i = 0; i < Object.keys(colors).length; i += 1) {
      palettes[k].push(buffer.slice((i * 256), 256 + (i * 256)));
    }
  }
  localStorage.setItem('palettes', JSON.stringify(palettes));
  return palettes
}

const getLong = (dc6: Uint8Array, idx: number): number => {
  return dc6[idx] | dc6[idx + 1] << 8 | dc6[idx + 2] << 16 | dc6[idx + 2] << 24
}

const b64PNGFromDC6 = async (item: d2s.types.IItem) => {
  const response = await fetch(`data/global/items/${item.inv_file}.dc6`)
  if (response.status !== 200) {
    return null
  }
  const dc6 = new Uint8Array(await response.arrayBuffer())

  const offset = 28
  const width = getLong(dc6, offset + 4) // idx = 32
  const height = getLong(dc6, offset + 8) // idx = 36
  const length = getLong(dc6, offset + 28) // idx = 56
  let x = 0, y = height - 1
  const indexed = []
  if (width === 0 || height === 0) {
    return null
  }
  for (let i = 0; i < height; i += 1) {
    indexed[i] = Array(width).fill(255)
  }
  const idx = 60
  for (let i = 0; i < length;) {
    const b = dc6[idx + i++]
    if (b === 0x80) { //eol
      x = 0
      y--
    } else if (b & 0x80) {
      x += b & 0x7F //transparent repeat for N bytes
    } else {
      //read N bytes
      for (let j = 0; j < b; j++) {
        indexed[y][x++] = dc6[idx + i++]
      }
    }
  }
  const canvas = document.createElement('canvas'),
    context = canvas.getContext('2d')
  if (context === null) {
    return null
  }
  const data = context.createImageData(width, height)
  canvas.height = height
  canvas.width = width

  let palettes = localStorage.getItem('palettes')
  if (palettes === null) {
    palettes = await getPalettes()
  } else {
    palettes = JSON.parse(palettes)
  }
  if (palettes === null) {
    throw 'Invalid JSON data stored!'
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let paletteIdx = indexed[y][x]
      const offset = (y * width + x) * 4
      if (paletteIdx === 255) { //transparent
        continue;
      }
      if (item.transform_color && item.inv_transform) {
        const transformIdx = colors[item.transform_color]
        if (transformIdx >= 0 && palettes[item.inv_transform]) {
          paletteIdx = palettes[item.inv_transform][transformIdx][paletteIdx]
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
  //const img = new Image();
  const src = canvas.toDataURL('image/png')
  canvas.remove()
  return src
}

const shift = (number: number, shift: number): number => {
  return number * Math.pow(2, shift);
}

const range = (number: number): number[] => {
  return [...Array(number).keys()]
}

const UUIDv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16);
  });
}

const contains = (a: Array<number>, b: Array<number>) => {
  return !(
    b[0] < a[0] ||
    b[1] < a[1] ||
    b[2] > a[2] ||
    b[3] > a[3]
  );
}

const overlaps = (a: Array<number>, b: Array<number>) => {
  if (a[0] >= b[2] || b[0] >= a[2]) {
    return false;
  }
  return !(a[1] >= b[3] || b[1] >= a[3]);

}

const findIndex = (list: D2CItem[], i: D2CItem) => {
  return list.findIndex(item =>
    item.location_id == i.location_id
    && item.equipped_id == i.equipped_id
    && item.position_x == i.position_x
    && item.position_y == i.position_y
    && item.alt_position_id == i.alt_position_id
  );
}

const setPropertiesOnItem = async (item: D2CItem|null) => {
  if (!item) {
    return;
  }
  if (!item.magic_attributes) {
    item.magic_attributes = [];
  }
  if (!item.src) {
    item.src = await b64PNGFromDC6(item);
  }
  if (!item.socketed_items) {
    return;
  }
  for (let i = 0; i < item.socketed_items.length; i++) {
    if (!item.socketed_items[i].src) {
      item.socketed_items[i].src = await b64PNGFromDC6(item.socketed_items[i]);
    }
  }
}

export default {
  xp,
  colors: colors,
  colormaps: colormaps,
  getItemPack,
  getCharPack,
  b64ToArrayBuffer,
  arrayBufferToBase64,
  getPalettes,
  b64PNGFromDC6,
  shift,
  range,
  UUIDv4,
  contains,
  overlaps,
  findIndex,
  setPropertiesOnItem,
}
