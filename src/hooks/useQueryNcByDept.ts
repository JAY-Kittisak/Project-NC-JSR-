import { useState, useEffect } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { NcrNotify, Branch, NcrTab, Nc } from '../types'
import { ncNotifyRef, snapshotToDoc } from '../firebase'
import { firebase } from '../firebase/config'

const limitQuery = 10

const initialNc: Nc = {
    All: [],
    รอตอบ: [],
    ตอบแล้ว: [],
    รอปิด: [],
    ไม่อนุมัติ: [],
    ปิดแล้ว: [],
}

export const useQueryNcByDept = (dept: string, branch: Branch) => {
    const { loading, setLoading, error, setError } = useAsyncCall()
    const [ncByDept, setNcByDept] = useState(initialNc)
    const [lastDocument, setLastDocument] = useState<firebase.firestore.DocumentData>()
    const [btnLoading, setBtnLoading] = useState(false)

    const queryMoreNc = async () => {
        try {
            if (!lastDocument) return alert('!แจ้งเตือน ทำการดึงข้อมูลมาหมดแล้ว')

            setBtnLoading(true)

            const snapshots = await ncNotifyRef
                .where('dept', '==', dept)
                .where('branch', '==', branch)
                .orderBy('createdAt', 'desc')
                .startAfter(lastDocument)
                .limit(limitQuery)
                .get()

            const newQueries = snapshots.docs.map(snapshot => snapshotToDoc<NcrNotify>(snapshot))

            const lastVisible = snapshots.docs[snapshots.docs.length - 1]
            setLastDocument(lastVisible)

            // Combine the new queries with the existing state
            setNcByDept(prev => {
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

    useEffect(() => {
        setLoading(true)

        const unsubscribe = ncNotifyRef
            .where('dept', '==', dept)
            .where('branch', '==', branch)
            .orderBy('createdAt', 'desc')
            .limit(limitQuery)
            .onSnapshot({
                next: (snapshots) => {
                    const allNc: NcrNotify[] = []

                    if (!snapshots) {
                        setNcByDept(initialNc)
                        setError('Nc not found.')
                        setLoading(false)
                        return
                    }

                    snapshots.forEach(snapshot => {
                        const ncr = snapshotToDoc<NcrNotify>(snapshot)

                        allNc.push(ncr)
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

                    setNcByDept(updatedNc)
                    setLoading(false)
                },
                error: (err) => {
                    setError(err.message)
                    setNcByDept(initialNc)
                    setLoading(false)
                },
            })

        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { ncByDept, loading, error, queryMoreNc, btnLoading }
}