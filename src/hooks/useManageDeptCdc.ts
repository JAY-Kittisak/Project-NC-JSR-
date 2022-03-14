import { useState } from 'react'
import { departmentCdcRef } from '../firebase'
import { AddDepartment } from '../types'
import { firebase } from '../firebase/config'

import { useAsyncCall } from './useAsyncCall'

export const useManageDeptCdc = () => {
    const [addDeptCdcFinished, setAddDeptCdcFinished] = useState(false)
    
    const [editDeptCdcFinished, setEditDeptCdcFinished] = useState(false)

    const {loading, setLoading, error, setError} = useAsyncCall()

    const addNewDeptCdc = (data: AddDepartment) => {
        const { dept } = data
        setLoading(true)
        setAddDeptCdcFinished(false)

        const newDept: AddDepartment = {
            dept,
        }

        departmentCdcRef.add(newDept).then(() => {
            setAddDeptCdcFinished(true)
            setLoading(false)
        }).catch(err => {
            const { message } = err as {message: string}

            setError(message)
            setLoading(false)
        })
    }

    const editDeptCdc = (deptId: string,data: string) => {
        setLoading(true)
        setEditDeptCdcFinished(false)

        departmentCdcRef
            .doc(deptId)
            .update({topic: firebase.firestore.FieldValue.arrayUnion(data)})
            .then(() => {
                setLoading(false)
                setEditDeptCdcFinished(true)
            })
            .catch((err) => {
                const { message } = err as { message: string }
        
                setError(message)
                setLoading(false)
            })
    }

    return {
        addNewDeptCdc,
        editDeptCdc,
        addDeptCdcFinished,
        editDeptCdcFinished,
        loading,
        error
    }
}