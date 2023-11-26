import type { SearchProvider, SuggestionProvider } from '@/types'

export const FaviconSourceMap: Record<string, { name: string; url: string }> = {
  google: {
    name: 'Google',
    url: 'https://www.google.com/s2/favicons?sz=64&domain_url={hostname}',
  },
  duckduckgo: {
    name: 'DuckDuckGo',
    url: 'https://icons.duckduckgo.com/ip3/{hostname}.ico',
  },
}

export const SearchProviderMap: Record<string, SearchProvider> = {
  google: {
    name: 'Google',
    url: 'https://www.google.com/search?q={keyword}',
    icon: '/icon/google-line.png',
  },
  baidu: {
    name: 'Baidu',
    url: 'https://www.baidu.com/s?wd={keyword}',
    icon: '/icon/baidu-line.png',
  },
  bilibili: {
    name: 'Bilibili',
    url: 'https://search.bilibili.com/all?keyword={keyword}',
    icon: '/icon/bilibili-line.png',
  },
}

export const SuggestionProviderMap: Record<string, SuggestionProvider> = {
  baidu: {
    name: '百度',
    type: 'helper',
    helper: {
      endpoint: 'https://api.amarea.cn/startpage',
      version: '1',
      language: 'zh-CN',
      source: 'baidu',
      channel: 1,
    },
  },
  baidu1: {
    name: '百度1',
    type: 'helper',
    helper: {
      endpoint: 'https://api.amarea.cn/startpage',
      version: '1',
      language: 'zh-CN',
      source: 'baidu',
      channel: 0,
    },
  },
  google: {
    name: 'Google',
    type: 'helper',
    helper: {
      endpoint: 'https://api.amarea.cn/startpage',
      version: '1',
      language: 'zh-CN',
      source: 'google',
      channel: 0,
    },
  },
}
