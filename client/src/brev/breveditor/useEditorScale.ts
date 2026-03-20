import { useRefSize } from './hooks'

// Skaler breveditor sitt innhold slik at Navs brevstandard sine px/pt verdier vises korrekt og propersjonalt, med
export function useEditorScale(visMarger: boolean) {
  const { size: widthSize, ref: widthRef } = useRefSize()
  const { size: heightSize, ref: heightRef } = useRefSize()

  // 794 = 595pt in px
  // 650 = 595pt - 108pt ((64-10)*2=108)
  const designedWidth = visMarger ? 794 : 650
  const widthScale = widthSize ? widthSize.width / designedWidth : 1.0
  // korrekt lengde i scrollbart felt.
  const heightScale = heightSize?.height ? `${heightSize.height * widthScale}px` : 'auto'

  return { widthScale, heightScale, widthRef, heightRef }
}
