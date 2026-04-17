const DEFAULT_ASSET_BASE_URL = 'https://storage.yandexcloud.net/landing-main'
const ASSET_BASE_URL = (import.meta.env.VITE_ASSET_BASE_URL || DEFAULT_ASSET_BASE_URL).replace(/\/+$/, '')

export function assetUrl(path) {
  if (!path) return path
  if (/^https?:\/\//i.test(path)) return path

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return ASSET_BASE_URL ? `${ASSET_BASE_URL}${normalizedPath}` : normalizedPath
}
