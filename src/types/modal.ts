export enum ModalType {
  CONFIRM = 'confirm',
  INPUT = 'input',
  INPUT_MULTILINE = 'input-multiline',
  INPUT_JSON = 'input-json',
}

export enum CustomModalType {
  TEXT = 'text',
  NUMBER = 'number',
}

export interface CustomModalProps {
  title: string
  key: string
  type: CustomModalType
  value: any
}

export interface ShowModalProps {
  type: ModalType
  title: string
  content?: string
  defaultValue?: string
  validator?: (value: string) => boolean
  onConfirm: (inputValue?: string) => void
  onCancel?: () => void
}
