import { QueryKeys } from '@/constants/query'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

type Props<ErrorType> = {
  status?: number
  error?: ErrorType
  onError?: (error: ErrorType) => void
}

export default function useActionErrorEffect<T>({ status, error, onError }: Props<T>) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (error) {
      onError?.(error)

      if (status === 401) {
        queryClient.setQueriesData({ queryKey: QueryKeys.me }, () => null)
      }
    }
  }, [error, onError, queryClient, status])

  return null
}
