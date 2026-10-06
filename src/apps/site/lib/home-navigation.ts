export const HOME_PATH = '/home-bold-studio-sinop-brasil'

// Institutional navigation is reused on service pages, where home sections do
// not exist. Keep real URLs for new-tab clicks instead of swallowing the link.
export function homeSectionHref(pathname: string, hash: string): string {
  return pathname === HOME_PATH || pathname === '/home'
    ? hash
    : `${HOME_PATH}${hash}`
}

export function isPlainNavigation(event: {
  button: number
  ctrlKey: boolean
  metaKey: boolean
  altKey: boolean
  shiftKey: boolean
}): boolean {
  return event.button === 0 && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey
}
