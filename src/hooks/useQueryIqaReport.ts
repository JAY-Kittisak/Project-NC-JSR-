import { useState, useEffect } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { iqaRef, snapshotToDoc } from '../firebase'
import { IqaType } from '../types'

export const useQueryIqaReport = () => {
    const [ iqa, setIqa ] = useState<IqaType[] | null>(null)
    const { loading, setLoading, error, setError } = useAsyncCall()

    useEffect(() => {
        setLoading(true)

        const unsubscribe = iqaRef
            .orderBy('createdAt', 'desc')
            .onSnapshot({
                next: (snapshots) => {
                    const allIql: IqaType[] = []

                    if (!snapshots) {
                        setIqa(null)
                        setError('IQA not found.')
                        setLoading(false)
                        return
                    }

                    snapshots.forEach(snapshot => {
                        const iqa = snapshotToDoc<IqaType>(snapshot)

                        allIql.push(iqa)
                    })

                    setIqa(allIql)
                    setLoading(false)
                },
                error: (err) => {
                    setError(err.message)
                    setIqa(null)
                    setLoading(false)
                },
            })

        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { iqa, loading, error }
}