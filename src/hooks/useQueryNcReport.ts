import { useState, useEffect } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { ncNotifyRef, snapshotToDoc } from '../firebase'
import { NcrNotify } from '../types'

export const useQueryNcReport = (dateBegin: string, dateEnd: string) => {
    const [ncNotify , setNcNotify] = useState<NcrNotify[] | null>(null)
    const { loading, setLoading, error, setError } = useAsyncCall()
    
    useEffect(() => {
        setLoading(true)

        const begin = new Date(dateBegin)
        const end = new Date(dateEnd)

        const unsubscribe = ncNotifyRef
            .where('createdAt', '>=', begin)
            .where('createdAt', '<=', end)
            .orderBy('createdAt', 'desc')
            .onSnapshot({
                next: (snapshots) => {
                    const allNc: NcrNotify[] = []

                    if (!snapshots) {
                        setNcNotify(null)
                        setError('Nc not found.')
                        setLoading(false)
                        return
                    }

                    snapshots.forEach(snapshot => {
                        const ncr = snapshotToDoc<NcrNotify>(snapshot)

                        allNc.push(ncr)
                    })

                    setNcNotify(allNc)
                    setLoading(false)
                },
                error: (err) => {
                    setError(err.message)
                    setNcNotify(null)
                    setLoading(false)
                },
            })

            return () => unsubscribe()
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateBegin,dateEnd])

    return { ncNotify, loading, error }
}