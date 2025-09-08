import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { ApiResponse } from '@/types/api'

export interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export interface UseApiOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

// 기본 API 훅
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await apiCall()
      
      if (response.success) {
        setState({ data: response.data || null, loading: false, error: null })
        onSuccess?.(response.data)
      } else {
        const errorMessage = response.error || 'Unknown error occurred'
        setState({ data: null, loading: false, error: errorMessage })
        onError?.(errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error'
      setState({ data: null, loading: false, error: errorMessage })
      onError?.(errorMessage)
    }
  }, [apiCall, onSuccess, onError])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset
  }
}

// 뮤테이션 훅 (POST, PUT, DELETE 등)
export function useMutation<TData, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: UseApiOptions = {}
) {
  const { onSuccess, onError } = options
  
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null
  })

  const mutate = useCallback(async (variables: TVariables) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await mutationFn(variables)
      
      if (response.success) {
        setState({ data: response.data || null, loading: false, error: null })
        onSuccess?.(response.data)
        return response
      } else {
        const errorMessage = response.error || 'Unknown error occurred'
        setState({ data: null, loading: false, error: errorMessage })
        onError?.(errorMessage)
        throw new Error(errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error'
      setState({ data: null, loading: false, error: errorMessage })
      onError?.(errorMessage)
      throw error
    }
  }, [mutationFn, onSuccess, onError])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    mutate,
    reset
  }
}

// 페이지네이션 훅
export interface UsePaginationOptions<T> {
  initialPage?: number
  initialLimit?: number
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export function usePagination<T>(
  apiCall: (page: number, limit: number) => Promise<ApiResponse<{
    items: T[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }>>,
  options: UsePaginationOptions<T> = {}
) {
  const { 
    initialPage = 1, 
    initialLimit = 20, 
    onSuccess, 
    onError 
  } = options

  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [allData, setAllData] = useState<T[]>([])
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0
  })

  const { data, loading, error, execute } = useApi(
    () => apiCall(page, limit),
    {
      onSuccess: (response) => {
        if (page === 1) {
          setAllData(response.items || [])
        } else {
          setAllData(prev => [...prev, ...(response.items || [])])
        }
        setPagination(response.pagination)
        onSuccess?.(response)
      },
      onError
    }
  )

  const loadMore = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      setPage(prev => prev + 1)
    }
  }, [pagination])

  const refresh = useCallback(() => {
    setPage(1)
    setAllData([])
    execute()
  }, [execute])

  const hasMore = pagination.page < pagination.totalPages

  return {
    data: allData,
    pagination,
    loading,
    error,
    loadMore,
    refresh,
    hasMore,
    setLimit: (newLimit: number) => {
      setLimit(newLimit)
      setPage(1)
      setAllData([])
    }
  }
}