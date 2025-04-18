import { CookieKey } from '@/constants/storage'
import { db } from '@/database/drizzle'
import { userTable } from '@/database/schema'
import { getUserIdFromAccessToken } from '@/utils/cookie'
import { sql } from 'drizzle-orm'
import { cookies } from 'next/headers'

export type ResponseApiMe = {
  id: number
  loginId: string
  nickname: string
  imageURL: string | null
}

export async function GET() {
  const cookieStore = await cookies()
  const userId = await getUserIdFromAccessToken(cookieStore)
  if (!userId) return new Response('로그인 정보가 없거나 만료됐어요.', { status: 401 })

  const [user] = await db
    .select({
      id: userTable.id,
      loginId: userTable.loginId,
      nickname: userTable.nickname,
      imageURL: userTable.imageURL,
    })
    .from(userTable)
    .where(sql`${userTable.id} = ${userId}`)

  if (!user) {
    cookieStore.delete(CookieKey.ACCESS_TOKEN)
    return new Response('사용자 정보를 찾을 수 없어요.', { status: 404 })
  }

  return Response.json(user satisfies ResponseApiMe)
}
