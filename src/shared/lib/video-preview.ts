import previews from './public-previews.json'
import recoveredCases from './recovered-case-previews.json'

/** Only recovered PUBLIC decorative clips belong here, never paid lessons. */
export function videoPreview(source: string): string | undefined {
  const url = new URL(source, 'https://media.invalid')
  const bucket = url.searchParams.get('b')
  const file = url.searchParams.get('f')
  const key = `${bucket}/${file}`
  const recoveredKey = (recoveredCases as Record<string, string>)[key]
  return (previews as Record<string, string>)[key] || (recoveredKey ? (previews as Record<string, string>)[recoveredKey] : undefined)
}

/** A legacy clip of this brand, not the newly supplied full movie. */
export function isRecoveredCasePreview(source: string): boolean {
  const url = new URL(source, 'https://media.invalid')
  return Object.hasOwn(recoveredCases, `${url.searchParams.get('b')}/${url.searchParams.get('f')}`)
}
