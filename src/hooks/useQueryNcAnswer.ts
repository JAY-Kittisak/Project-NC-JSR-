import { useState, useEffect } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { NcAnswer } from '../types'
import { ncAnswerRef, snapshotToDoc } from '../firebase'

export const useQueryNcAnswer = (ncId: string) => {
    const { loading, setLoading, error, setError } = useAsyncCall()
    const [ncAnswer, setNcAnswer] = useState<NcAnswer | null>(null)

    useEffect(() => {
        setLoading(true)

        const unsubscribe = ncAnswerRef.where('ncId', '==', ncId).onSnapshot({
            next: (snapshots) => {
                if (!snapshots) {
                    setNcAnswer(null)
                    setError('NC Answer not found.')
                    setLoading(false)
                    return
                }

                snapshots.forEach(snapshot => {
                    const answer = snapshotToDoc<NcAnswer>(snapshot)
    
                    setNcAnswer(answer)
                    setLoading(false)
                })
            },
            error: (err) => {
                setError(err.message)
                setNcAnswer(null)
                setLoading(false)
            }
        })

        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return {ncAnswer, loading, error}

}