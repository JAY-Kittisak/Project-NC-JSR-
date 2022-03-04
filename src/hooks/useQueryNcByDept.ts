import { useState, useEffect } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { NcrNotify, Branch } from '../types'
import { ncNotifyRef, snapshotToDoc } from '../firebase'

export const useQueryNcByDept = (dept: string, branch: Branch) => {
    const { loading, setLoading, error, setError } = useAsyncCall()
    const [ncByDept, setNcByDept] = useState<NcrNotify[] | null>(null)

    useEffect(() => {
        setLoading(true)

        const unsubscribe = ncNotifyRef
        .where('dept', '==', dept)
        .where('branch', '==', branch)
        .orderBy('createdAt', 'desc')
        .onSnapshot({
            next: (snapshots) => {
                const allNc: NcrNotify[] = []

                if (!snapshots) {
                    setNcByDept(null)
                    setError('Nc not found.')
                    setLoading(false)
                    return
                }

                snapshots.forEach(snapshot => {
                    const ncr = snapshotToDoc<NcrNotify>(snapshot)

                    allNc.push(ncr)
                })
                
                setNcByDept(allNc)
                setLoading(false)
            },
            error: (err) => {
                setError(err.message)
                setNcByDept(null)
                setLoading(false)
            },
        })

        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { ncByDept, loading, error }
}