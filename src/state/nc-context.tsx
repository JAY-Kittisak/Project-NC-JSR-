import React, {
    createContext,
    useContext,
    Dispatch,
    SetStateAction,
    useState,
    useEffect
} from 'react'

import { useAsyncCall } from '../hooks/useAsyncCall'
import { NcrTab, NcrNotify, Nc } from '../types'
import { firebase } from '../firebase/config'
import {
    ncNotifyRef,
    snapshotToDoc,
} from '../firebase'
import { useAuthContext } from './auth-context'

const limitQuery = 12

interface Props { }

type NcrState = {
    ncNotify: Nc
    loading: boolean
    error: string
    queryMoreNc: () => void
    btnLoading: boolean
}
type NcDispatch = {
    setNcNotify: Dispatch<SetStateAction<Nc>>
}

const NcStateContext = createContext<NcrState | undefined>(undefined)
const NcDispatchContext = createContext<NcDispatch | undefined>(undefined)

export const initialNc: Nc = {
    All: [],
    รอตอบ: [],
    ตอบแล้ว: [],
    รอปิด: [],
    ไม่อนุมัติ: [],
    ปิดแล้ว: [],
    ยกเลิก: [],
}

const NcContextProvider: React.FC<Props> = ({ children }) => {
    const { loading, setLoading, error, setError } = useAsyncCall()
    const [ncNotify, setNcNotify] = useState(initialNc)
    const [lastDocument, setLastDocument] = useState<firebase.firestore.DocumentData>()
    const [btnLoading, setBtnLoading] = useState(false)

    const { authState: { userInfo } } = useAuthContext()

    const queryMoreNc = async () => {
        try {
            if (!lastDocument || !userInfo) return

            setBtnLoading(true)

            const snapshots = await ncNotifyRef
                .where('creator.id', '==', userInfo.id)
                .orderBy('createdAt', 'desc')
                .startAfter(lastDocument)
                .limit(limitQuery)
                .get()

            const newQueries = snapshots.docs.map(snapshot => snapshotToDoc<NcrNotify>(snapshot))

            const lastVisible = snapshots.docs[snapshots.docs.length - 1]
            setLastDocument(lastVisible)

            // Combine the new queries with the existing state
            setNcNotify(prev => {
                const updatedNc: any = {}

                Object.keys(initialNc).forEach(ncStatus => {
                    const status = ncStatus as NcrTab

                    status === 'All'
                        ? (updatedNc.All = [...prev.All, ...newQueries])
                        : (updatedNc[status] = [
                            ...prev[status],
                            ...newQueries.filter(item => item.ncStatus === status)
                        ])
                })

                return updatedNc
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
        if (!userInfo) return setNcNotify(initialNc)

        setLoading(true)

        const unsubscribe = ncNotifyRef
            .where('creator.id', '==', userInfo.id)
            .orderBy('createdAt', 'desc')
            .limit(limitQuery)
            .onSnapshot({
                next: (snapshots) => {
                    const allNc: NcrNotify[] = []

                    snapshots.forEach(snapshot => {
                        const nc = snapshotToDoc<NcrNotify>(snapshot)

                        allNc.push(nc)
                    })

                    const lastVisible = snapshots.docs[snapshots.docs.length - 1]
                    setLastDocument(lastVisible)

                    const updatedNc: any = {}

                    Object.keys(initialNc).forEach(ncStatus => {
                        const status = ncStatus as NcrTab

                        status === 'All'
                            ? (updatedNc.All = allNc)
                            : (updatedNc[status] = allNc.filter(
                                (item) => item.ncStatus === status
                            ))
                    })

                    setNcNotify(updatedNc)
                    setLoading(false)
                },
                error: (err) => {
                    setError(err.message)
                    setNcNotify(initialNc)
                    setLoading(false)
                }
            })

        return () => unsubscribe()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <NcStateContext.Provider value={{ ncNotify, loading, error, queryMoreNc, btnLoading }}>
            <NcDispatchContext.Provider value={{ setNcNotify }}>
                {children}
            </NcDispatchContext.Provider>
        </NcStateContext.Provider>
    )
}

export default NcContextProvider

export const useNcContext = () => {
    const ncState = useContext(NcStateContext)
    const ncDispatch = useContext(NcDispatchContext)

    if (ncState === undefined || ncDispatch === undefined) {
        throw new Error('useNcContext must be used within NcContextProvider.')
    }

    return { ncState, ncDispatch }
}