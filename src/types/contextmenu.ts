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
