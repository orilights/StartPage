export interface CollectionData {
  id: string
  name: string
  description: string
  links: LinkData[]
}

export interface LinkData {
  id: string
  name: string
  target: string
}

export interface SearchProvider {
  name: string
  url: string
  icon: string
}

export interface ContextMenuItem {
  type: ContextMenuItemType
  text?: string
  textSize?: number
  textColor?: string
  callback?: () => void
}

export enum ContextMenuItemType {
  Button = 'button',
  Text = 'text',
  Separator = 'separator',
}

export interface ShowContextMenuProps {
  items: ContextMenuItem[]
  pos: {
    x: number
    y: number
  }
}
