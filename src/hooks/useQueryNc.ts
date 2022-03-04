import { useState, useEffect } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { NcrNotify } from '../types'
import { ncNotifyRef, snapshotToDoc } from '../firebase'

export const useQueryNc = (ncId: string) => {
    const { loading, setLoading, error, setError } = useAsyncCall()
    const [nc, setNc] = useState<NcrNotify | null>(null)

    useEffect(() => {
      setLoading(true)
  
      const unsubscribe = ncNotifyRef.doc(ncId).onSnapshot({
        next: (snapshot) => {
          if (!snapshot.exists) {
            setNc(null)
            setError('Nc not found.')
            setLoading(false)
            return
          }
  
          const ncr = snapshotToDoc<NcrNotify>(snapshot)
  
          setNc(ncr)
          setLoading(false)
        },
        error: (err) => {
          setError(err.message)
          setNc(null)
          setLoading(false)
        },
      })
  
      return () => unsubscribe()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
    return { nc, loading, error }
}