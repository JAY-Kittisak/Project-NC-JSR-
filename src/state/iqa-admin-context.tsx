import React, {
    createContext,
    useContext,
    Dispatch,
    SetStateAction,
    useState,
    useEffect
} from 'react'

import { useAsyncCall } from '../hooks/useAsyncCall'
import { NcrTab, IqaType, IqaTabAll, Branch } from '../types'
import { firebase } from '../firebase/config'
import {
    iqaRef,
    snapshotToDoc,
    iqaCountsRef,
    iqaCountsCdcRef
} from '../firebase'
import { useAuthContext } from './auth-context'
import { isClient } from '../helpers'

const limitQuery = 10

interface Props { }

type IqaCounts = { [key in NcrTab]: number }
type IqaState = {
    iqa: IqaTabAll
    iqaCounts: IqaCounts
    loading: boolean
    error: string
    queryMoreIqa: () => void
    branch: Branch
}
type IqaDispatch = {
    setIqa: Dispatch<SetStateAction<IqaTabAll>>
    setBranch: Dispatch<SetStateAction<Branch>>
}

const IqaAdminStateContext = createContext<IqaState | undefined>(undefined)
const IqaAdminDispatchContext = createContext<IqaDispatch | undefined>(undefined)

const initialIqa: IqaTabAll = {
    All: [],
    รอตอบ: [],
    ตอบแล้ว: [],
    รอปิด: [],
    ไม่อนุมัติ: [],
    ปิดแล้ว: [],
    ยกเลิก: [],
}

const initialIqaCounts: IqaCounts = {
    All: 0,
    รอตอบ: 0,
    ตอบแล้ว: 0,
    รอปิด: 0,
    ไม่อนุมัติ: 0,
    ปิดแล้ว: 0,
    ยกเลิก: 0,
}

const IqaAdminProvider: React.FC<Props> = ({ children }) => {
    const { loading, setLoading, error, setError } = useAsyncCall()
    const [branch, setBranch] = useState<Branch>('ลาดกระบัง')
    const [iqa, setIqa] = useState(initialIqa)
    const [iqaCounts, setIqaCounts] = useState(initialIqaCounts)
    const [lastDocument, setLastDocument] = useState<firebase.firestore.DocumentData>()

    const { authState: { userInfo } } = useAuthContext()
    
    const queryMoreIqa = async () => {
        try {
            if (!lastDocument) return

            setLoading(true)

            const snapshots = await iqaRef
                .where('branch', '==', branch)
                .orderBy('createdAt', 'desc')
                .startAfter(lastDocument)
                .limit(limitQuery)
                .get()

                const newQueries = snapshots.docs.map(snapshot => snapshotToDoc<IqaType>(snapshot))
            
                const lastVisible = snapshots.docs[snapshots.docs.length - 1]
                setLastDocument(lastVisible)

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

                setLoading(false)
        } catch (err) {
            const { message } = err as { message: string }

            setError(message)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!userInfo || isClient(userInfo.role)) return setIqa(initialIqa)

        setLoading(true)

        const unsubscribe = iqaRef
            .where('branch', '==', branch)
            .orderBy('createdAt', 'desc')
            .limit(limitQuery)
            .onSnapshot({
                next: (snapshots) => {
                    const allIqa = snapshots.docs.map(snapshot => snapshotToDoc<IqaType>(snapshot))
                    
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
    }, [branch])

    useEffect(() => {

        if (!userInfo) return setIqaCounts(initialIqaCounts)

        let unsubscribe: () => void

        if (branch === 'ลาดกระบัง') {
            unsubscribe = iqaCountsRef
                .doc('counts')
                .onSnapshot((snapshot) => {
                    const countsData = snapshot.data() as IqaCounts

                    if (!countsData) return setIqaCounts(initialIqaCounts)

                    setIqaCounts(countsData)
                })
        } else if (branch === 'ชลบุรี') {
            unsubscribe = iqaCountsCdcRef
                .doc('counts')
                .onSnapshot((snapshot) => {
                    const countsData = snapshot.data() as IqaCounts

                    if (!countsData) return setIqaCounts(initialIqaCounts)

                    setIqaCounts(countsData)
                })
        }

        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branch])

    
    return (
        <IqaAdminStateContext.Provider value={{ iqa, iqaCounts, loading, error, queryMoreIqa, branch}}>
            <IqaAdminDispatchContext.Provider value={{ setIqa, setBranch}}>
                {children}
            </IqaAdminDispatchContext.Provider>
        </IqaAdminStateContext.Provider>
    )
}

export default IqaAdminProvider

export const useIqaAdminContext = () => {
    const iqaState = useContext(IqaAdminStateContext)
    const iqaDispatch = useContext(IqaAdminDispatchContext)

    if (iqaState === undefined || iqaDispatch === undefined) {
        throw new Error('useIqaContext must be used within IqaContextProvider.')
    }

    return { iqaState, iqaDispatch}
}