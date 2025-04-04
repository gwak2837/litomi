import { SourceParam } from '@/utils/param'
import Link from 'next/link'

const sourceIndexMap: Record<string, number> = {
  [SourceParam.HIYOBI]: 0,
  [SourceParam.HARPI]: 1,
  [SourceParam.HASHA]: 2,
}

const sources = Object.keys(sourceIndexMap) as SourceParam.HIYOBI[]

type OrderToggleProps = {
  currentSource: string
  hrefPrefixes?: (source: SourceParam) => string
}

export default function SourceSliderLink({ currentSource, hrefPrefixes }: OrderToggleProps) {
  return (
    <div
      className="relative grid grid-cols-3 bg-zinc-900 border-2 p-1 rounded-xl text-zinc-400
        [&_a]:flex [&_a]:items-center [&_a]:relative [&_a]:rounded [&_a]:px-3 [&_a]:py-1 [&_a]:aria-current:font-bold [&_a]:aria-current:text-foreground [&_a]:aria-current:pointer-events-none"
    >
      {sources.map((source, i) => (
        <Link aria-current={currentSource === source} href={`${hrefPrefixes?.(source) ?? ''}${source}`} key={source}>
          {i === 0 && currentSource && (
            <div
              className="absolute inset-0 bg-zinc-800 rounded-lg border-2 border-zinc-700 transition pointer-events-none"
              style={{ transform: `translateX(${100 * sourceIndexMap[currentSource]}%)` }}
            />
          )}
          <div className="relative min-w-5 text-center">{source}</div>
        </Link>
      ))}
    </div>
  )
}
