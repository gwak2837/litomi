import { memo, useCallback } from 'react'

import Slider from '../ui/Slider'
import { useImageIndexStore } from './store/imageIndex'
import { usePageViewStore } from './store/pageView'
import { useVirtualizerStore } from './store/virtualizer'

type Props = {
  maxImageIndex: number
}

export default memo(ImageSlider)

function ImageSlider({ maxImageIndex }: Props) {
  const { imageIndex, setImageIndex } = useImageIndexStore()
  const pageView = usePageViewStore((state) => state.pageView)
  const getVirtualizer = useVirtualizerStore((state) => state.getVirtualizer)
  const isDoublePage = pageView === 'double'
  const currentPage = imageIndex + 1
  const maxPage = maxImageIndex + 1
  const startPage = Math.max(1, currentPage)
  const endPage = isDoublePage ? Math.min(currentPage + 1, maxPage) : startPage

  const handleValueCommit = useCallback(
    (value: number) => {
      setImageIndex(value)
      getVirtualizer()?.scrollToIndex(isDoublePage ? Math.floor(value / 2) : value)
    },
    [getVirtualizer, isDoublePage, setImageIndex],
  )

  return (
    <>
      <div className="px-3">
        <Slider className="h-6" max={maxImageIndex} onValueCommit={handleValueCommit} value={imageIndex} />
      </div>
      <div className="flex justify-center gap-1 text-xs">
        <span>{startPage === endPage ? startPage : `${startPage}-${endPage}`}</span>/<span>{maxPage}</span>
      </div>
    </>
  )
}
