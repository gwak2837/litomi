import type { BasePageProps } from '@/types/nextjs'

import ImageViewer from '@/components/ImageViewer/ImageViewer'
import { defaultOpenGraph, SHORT_NAME } from '@/constants'
import { CANONICAL_URL } from '@/constants/url'
import { fetchMangaFromHiyobi, fetchMangaImagesFromHiyobi } from '@/crawler/hiyobi'
import { harpiMangaIdsDesc, harpiMangas } from '@/database/harpi'
import { hashaMangaIdsDesc, hashaMangas } from '@/database/hasha'
import { getImageSrc } from '@/utils/manga'
import { SourceParam, validateId, validateSource } from '@/utils/param'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const dynamic = 'error'

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { id, source } = await params
  const idNumber = validateId(id)
  const sourceString = validateSource(source)

  if (!idNumber || !sourceString) {
    notFound()
  }

  const manga = await getManga({ source: sourceString, id: idNumber })

  if (!manga) {
    notFound()
  }

  const { title, images, cdn } = manga

  return {
    alternates: {
      canonical: `${CANONICAL_URL}/manga/${id}`,
      languages: { ko: `${CANONICAL_URL}/manga/${id}` },
    },
    title: `${title} - ${SHORT_NAME}`,
    openGraph: {
      ...defaultOpenGraph,
      images: images.slice(0, 3).map((path) => getImageSrc({ path, cdn, id: +id })),
    },
  }
}

export async function generateStaticParams() {
  const params: Record<string, unknown>[] = []
  const idMap: Record<string, string[]> = {
    ha: hashaMangaIdsDesc.slice(0, 20),
    hp: harpiMangaIdsDesc.slice(0, 20),
  }
  for (const source of [SourceParam.HASHA, SourceParam.HARPI]) {
    for (const id of idMap[source]) {
      params.push({ id, source })
    }
  }
  return params
}

export default async function Page({ params }: BasePageProps) {
  const { id, source } = await params
  const idNumber = validateId(id)
  const sourceString = validateSource(source)

  if (!idNumber || !sourceString) {
    notFound()
  }

  const manga = await getManga({ source: sourceString, id: idNumber })

  if (!manga) {
    notFound()
  }

  return (
    <main>
      <ImageViewer manga={manga} />
    </main>
  )
}

async function getManga({ source, id }: { source: SourceParam; id: number }) {
  if (source === SourceParam.HIYOBI) {
    const [mangaFromHiyobi, mangaImages] = await Promise.all([
      fetchMangaFromHiyobi({ id }).catch(() => ({ id, title: '오류가 발생했어요', images: [] })),
      fetchMangaImagesFromHiyobi({ id }),
    ])

    if (!mangaImages) {
      return null
    }

    return {
      ...(mangaFromHiyobi ?? { id, title: '만화 정보가 없어요', images: [] }),
      id,
      images: mangaImages,
      cdn: 'k-hentai',
    }
  } else if (source === SourceParam.HASHA) {
    return hashaMangas[id]
  } else if (source === SourceParam.HARPI) {
    return harpiMangas[id]
  }
}
