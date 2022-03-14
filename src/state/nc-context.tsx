import React, {
    createContext,
    useContext,
    Dispatch,
    SetStateAction,
    useState,
    useEffect
} from 'react'

import { useAsyncCall } from '../hooks/useAsyncCall'
import { NcrTab, NcrNotify, CatNc ,Nc} from '../types'
import { firebase } from '../firebase/config'
import { 
    ncNotifyRef, 
    snapshotToDoc,
    ncCountsRef,
    ncCountsCdcRef 
} from '../firebase'
import { useAuthContext } from './auth-context'
import { isAdmin, isClient } from '../helpers'

const limitQuery = 10

interface Props {}

type NcCounts = { [key in NcrTab | CatNc]: number}
type NcrState = {
    ncNotify: Nc
    ncCounts: NcCounts
    ncCountsCdc: NcCounts
    loading: boolean
    error: string
    queryMoreNc: () => void
}
type NcDispatch ={
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

const NcContextProvider: React.FC<Props> = ({ children }) => {
    const {loading ,setLoading, error, setError} = useAsyncCall()
    const [ncNotify, setNcNotify] = useState(initialNc)
    const [ncCounts, setNcCounts] = useState(initialNcCounts)
    const [ncCountsCdc, setNcCountsCdc] = useState(initialNcCounts)
    const [lastDocument, setLastDocument] = useState<firebase.firestore.DocumentData>()

    const {authState: { userInfo }} = useAuthContext()

    const queryMoreNc = async () => {
        try {
            if (!lastDocument) return

            setLoading(true)

            const snapshots = await ncNotifyRef
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
            const { message } = err as {message: string}

            setError(message)
            setLoading(false)
        }
    }

    // Fetch the nc-notify collection from firestore
    useEffect(() => {
        if (!userInfo) return setNcNotify(initialNc)

        setLoading(true)

        let unsubscribe: () => void

        if (isClient(userInfo.role)) {
            // If the user is a client, query only the orders that belong to this user.
            unsubscribe = ncNotifyRef
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

        } else if (isAdmin(userInfo.role)) {
        // If the user i an admin, query all Departments.
            unsubscribe = ncNotifyRef
                .orderBy('createdAt', 'desc')
                .limit(limitQuery)
                .onSnapshot({
                    next: (snapshots) => {
                        const allNc = snapshots.docs.map(snapshot => snapshotToDoc<NcrNotify>(snapshot))

                        // snapshots.forEach(snapshot => {
                        //     const nc = snapshotToDoc<NcrNotify>(snapshot)

                        //     allNc.push(nc)
                        // })

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
            }
            return () => unsubscribe()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Fetch the nc-counts collection from firestore
    useEffect(() => {
        
        if (!userInfo) return setNcCounts(initialNcCounts)

        const unsubscribe = ncCountsRef
            .doc('counts')
            .onSnapshot((snapshot) => {
                const countsData = snapshot.data() as NcCounts

                if (!countsData) return setNcCounts(initialNcCounts)

                setNcCounts(countsData)
            }
        )

        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Fetch the nc-counts-cdc collection from firestore
    useEffect(() => {
        
        if (!userInfo) return setNcCountsCdc(initialNcCounts)

        const unsubscribe = ncCountsCdcRef
            .doc('counts')
            .onSnapshot((snapshot) => {
                const countsData = snapshot.data() as NcCounts

                if (!countsData) return setNcCountsCdc(initialNcCounts)

                setNcCountsCdc(countsData)
            }
        )

        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <NcStateContext.Provider value={{ncNotify, ncCounts, ncCountsCdc, loading, error, queryMoreNc}}>
            <NcDispatchContext.Provider value={{setNcNotify}}>
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

    return {ncState, ncDispatch}
}