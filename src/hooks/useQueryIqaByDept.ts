import { useState, useEffect} from 'react'

import { useAsyncCall } from './useAsyncCall'
import { Branch, IqaTabAll, IqaType, NcrTab } from '../types'
import { iqaRef, snapshotToDoc } from '../firebase'
import { firebase } from '../firebase/config'

const limitQuery = 10

const initialIqa: IqaTabAll = {
    All: [],
    รอตอบ: [],
    ตอบแล้ว: [],
    รอปิด: [],
    ไม่อนุมัติ: [],
    ปิดแล้ว: [],
    ยกเลิก: [],
}

export const useQueryIqaByDept = (dept: string, branch: Branch) => {
    const { loading, setLoading, error, setError} = useAsyncCall()
    const [ iqaByDept, setIqaByDept ] = useState(initialIqa)
    const [lastDocument, setLastDocument] = useState<firebase.firestore.DocumentData>()
    const [btnLoading, setBtnLoading] = useState(false)

    const queryMoreIqa = async () => {
        try {
            if (!lastDocument) return alert('!แจ้งเตือน ทำการดึงข้อมูลมาหมดแล้ว')

            setBtnLoading(true)

            const snapshots = await iqaRef
                .where('dept', '==', dept)
                .where('branch', '==', branch)
                .orderBy('createdAt', 'desc')
                .startAfter(lastDocument)
                .limit(limitQuery)
                .get()

                const newQueries = snapshots.docs.map(snapshot => snapshotToDoc<IqaType>(snapshot))
            
                const lastVisible = snapshots.docs[snapshots.docs.length - 1]
                setLastDocument(lastVisible)

                setIqaByDept(prev => {
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

    useEffect(() => {
        setLoading(true)

        const unsubscribe = iqaRef
            .where('dept', '==', dept)
            .where('branch', '==', branch)
            .orderBy('createdAt', 'desc')
            .limit(limitQuery)
            .onSnapshot({
                next: (snapshots) => {
                    const allIqa: IqaType[] = []

                    if (!snapshots) {
                        setIqaByDept(initialIqa)
                        setError('Iqa not found.')
                        setLoading(false)
                        return
                    }

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

                    setIqaByDept(updatedIqa)
                    setLoading(false)
                },
                error: (err) => {
                    setError(err.message)
                    setIqaByDept(initialIqa)
                    setLoading(false)
                }
            })
        
        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { iqaByDept, loading, error, queryMoreIqa, btnLoading}
}