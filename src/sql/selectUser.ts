import { db } from '@/database/drizzle'
import { userTable } from '@/database/schema'
import { sql } from 'drizzle-orm'

type Params = {
  loginId: string
}

export default async function selectUser({ loginId }: Params) {
  return db
    .select({
      createdAt: userTable.createdAt,
      nickname: userTable.nickname,
      imageURL: userTable.imageURL,
    })
    .from(userTable)
    .where(sql`${userTable.loginId} = ${loginId}`)
}
