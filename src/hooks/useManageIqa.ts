import { useState } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { createFileRef, iqaRef } from '../firebase'
import { firebase } from '../firebase/config'
import { AddIqaTypeData, UploadIqa, UserCreator, Branch } from "../types"


export const useManageIqa = () => {
    const [uploadProgression, setUploadProgression] = useState(0)
    const [addIqaFinished, setAddIqaFinished] = useState(false)

    const { loading, setLoading, error, setError } = useAsyncCall()

    const uploadImageToStorage = (
        fileNc: File | null,
        cb: (fileNcUrl: string | undefined, filePath: string | undefined) => void
    ) => {
        setLoading(true)

        if (fileNc) {
            const fileNcRef = createFileRef(fileNc.name)
            const uploadTask = fileNcRef.put(fileNc)

            uploadTask.on('state_changed', (snapshot) => {
                const progression = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

                setUploadProgression(progression)
            }, (err) => {
                setError(err.message)
                setLoading(false)
            }, () => {
                // Success case

                // Get the file Url
                uploadTask.snapshot.ref.getDownloadURL().then((fileNcUrl) => {
                    cb(fileNcUrl, fileNcRef.fullPath)
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
        inspector: string[],
        creator: UserCreator,
        code: string,
        branch: Branch,
    ) => (
        fileIqaUrl: string | undefined,
        filePath: string | undefined
    ) => {
        const {
            team,
            category,
            toName,
            dept,
            checkedProcess,
            requirements,
            detail,
            fileIqaName
        } = data
        
        setLoading(true)
        setAddIqaFinished(false)

        if (fileIqaUrl && fileIqaName) {
            const newIqa: UploadIqa = {
                code,
                team,
                category,
                toName,
                dept,
                checkedProcess,
                requirements,
                detail,
                inspector,
                iqaStatus: 'รอตอบ',
                branch: branch,
                creator,

                fileIqaUrl,
                fileIqaRef: filePath,
                fileIqaName,
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
                category,
                toName,
                dept,
                checkedProcess,
                requirements,
                detail,
                inspector,
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

    return {
        uploadImageToStorage,
        addNewIqa,
        setUploadProgression,
        uploadProgression,
        addIqaFinished,
        loading,
        error
    }
}