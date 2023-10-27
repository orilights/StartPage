import { defineStore } from 'pinia'
import type { CollectionData, LinkData, ShowContextMenuProps, ShowModalProps } from '@/types'
import { isValidKey } from '@/utils'

export const useStore = defineStore('main', {
  persist: {
    key: 'sp-store',
    paths: ['settings', 'collections'],
  },
  state: () => ({
    collections: [] as CollectionData[],
    settings: {
      searchProvider: 'google',
      suggestionProvider: 'baidu',
      faviconSource: 'google',
      showTips: true,
    },

    showSettingPanel: false,

    contextMenu: {
      show: false,
      data: {} as ShowContextMenuProps,
    },
    modal: {
      show: false,
      data: {} as ShowModalProps,
    },
  }),
  actions: {
    addCollection(pos: number = -1, collection: CollectionData | undefined = undefined) {
      if (!collection) {
        collection = {
          id: '',
          name: '新建集合',
          description: '',
          links: [],
        }
      }
      collection.id = Date.now().toString()
      if (pos === -1)
        this.collections.push(collection)
      else
        this.collections.splice(pos, 0, collection)
    },
    deleteCollection(collectionId: string) {
      this.collections = this.collections.filter(
        collection => collection.id !== collectionId,
      )
      if (this.collections.length === 0)
        this.addCollection()
    },
    updateCollection(collectionId: string, collection: Partial<CollectionData>) {
      const index = this.collections.findIndex(collection => collection.id === collectionId)
      if (index === -1)
        return
      for (const key in collection) {
        if (isValidKey(key, collection))
          this.collections[index][key] = collection[key]!
      }
    },
    addLink(collectionId: string, link: LinkData, pos: number = -1) {
      const collection = this.collections.find(
        collection => collection.id === collectionId,
      )
      if (!collection)
        return
      link.id = Date.now().toString()
      if (pos === -1)
        collection.links.push(link)
      else
        collection.links.splice(pos, 0, link)
    },
    deleteLink(collectionId: string, linkId: string) {
      const collection = this.collections.find(
        collection => collection.id === collectionId,
      )
      if (!collection)
        return
      collection.links = collection.links.filter(
        link => link.id !== linkId,
      )
    },
    updateLink(collectionId: string, linkId: string, link: Partial<LinkData>) {
      const collection = this.collections.find(
        collection => collection.id === collectionId,
      )
      if (!collection)
        return
      const index = collection.links.findIndex(link => link.id === linkId)
      if (index === -1)
        return
      for (const key in link) {
        if (isValidKey(key, link))
          collection.links[index][key] = link[key]!
      }
    },
    async showContextMenu(props: ShowContextMenuProps) {
      if (this.contextMenu.show) {
        this.contextMenu.show = false
        await nextTick()
      }
      this.contextMenu.data = props
      this.contextMenu.show = true
    },
    closeContextMenu() {
      this.contextMenu.show = false
    },
    showModal(props: ShowModalProps) {
      this.modal.data = props
      this.modal.show = true
    },
    closeModal() {
      this.modal.show = false
    },
    toggleSettingPanel() {
      this.showSettingPanel = !this.showSettingPanel
    },
    importData() {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'application/json'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file)
          return
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = JSON.parse(e.target!.result as string)
          this.collections = data.collections
          this.settings = data.settings
        }
        reader.readAsText(file)
      }
      input.click()
    },
    exportData() {
      const data = {
        collections: this.collections,
        settings: this.settings,
      }
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `start-data-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    },
  },
})
