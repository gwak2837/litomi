'use client'

import logout from '@/app/auth/logout/action'
import { QueryKeys } from '@/constants/query'
import useActionErrorEffect from '@/hook/useActionErrorEffect'
import useMeQuery from '@/query/useMeQuery'
import { captureException } from '@sentry/nextjs'
import { ErrorBoundaryFallbackProps } from '@suspensive/react'
import { useQueryClient } from '@tanstack/react-query'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'

import IconLogout from '../icons/IconLogout'
import Loading from '../ui/Loading'

const initialState = {
  success: false,
}

type Props = {
  className?: string
}

export default function LogoutButton({ className = '' }: Props) {
  const [{ error, success, status }, formAction, pending] = useActionState(logout, initialState)
  const queryClient = useQueryClient()
  const { data: me } = useMeQuery()

  useEffect(() => {
    if (success) {
      queryClient.setQueriesData({ queryKey: QueryKeys.me }, () => null)
      toast.success('로그아웃 성공')
    }
  }, [queryClient, success])

  useActionErrorEffect({
    status,
    error,
    onError: (error) => toast.error(error),
  })

  return (
    <form
      action={formAction}
      aria-hidden={!me}
      className={`relative whitespace-nowrap aria-hidden:hidden ${className}`}
    >
      <button
        className="group rounded-full p-3 w-full text-red-500 transition hover:bg-red-500/20 active:scale-95 
          disabled:hover:bg-inherit disabled:active:scale-100  disabled:text-zinc-400"
        disabled={pending}
      >
        {pending ? (
          <div className="h-6 w-full">
            <Loading className="w-6 -translate-x-1 text-current mx-auto translate-y-2.5" />
          </div>
        ) : (
          <div className="flex justify-center items-center gap-5 ">
            <IconLogout className="w-6 transition group-disabled:scale-100" />
            <span className="min-w-0 hidden md:block">로그아웃</span>
          </div>
        )}
      </button>
    </form>
  )
}

export function LogoutButtonError({ error, reset }: ErrorBoundaryFallbackProps) {
  useEffect(() => {
    captureException(error, { extra: { name: 'LogoutButtonError' } })
  }, [error])

  return (
    <button
      className="flex items-center gap-3 rounded-full p-3 text-red-500 transition hover:bg-red-500/20 active:scale-95"
      onClick={reset}
      type="reset"
    >
      <IconLogout className="w-6 transition group-disabled:scale-100" />
      <span className="min-w-0 hidden md:block">오류 (재시도)</span>
    </button>
  )
}

export function LogoutButtonSkeleton() {
  return <div className="w-10 h-10 m-1 animate-fade-in bg-zinc-800 rounded-full md:w-30" />
}
