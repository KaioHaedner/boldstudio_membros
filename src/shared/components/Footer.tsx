import { Footer as HomeFooter } from '@/apps/site/components/Footer'
import { FooterWordmark } from '@/apps/site/components/FooterWordmark'

/** The institutional footer is the single source for every other route. */
export function Footer() {
  return <>
    <HomeFooter />
    <FooterWordmark />
  </>
}
