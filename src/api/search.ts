export function getSearchSuggestion(keyword: string, source: string, language: string) {
  const query = new URLSearchParams({
    keyword,
    source,
    language,
  })
  return fetch(`https://api.amarea.cn/startpage/v1/suggestion?${query}`)
}
