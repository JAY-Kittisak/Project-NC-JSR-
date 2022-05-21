import { useState } from 'react'
import { useAsyncCall } from './useAsyncCall'
import { AddAnswerIqaData, UploadAnswerIqa, StatusNc } from "../types"
import { iqaRef, iqaAnswerRef, createFileIqaAnswerRef } from '../firebase'
import { firebase } from '../firebase/config'

export const useManageAnswerIqa = () => {
    const [uploadProgression, setUploadProgression] = useState(0)
    const [addAnswerIqaFinished, setAddAnswerIqaFinished] = useState(false)
    const [editAnswerIqaFinished, setEditAnswerIqaFinished] = useState(false)

    const { loading, setLoading, error, setError } = useAsyncCall()

    const uploadFileToStorage = (
        fileIqaAnswer: File | null,
        cb: (fileAnswerIqaUrl: string | undefined, filePath: string | undefined) => void
    ) => {
        setLoading(true)

        if (fileIqaAnswer) {
            const fileAnswerIqaRef = createFileIqaAnswerRef(fileIqaAnswer.name)
            const uploadTask = fileAnswerIqaRef.put(fileIqaAnswer)

            uploadTask.on('state_changed', (snapshot) => {
                const progression = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

                setUploadProgression(progression)
            }, (err) => {
                setError(err.message)
                setLoading(false)
            }, () => {
                // Success case

                uploadTask.snapshot.ref.getDownloadURL().then((fileAnswerIqaUrl) => {
                    cb(fileAnswerIqaUrl, fileAnswerIqaRef.fullPath)
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

    const addNewAnswerIqa = (
        data: AddAnswerIqaData,
        iqaId: string
    ) => (
        fileAnswerIqaUrl: string | undefined,
        filePath: string | undefined
    ) => {
            const {
                answerName,
                containmentAction,
                containmentDueDate,
                containmentName,
                editedRootDoc,
                rootCause,
                correctiveAction,
                correctiveDueDate,
                correctiveName,
                editedDoc,
                docDetail,
                fileAnswerIqaName
            } = data

            setLoading(true)
            setAddAnswerIqaFinished(false)

            if (fileAnswerIqaUrl && fileAnswerIqaName && filePath) {
                const newAnswerIqa: UploadAnswerIqa = {
                    iqaId,
                    answerName,
                    containmentAction,
                    containmentDueDate,
                    containmentName,
                    editedRootDoc,
                    rootCause,
                    correctiveAction,
                    correctiveDueDate,
                    correctiveName,
                    editedDoc,
                    docDetail,
                    fileAnswerIqaName,
                    fileAnswerIqaUrl,
                    fileAnswerIqaRef: filePath,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }


                iqaRef
                    .doc(iqaId)
                    .update({ iqaStatus: 'ตอบแล้ว' })
                    .catch((err) => {
                        const { message } = err as { message: string }
                        console.log('err iqaRef', message)
                    })

                iqaAnswerRef
                    .add(newAnswerIqa).then(() => {
                        
                        setLoading(false)
                        setAddAnswerIqaFinished(true)
                    })
                    .catch((err) => {
                        const { message } = err as { message: string }
                        
                        setError(message)
                        setLoading(false)
                    })
            } else {
                const newAnswerIqa: UploadAnswerIqa = {
                    iqaId,
                    answerName,
                    containmentAction,
                    containmentDueDate,
                    containmentName,
                    editedRootDoc,
                    rootCause,
                    correctiveAction,
                    correctiveDueDate,
                    correctiveName,
                    editedDoc,
                    docDetail,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }

                iqaRef
                    .doc(iqaId)
                    .update({ iqaStatus: 'ตอบแล้ว' })
                    .catch((err) => {
                        const { message } = err as { message: string }
                        console.log('err iqaRef', message)
                    })

                iqaAnswerRef
                    .add(newAnswerIqa).then(() => {
                        
                        setLoading(false)
                        setAddAnswerIqaFinished(true)
                    })
                    .catch((err) => {
                        const { message } = err as { message: string }

                        setError(message)
                        setLoading(false)
                    })

            }

        }

    const editAnswerIqa = (
        answerIqaId: string,
        data: AddAnswerIqaData,
        iqaId: string,
        iqaStatus: StatusNc
    ) => (
        fileAnswerIqaUrl: string | undefined,
        filePath: string | undefined
    ) => {
            const {
                answerName,
                containmentAction,
                containmentDueDate,
                containmentName,
                editedRootDoc,
                rootCause,
                correctiveAction,
                correctiveDueDate,
                correctiveName,
                fileAnswerIqaName,
                editedDoc,
                docDetail,
            } = data

            setLoading(true)
            setEditAnswerIqaFinished(false)

            if (fileAnswerIqaUrl && filePath && fileAnswerIqaName) {
                const editedAnswerIqa: UploadAnswerIqa = {
                    iqaId,
                    answerName,
                    containmentAction,
                    containmentDueDate,
                    containmentName,
                    editedRootDoc,
                    rootCause,
                    correctiveAction,
                    correctiveDueDate,
                    correctiveName,
                    editedDoc,
                    docDetail,
                    fileAnswerIqaUrl,
                    fileAnswerIqaName,
                    fileAnswerIqaRef: filePath,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }

                if (iqaStatus === 'รอตอบ') {
                    iqaRef
                        .doc(iqaId)
                        .update({ iqaStatus: 'ตอบแล้ว' })
                        .catch((err) => {
                            const { message } = err as { message: string }

                            setError(message)
                            setLoading(false)
                        })
                } else if (iqaStatus === 'ไม่อนุมัติ') {
                    iqaRef
                        .doc(iqaId)
                        .update({ iqaStatus: 'รอปิด' })
                        .catch((err) => {
                            const { message } = err as { message: string }

                            setError(message)
                            setLoading(false)
                        })
                }

                iqaRef
                    .doc(answerIqaId)
                    .set(editedAnswerIqa, { merge: true })
                    .then(() => {
                        setEditAnswerIqaFinished(true)
                        setLoading(false)

                    })
                    .catch(err => {
                        const { message } = err as { message: string }

                        setError(message)
                        setLoading(false)
                    })
            } else {
                const editedAnswerIqa: UploadAnswerIqa = {
                    iqaId,
                    answerName,
                    containmentAction,
                    containmentDueDate,
                    containmentName,
                    editedRootDoc,
                    rootCause,
                    correctiveAction,
                    correctiveDueDate,
                    correctiveName,
                    editedDoc,
                    docDetail,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }

                if (iqaStatus === 'รอตอบ') {
                    iqaRef
                        .doc(iqaId)
                        .update({ iqaStatus: 'ตอบแล้ว' })
                        .catch((err) => {
                            const { message } = err as { message: string }

                            setError(message)
                            setLoading(false)
                        })
                } else if (iqaStatus === 'ไม่อนุมัติ') {
                    iqaRef
                        .doc(iqaId)
                        .update({ iqaStatus: 'รอปิด' })
                        .catch((err) => {
                            const { message } = err as { message: string }

                            setError(message)
                            setLoading(false)
                        })
                }

                iqaRef
                    .doc(answerIqaId)
                    .set(editedAnswerIqa, { merge: true })
                    .then(() => {
                        setEditAnswerIqaFinished(true)
                        setLoading(false)

                    })
                    .catch(err => {
                        const { message } = err as { message: string }

                        setError(message)
                        setLoading(false)
                    })
            }
        }

    return {
        uploadFileToStorage,
        addNewAnswerIqa,
        editAnswerIqa,
        setUploadProgression,
        uploadProgression,
        addAnswerIqaFinished,
        editAnswerIqaFinished,
        loading,
        error
    }
}