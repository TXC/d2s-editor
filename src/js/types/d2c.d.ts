import * as d2s from '@dschu012/d2s'

interface D2CItem extends d2s.types.IItem {
  src?: string | null;
  socketed_items: D2CItem[]
}

interface D2CS extends d2s.types.ID2S {
}

type MagicPrefix = {
  n: string | null;
  tc?: string;
}
type MagicSuffix = {
  n: string | null;
  tc?: string;
}
type RareName = {
  n: string | null;
}
type UniqueItem = {
  n: string | null;
  i?: string | null;
  c?: string | null;
  tc?: string | null;
}
type SetItem = {
  n: string | null;
  c: string;
  tc?: string | null;
}
