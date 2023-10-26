import type { SuggestionHelperConfig } from '@/types'

export function getSearchSuggestion(keyword: string, helper: SuggestionHelperConfig) {
  const query = new URLSearchParams({
    keyword,
    source: helper.source,
    language: helper.language,
    channel: helper.channel.toString(),
  })
  return fetch(`${helper.endpoint}/v${helper.version}/suggestion?${query}`)
}
