import {D2CItem} from '../../d2c'
import {types} from '@dschu012/d2s'
import * as React from 'react'

export type itemRC = ($event: React.MouseEvent, item: D2CItem) => void

type StatDescriptionProps = {
  stat: types.IMagicProperty;
}

type ItemProps = {
  id: string;
  item: D2CItem;
  clazz?: string;
  clickEvent?: () => void;
  contextMenuEvent?: React.MouseEventHandler;
}
export type StatDescriptionElement = (props: StatDescriptionProps) => JSX.Element
export type ItemElement = (props: ItemProps) => JSX.Element
