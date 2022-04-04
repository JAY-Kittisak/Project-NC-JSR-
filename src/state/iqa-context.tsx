import React, {
    createContext,
    useContext,
    Dispatch,
    SetStateAction,
    useState,
    useEffect
} from 'react'

import { useAsyncCall } from '../hooks/useAsyncCall'
import { NcrTab, IqaType, IqaTabAll } from '../types'
import { firebase } from '../firebase/config'
import {
    iqaRef,
    snapshotToDoc,
} from '../firebase'
import { useAuthContext } from './auth-context'

const limitQuery = 12

interface Props { }

type IqaState = {
    iqa: IqaTabAll
    loading: boolean
    error: string
    queryMoreIqa: () => void
    btnLoading: boolean
}
type IqaDispatch = {
    setIqa: Dispatch<SetStateAction<IqaTabAll>>
}

const IqaStateContext = createContext<IqaState | undefined>(undefined)
const IqaDispatchContext = createContext<IqaDispatch | undefined>(undefined)

export const initialIqa: IqaTabAll = {
    All: [],
    รอตอบ: [],
    ตอบแล้ว: [],
    รอปิด: [],
    ไม่อนุมัติ: [],
    ปิดแล้ว: [],
    ยกเลิก: [],
}

const IqaContextProvider: React.FC<Props> = ({ children }) => {
    const { loading, setLoading, error, setError } = useAsyncCall()
    const [ iqa, setIqa] = useState(initialIqa)
    const [lastDocument, setLastDocument] = useState<firebase.firestore.DocumentData>()
    const [btnLoading, setBtnLoading] = useState(false)

    const { authState: { userInfo } } = useAuthContext()

    const queryMoreIqa = async () => {
        try {
            if (!lastDocument || !userInfo) return

            setBtnLoading(true)

            const snapshots = await iqaRef
                .where('creator.id', '==', userInfo.id)
                .orderBy('createdAt', 'desc')
                .startAfter(lastDocument)
                .limit(limitQuery)
                .get()

            const newQueries = snapshots.docs.map(snapshot => snapshotToDoc<IqaType>(snapshot))

            const lastVisible = snapshots.docs[snapshots.docs.length - 1]
            setLastDocument(lastVisible)

            // Combine the new queries with the existing state
            setIqa(prev => {
                const updatedIqa: any = {}

                Object.keys(initialIqa).forEach(iqaStatus => {
                    const status = iqaStatus as NcrTab

                    status === 'All'
                        ? (updatedIqa.All = [...prev.All, ...newQueries])
                        : (updatedIqa[status] = [
                            ...prev[status],
                            ...newQueries.filter(item => item.iqaStatus === status)
                        ])
                })

                return updatedIqa
            })

            setBtnLoading(false)
        } catch (err) {
            const { message } = err as { message: string }

            setError(message)
            setBtnLoading(false)
        }
    }

    // Fetch the nc-notify collection from firestore (first query)
    useEffect(() => {
        if (!userInfo) return setIqa(initialIqa)

        setLoading(true)

        const unsubscribe = iqaRef
            .where('creator.id', '==', userInfo.id)
            .orderBy('createdAt', 'desc')
            .limit(limitQuery)
            .onSnapshot({
                next: (snapshots) => {
                    const allIqa: IqaType[] = []

                    snapshots.forEach(snapshot => {
                        const iqa = snapshotToDoc<IqaType>(snapshot)

                        allIqa.push(iqa)
                    })

                    const lastVisible = snapshots.docs[snapshots.docs.length - 1]
                    setLastDocument(lastVisible)

                    const updatedIqa: any = {}

                    Object.keys(initialIqa).forEach(iqaStatus => {
                        const status = iqaStatus as NcrTab

                        status === 'All'
                            ? (updatedIqa.All = allIqa)
                            : (updatedIqa[status] = allIqa.filter(
                                (item) => item.iqaStatus === status
                            ))
                    })

                    setIqa(updatedIqa)
                    setLoading(false)
                },
                error: (err) => {
                    setError(err.message)
                    setIqa(initialIqa)
                    setLoading(false)
                }
            })

        return () => unsubscribe()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return (
        <IqaStateContext.Provider value={{ iqa, loading, error, queryMoreIqa, btnLoading }}>
            <IqaDispatchContext.Provider value={{ setIqa }}>
                {children}
            </IqaDispatchContext.Provider>
        </IqaStateContext.Provider>
    )
}

export default IqaContextProvider

export const useIqaContext = () => {
    const iqaState = useContext(IqaStateContext)
    const iqaDispatch = useContext(IqaDispatchContext)

    if (iqaState === undefined || iqaDispatch === undefined) {
        throw new Error('useIqaContext must be used within IqaContextProvider.')
    }

    return { iqaState, iqaDispatch}
}
