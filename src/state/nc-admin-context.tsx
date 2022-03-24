import React, {
    createContext,
    useContext,
    Dispatch,
    SetStateAction,
    useState,
    useEffect
} from 'react'

import { useAsyncCall } from '../hooks/useAsyncCall'
import { NcrTab, NcrNotify, CatNc, Nc, Branch } from '../types'
import { firebase } from '../firebase/config'
import {
    ncNotifyRef,
    snapshotToDoc,
    ncCountsRef,
    ncCountsCdcRef
} from '../firebase'
import { useAuthContext } from './auth-context'
import { isClient } from '../helpers'

const limitQuery = 10

interface Props { }

type NcCounts = { [key in NcrTab | CatNc]: number }
type NcrState = {
    ncNotify: Nc
    ncCounts: NcCounts
    loading: boolean
    error: string
    queryMoreNc: () => void
    branch: Branch
}
type NcDispatch = {
    setNcNotify: Dispatch<SetStateAction<Nc>>
    setBranch: Dispatch<SetStateAction<Branch>>
}

const NcAdminStateContext = createContext<NcrState | undefined>(undefined)
const NcAdminDispatchContext = createContext<NcDispatch | undefined>(undefined)

export const initialNc: Nc = {
    All: [],
    รอตอบ: [],
    ตอบแล้ว: [],
    รอปิด: [],
    ไม่อนุมัติ: [],
    ปิดแล้ว: [],
}

const initialNcCounts: NcCounts = {
    All: 0,
    รอตอบ: 0,
    ตอบแล้ว: 0,
    รอปิด: 0,
    ไม่อนุมัติ: 0,
    ปิดแล้ว: 0,
    NCR: 0,
    CCR: 0,
    SCR: 0,
}

const NcAdminProvider: React.FC<Props> = ({ children }) => {
    const { loading, setLoading, error, setError } = useAsyncCall()
    const [branch, setBranch] = useState<Branch>('ลาดกระบัง')
    const [ncNotify, setNcNotify] = useState(initialNc)
    const [ncCounts, setNcCounts] = useState(initialNcCounts)
    const [lastDocument, setLastDocument] = useState<firebase.firestore.DocumentData>()

    const { authState: { userInfo } } = useAuthContext()

    const queryMoreNc = async () => {
        try {
            if (!lastDocument) return

            setLoading(true)

            const snapshots = await ncNotifyRef
                .where('branch', '==', branch)
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

            setLoading(false)
        } catch (err) {
            const { message } = err as { message: string }

            setError(message)
            setLoading(false)
        }
    }

    // Fetch the nc-notify collection from firestore (first query)
    useEffect(() => {
        if (!userInfo || isClient(userInfo.role)) return setNcNotify(initialNc)

        setLoading(true)
        // If the user i an admin, query all Departments.
        const unsubscribe = ncNotifyRef
            .where('branch', '==', branch)
            .orderBy('createdAt', 'desc')
            .limit(limitQuery)
            .onSnapshot({
                next: (snapshots) => {
                    const allNc = snapshots.docs.map(snapshot => snapshotToDoc<NcrNotify>(snapshot))

                    // snapshots.forEach(snapshot => {
                    //     const nc = snapshotToDoc<NcrNotify>(snapshot)

                    //     allNc.push(nc)
                    // })

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
    }, [branch])

    // Fetch the nc-counts collection from firestore
    useEffect(() => {

        if (!userInfo) return setNcCounts(initialNcCounts)

        let unsubscribe: () => void

        if (branch === 'ลาดกระบัง') {
            unsubscribe = ncCountsRef
                .doc('counts')
                .onSnapshot((snapshot) => {
                    const countsData = snapshot.data() as NcCounts

                    if (!countsData) return setNcCounts(initialNcCounts)

                    setNcCounts(countsData)
                })
        } else if (branch === 'ชลบุรี') {
            unsubscribe = ncCountsCdcRef
                .doc('counts')
                .onSnapshot((snapshot) => {
                    const countsData = snapshot.data() as NcCounts

                    if (!countsData) return setNcCounts(initialNcCounts)

                    setNcCounts(countsData)
                })
        }

        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branch])

    return (
        <NcAdminStateContext.Provider value={{ ncNotify, ncCounts, loading, error, queryMoreNc, branch }}>
            <NcAdminDispatchContext.Provider value={{ setNcNotify, setBranch }}>
                {children}
            </NcAdminDispatchContext.Provider>
        </NcAdminStateContext.Provider>
    )
}

export default NcAdminProvider

export const useNcAdminContext = () => {
    const ncState = useContext(NcAdminStateContext)
    const ncDispatch = useContext(NcAdminDispatchContext)

    if (ncState === undefined || ncDispatch === undefined) {
        throw new Error('useNcContext must be used within NcContextProvider.')
    }

    return { ncState, ncDispatch }
}