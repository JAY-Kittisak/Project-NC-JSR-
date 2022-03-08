import { useState, useEffect } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { NcrNotify, Branch, NcrTab ,Nc} from '../types'
import { ncNotifyRef, snapshotToDoc } from '../firebase'

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
    // const [ncByDept, setNcByDept] = useState<NcrNotify[] | null>(null)
    const [ncByDept, setNcByDept] = useState(initialNc)

    useEffect(() => {
        setLoading(true)

        const unsubscribe = ncNotifyRef
        .where('dept', '==', dept)
        .where('branch', '==', branch)
        .orderBy('createdAt', 'desc')
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

    return { ncByDept, loading, error }
}