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
