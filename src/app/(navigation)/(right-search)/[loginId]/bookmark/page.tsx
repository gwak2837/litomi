import MangaCard from '@/components/card/MangaCard'
import { fetchMangaFromHiyobi } from '@/crawler/hiyobi'
import { fetchMangaFromKHentai } from '@/crawler/k-hentai'
import { harpiMangas } from '@/database/harpi'
import { hashaMangas } from '@/database/hasha'
import { BookmarkSource } from '@/database/schema'
import selectBookmarks from '@/sql/selectBookmarks'
import { getUserIdFromAccessToken } from '@/utils/cookie'
import { SourceParam } from '@/utils/param'
import { checkDefined } from '@/utils/type'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

export default async function Page() {
  const cookieStore = await cookies()
  const userId = await getUserIdFromAccessToken(cookieStore)

  if (!userId) {
    return (
      <>
        <h2 className="text-center font-bold text-xl text-yellow-300 py-4">
          예시 화면이에요. 로그인 후 이용해주세요 🔖
        </h2>
        <ul className="grid gap-2 md:grid-cols-2">
          <MangaCard manga={hashaMangas['3023700']} source={SourceParam.HASHA} />
        </ul>
      </>
    )
  }

  const bookmarkRows = await getBookmarkRows(userId)()
  if (bookmarkRows.length === 0) notFound()

  const bookmarkInfo = bookmarkRows
    .map(({ mangaId, source }) => {
      if (source === BookmarkSource.HASHA) {
        return { manga: hashaMangas[mangaId], source: SourceParam.HASHA }
      }
      if (source === BookmarkSource.HARPI) {
        return { manga: harpiMangas[mangaId], source: SourceParam.HARPI }
      }
      if (source === BookmarkSource.HIYOBI) {
        return {
          manga: fetchMangaFromHiyobi({ id: mangaId })
            .then((manga) => manga ?? { id: mangaId, title: '만화 정보가 없어요', images: [] })
            .catch(() => ({ id: mangaId, title: '오류가 발생했어요', images: [] })),
          source: SourceParam.HIYOBI,
        }
      }
      if (source === BookmarkSource.K_HENTAI) {
        return {
          manga: fetchMangaFromKHentai({ id: mangaId })
            .then((manga) => manga ?? { id: mangaId, title: '만화 정보가 없어요', images: [] })
            .catch(() => ({ id: mangaId, title: '오류가 발생했어요', images: [] })),
          source: SourceParam.K_HENTAI,
        }
      }
      return null
    })
    .filter(checkDefined)

  const bookmarkedMangas = await Promise.all(bookmarkInfo.map(({ manga }) => manga))

  return (
    <ul className="grid gap-2 md:grid-cols-2 grow">
      {bookmarkedMangas.map((manga, i) => (
        <MangaCard key={manga.id} manga={manga} source={bookmarkInfo[i].source} />
      ))}
    </ul>
  )
}

function getBookmarkRows(userId: string) {
  return unstable_cache(() => selectBookmarks({ userId }), [userId, 'bookmarks'], {
    tags: [`${userId}-bookmarks`],
    revalidate: 15,
  })
}
