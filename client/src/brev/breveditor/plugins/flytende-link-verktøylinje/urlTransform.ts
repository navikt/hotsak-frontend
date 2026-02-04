export const urlTransform = (url: string) => {
  if (!/^[^:]+:\/\//.test(url)) {
    if (/^nav\.no/i.test(url)) return `https://${url}`
    return `http://${url}`
  }
  return url
}
