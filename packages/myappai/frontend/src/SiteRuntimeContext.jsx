import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getPublicSiteSnapshot } from './siteApi.js'

const SiteRuntimeContext = createContext(null)

export function SiteRuntimeProvider({ children }) {
  const [snapshot, setSnapshot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function refresh() {
    try {
      setLoading(true)
      const nextSnapshot = await getPublicSiteSnapshot()
      setSnapshot(nextSnapshot)
      setError(null)
    } catch (nextError) {
      setError(nextError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const value = useMemo(
    () => ({
      snapshot,
      loading,
      error,
      refresh
    }),
    [snapshot, loading, error]
  )

  return <SiteRuntimeContext.Provider value={value}>{children}</SiteRuntimeContext.Provider>
}

export function useSiteRuntime() {
  return useContext(SiteRuntimeContext) ?? { snapshot: null, loading: false, error: null, refresh: async () => {} }
}
