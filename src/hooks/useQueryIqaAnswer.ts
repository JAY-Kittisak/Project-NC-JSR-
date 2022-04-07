import { useState , useEffect} from 'react'

import { useAsyncCall } from './useAsyncCall'
import { IqaAnswer } from '../types'
import { iqaAnswerRef, snapshotToDoc} from '../firebase'

export const useQueryIqaAnswer = (iqaId: string) => {
    const { loading, setLoading, error, setError } = useAsyncCall()
    const [ iqaAnswer, setIqaAnswer ] = useState<IqaAnswer | null>(null)

    useEffect(() => {
        setLoading(true)

        const unsubscribe = iqaAnswerRef.where('iqaId', '==', iqaId).onSnapshot({
            next: (snapshots) => {
                if (!snapshots) {
                    setIqaAnswer(null)
                    setError('IQA Answer not found.')
                    setLoading(false)
                    return
                }

                snapshots.forEach(snapshot => {
                    const answer = snapshotToDoc<IqaAnswer>(snapshot)

                    setIqaAnswer(answer)
                    setLoading(false)
                })
            },
            error: (err) => {
                setError(err.message)
                setIqaAnswer(null)
                setLoading(false)
            }
        })

        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { iqaAnswer, loading, error}
}