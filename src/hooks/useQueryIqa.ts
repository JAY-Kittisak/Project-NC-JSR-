import { useState, useEffect } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { IqaType } from '../types'
import { iqaRef, snapshotToDoc } from '../firebase'

export const useQueryIqa = (iqaId: string) => {
    const { loading, setLoading, error, setError } = useAsyncCall()
    const [ iqa, setIqa ] = useState<IqaType | null>(null)

    useEffect(() => {
        setLoading(true)
         
        const unsubscribe = iqaRef.doc(iqaId).onSnapshot({
            next: (snapshot) => {
                if (!snapshot.exists) {
                    setIqa(null)
                    setError('Iqa not found.')
                    setLoading(false)
                    return
                }

                const iqa = snapshotToDoc<IqaType>(snapshot)

                setIqa(iqa)
                setLoading(false)
            },
            error: (err) => {
                setError(err.message)
                setIqa(null)
                setLoading(false)
            }
        })

        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return { iqa, loading, error}
}