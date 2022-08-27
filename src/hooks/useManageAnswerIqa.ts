import { useState } from 'react'
import { useAsyncCall } from './useAsyncCall'
import { AddAnswerIqaData, UploadAnswerIqa, StatusNc, CatIqa } from "../types"
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
        iqaId: string,
        iqaCategory: CatIqa,
        signature: string
    ) => (
        fileAnswerIqaUrl: string | undefined,
        filePath: string | undefined
    ) => {
            setLoading(true)
            setAddAnswerIqaFinished(false)

            if (fileAnswerIqaUrl && data.fileAnswerIqaName && filePath) {
                if (iqaCategory === 'OBS') {
                    const newAnswerIqa: UploadAnswerIqa = {
                        iqaId,
                        answerName: data.answerName,
                        signature,
                        correctiveAction: data.correctiveAction,
                        correctiveDueDate: data.correctiveDueDate,
                        correctiveName: data.correctiveName,
                        editedDoc: data.editedDoc,
                        docDetail: data.docDetail,
                        fileAnswerIqaName: data.fileAnswerIqaName,
                        fileAnswerIqaUrl,
                        fileAnswerIqaRef: filePath,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    }
    
    
                    iqaRef
                        .doc(iqaId)
                        .update({ iqaStatus: 'ตอบแล้ว' })
                        .catch((err) => {
                            const { message } = err as { message: string }
                            setError(message)
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
                        answerName: data.answerName,
                        signature,
                        containmentAction: data.containmentAction,
                        containmentDueDate: data.containmentDueDate,
                        containmentName: data.containmentName,
                        editedRootDoc: data.editedRootDoc,
                        rootCause: data.rootCause,
                        correctiveAction: data.correctiveAction,
                        correctiveDueDate: data.correctiveDueDate,
                        correctiveName: data.correctiveName,
                        fileAnswerIqaName: data.fileAnswerIqaName,
                        editedDoc: data.editedDoc,
                        docDetail: data.docDetail,
                        fileAnswerIqaUrl,
                        fileAnswerIqaRef: filePath,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    }
    
    
                    iqaRef
                        .doc(iqaId)
                        .update({ iqaStatus: 'ตอบแล้ว' })
                        .catch((err) => {
                            const { message } = err as { message: string }
                            setError(message)
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
            } else {
                const newAnswerIqa: UploadAnswerIqa = {
                    iqaId,
                    ...data,
                    signature,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }

                iqaRef
                    .doc(iqaId)
                    .update({ iqaStatus: 'ตอบแล้ว' })
                    .catch((err) => {
                        const { message } = err as { message: string }
                        setError(message)
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
        iqaStatus: StatusNc,
        iqaCategory: CatIqa,
        signature: string
    ) => (
        fileAnswerIqaUrl: string | undefined,
        filePath: string | undefined
    ) => {
            setLoading(true)
            setEditAnswerIqaFinished(false)

            if (fileAnswerIqaUrl && filePath && data.fileAnswerIqaName) {
                if (iqaCategory === 'OBS') {
                    const editedAnswerIqa: UploadAnswerIqa = {
                        iqaId,
                        answerName: data.answerName,
                        signature,
                        correctiveAction: data.correctiveAction,
                        correctiveDueDate: data.correctiveDueDate,
                        correctiveName: data.correctiveName,
                        editedDoc: data.editedDoc,
                        docDetail: data.docDetail,
                        fileAnswerIqaName: data.fileAnswerIqaName,
                        fileAnswerIqaUrl,
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

                    iqaAnswerRef
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
                        answerName: data.answerName,
                        signature,
                        containmentAction: data.containmentAction,
                        containmentDueDate: data.containmentDueDate,
                        containmentName: data.containmentName,
                        editedRootDoc: data.editedRootDoc,
                        rootCause: data.rootCause,
                        correctiveAction: data.correctiveAction,
                        correctiveDueDate: data.correctiveDueDate,
                        correctiveName: data.correctiveName,
                        fileAnswerIqaName: data.fileAnswerIqaName,
                        editedDoc: data.editedDoc,
                        docDetail: data.docDetail,
                        fileAnswerIqaUrl,
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

                    iqaAnswerRef
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
            } else {
                const editedAnswerIqa: UploadAnswerIqa = {
                    iqaId,
                    ...data,
                    signature,
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

                iqaAnswerRef
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