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

export interface SuggestionHelperConfig {
  endpoint: string
  version: string
  language: string
  source: string
  channel: number
}

export interface SuggestionProvider {
  name: string
  type: 'helper'
  url?: string
  helper?: SuggestionHelperConfig
}
