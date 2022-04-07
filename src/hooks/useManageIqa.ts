import { useState } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { createFileIqaRef, iqaRef } from '../firebase'
import { firebase } from '../firebase/config'
import { 
    AddIqaTypeData, 
    UploadIqa, 
    UserCreator, 
    Branch, 
    AddFollowIqaData, 
    UploadFollowIqa, 
    AddApproveIqaData,
    UploadApproveIqa,
    StatusNc
} from "../types"


export const useManageIqa = () => {
    const [uploadProgression, setUploadProgression] = useState(0)
    const [addIqaFinished, setAddIqaFinished] = useState(false)

    const { loading, setLoading, error, setError } = useAsyncCall()

    const uploadFileToStorage = (
        fileIqa: File | null,
        cb: (fileIqaUrl: string | undefined, filePath: string | undefined) => void
    ) => {
        setLoading(true)

        if (fileIqa) {
            const fileIqaRef = createFileIqaRef(fileIqa.name)
            const uploadTask = fileIqaRef.put(fileIqa)

            uploadTask.on('state_changed', (snapshot) => {
                const progression = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

                setUploadProgression(progression)
            }, (err) => {
                setError(err.message)
                setLoading(false)
            }, () => {
                // Success case

                // Get the file Url
                uploadTask.snapshot.ref.getDownloadURL().then((fileIqaUrl) => {
                    cb(fileIqaUrl, fileIqaRef.fullPath)
                }).catch(err => {
                    const { message } = err as { message: string }

                    setError(message)
                    setLoading(false)
                })
            })
        } else {
            cb(undefined, undefined)
        }
    }

    const addNewIqa = (
        data: AddIqaTypeData,
        creator: UserCreator,
        code: string,
        branch: Branch,
    ) => (
        fileIqaUrl: string | undefined,
        filePath: string | undefined
    ) => {
        const {
            team,
            round,
            category,
            toName,
            dept,
            checkedProcess,
            requirements,
            detail,
            fileIqaName,
            inspector1,
            inspector2,
            inspector3,
            inspector4
        } = data
        
        setLoading(true)
        setAddIqaFinished(false)

        if (fileIqaUrl && fileIqaName) {
            const newIqa: UploadIqa = {
                code,
                team,
                round,
                category,
                toName,
                dept,
                checkedProcess,
                requirements,
                detail,
                inspector1,
                inspector2: inspector2 ? inspector2 : null,
                inspector3: inspector3 ? inspector3 : null,
                inspector4: inspector4 ? inspector4 : null,
                iqaStatus: 'รอตอบ',
                branch: branch,
                creator,
                fileIqaUrl,
                fileIqaName,
                fileIqaRef: filePath,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }

            iqaRef.add(newIqa).then(() => {
                setLoading(false)
                setAddIqaFinished(true)
            }).catch(err => {
                const { message } = err as { message: string }

                setError(message)
                setLoading(false)
            })
        } else {
            // FIXME:
            const newIqa: UploadIqa = {
                code,
                team,
                round,
                category,
                toName,
                dept,
                checkedProcess,
                requirements,
                detail,
                inspector1,
                inspector2: inspector2 ? inspector2 : null,
                inspector3: inspector3 ? inspector3 : null,
                inspector4: inspector4 ? inspector4 : null,
                iqaStatus: 'รอตอบ',
                branch: branch,
                creator,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }

            iqaRef.add(newIqa).then(() => {
                setLoading(false)
                setAddIqaFinished(true)
            }).catch(err => {
                const { message } = err as { message: string }

                setError(message)
                setLoading(false)
            })
        }
    }

    const updateIqaFollow = async (iqaId: string, data: AddFollowIqaData) => {
        try {
            setLoading(true)
            
            const { followIqa, followDetail } = data

            const upFollowIqa: UploadFollowIqa = {
                followIqa,
                followDetail,
                followedAt: firebase.firestore.FieldValue.serverTimestamp(),
            }

            if (followIqa === 'Found fix') {
                await iqaRef.doc(iqaId).update({
                    iqaStatus: 'รอปิด',
                    follow: upFollowIqa
                })

                setLoading(false)
                return true
            } 

            if (followIqa === 'Can not fix') {
                await iqaRef.doc(iqaId).update({
                    iqaStatus: 'รอตอบ',
                    follow: upFollowIqa
                })

                setLoading(false)
                return true
            }

        } catch (err) {
            const { message } = err as { message: string }

            setError(message)
            setLoading(false)

            return false
        }
    }

    const updateIqaApprove = async (iqaId: string, data: AddApproveIqaData) => {
        try {
            setLoading(true)

            const { approveIqa, approveDetail, qmrName } = data

            const upApproveIqa: UploadApproveIqa = {
                approveIqa,
                approveDetail,
                qmrName,
                approvedAt: firebase.firestore.FieldValue.serverTimestamp()
            }

            if (approveIqa === 'Yes') {
                await iqaRef.doc(iqaId).update({
                    iqaStatus: 'ปิดแล้ว',
                    approve: upApproveIqa
                })

                setLoading(false)
                return true
            }

            if (approveIqa === 'No') {
                await iqaRef.doc(iqaId).update({
                    iqaStatus: 'ไม่อนุมัติ',
                    approve: upApproveIqa
                })

                setLoading(false)
                return true
            }

        } catch (err) {
            const { message } = err as { message: string }

            setError(message)
            setLoading(false)

            return false
        }
    }

    const updateIqaStatus = async (iqaId: string, newStatus: StatusNc) => {
        try {
            setLoading(true)
            
            await iqaRef.doc(iqaId).update({
                iqaStatus: newStatus,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            })

            setLoading(false)
            return true
        } catch (err) {
            setError('Sorry, something went wrong')
            setLoading(false)

            return false
        }
    }

    return {
        uploadFileToStorage,
        addNewIqa,
        updateIqaFollow,
        updateIqaApprove,
        updateIqaStatus,
        setUploadProgression,
        uploadProgression,
        addIqaFinished,
        loading,
        error
    }
}