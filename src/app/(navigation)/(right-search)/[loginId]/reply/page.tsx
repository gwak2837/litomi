import type { BasePageProps } from '@/types/nextjs'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// TEMP
export const dynamic = 'error'

export default async function Page({ params }: BasePageProps) {
  notFound()
}
