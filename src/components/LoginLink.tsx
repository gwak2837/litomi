'use client'

import { SearchParamKey } from '@/constants/storage'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'

type Props = Omit<ComponentProps<typeof Link>, 'href'>

export default function LoginLink({ className = '', children, ...props }: Props) {
  const pathname = usePathname()

  return (
    <Link
      {...props}
      className={`font-bold text-xs ${className}`}
      href={`/auth/login?${SearchParamKey.REDIRECT_URL}=${encodeURIComponent(pathname)}`}
    >
      {children}
    </Link>
  )
}
