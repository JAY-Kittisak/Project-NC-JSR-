import { useState } from 'react'
import { departmentRef } from '../firebase'
import { AddDepartment } from '../types'
import { firebase } from '../firebase/config'

import { useAsyncCall } from './useAsyncCall'

export const useManageDept = () => {
    const [addDeptFinished, setAddDeptFinished] = useState(false)
    
    const [editDeptFinished, setEditDeptFinished] = useState(false)

    const {loading, setLoading, error, setError} = useAsyncCall()

    const addNewDept = (data: AddDepartment) => {
        const {dept, emailJsr, emailCdc} = data
        setLoading(true)
        setAddDeptFinished(false)

        const newDept: AddDepartment = {
            dept,
            emailJsr,
            emailCdc
        }

        departmentRef.add(newDept).then(() => {
            setAddDeptFinished(true)
            setLoading(false)
        }).catch(err => {
            const { message } = err as {message: string}

            setError(message)
            setLoading(false)
        })
    }

    const editDept = (deptId: string,data: string) => {
        setLoading(true)
        setEditDeptFinished(false)

        departmentRef
            .doc(deptId)
            .update({topic: firebase.firestore.FieldValue.arrayUnion(data)})
            .then(() => {
                setLoading(false)
                setEditDeptFinished(true)
            })
            .catch((err) => {
                const { message } = err as { message: string }
        
                setError(message)
                setLoading(false)
            })
    }

    return {
        addNewDept,
        editDept,
        addDeptFinished,
        editDeptFinished,
        loading,
        error
    }
}