import { useState } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { AddAnswerNcData, UploadAnswerNc , StatusNc} from "../types"
import { createFileNcAnswerRef, ncAnswerRef, ncNotifyRef } from '../firebase'
import { firebase } from '../firebase/config'

export const useManageAnswerNc = () => {
    const [uploadProgression, setUploadProgression] = useState(0)
    const [addAnswerNcFinished, setAddAnswerNcFinished] = useState(false)
    const [editAnswerNcFinished, setEditAnswerNcFinished] = useState(false)

    const {loading, setLoading, error, setError} = useAsyncCall()

    const uploadImageToStorage = (
        fileNcAnswer: File | null, 
        cb: (fileAnswerNcUrl: string | undefined, filePath: string | undefined) => void
    ) => {
        setLoading(true)

        if (fileNcAnswer) {
            const fileAnswerNcRef = createFileNcAnswerRef(fileNcAnswer.name)
            const uploadTask = fileAnswerNcRef.put(fileNcAnswer)

            uploadTask.on('state_changed', (snapshot) => {
                const progression = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    
                setUploadProgression(progression)
            }, (err) => {
                setError(err.message)
                setLoading(false)
            }, () => {
                // Success case
    
                // Get the file Url
                uploadTask.snapshot.ref.getDownloadURL().then((fileAnswerNcUrl) => {
                    cb(fileAnswerNcUrl, fileAnswerNcRef.fullPath)
                }).catch(err => {
                    const { message } = err as {message: string}
    
                    setError(message)
                    setLoading(false)
                })
            })
        } else {
            cb(undefined, undefined)
        }
    }

    const addNewAnswerNc = (
        data: AddAnswerNcData, 
        ncId: string,
        signature: string,
    ) => (
        fileAnswerNcUrl: string | undefined,
        filePath: string | undefined
    ) => {
        const { 
            answerName,
            containmentAction,
            containmentDueDate,
            containmentName,
            rootCause,
            correctiveAction,
            correctiveDueDate,
            correctiveName,
            fileAnswerNcName,
            editedDoc,
            docDetail,
        } = data
        
        setLoading(true)
        setAddAnswerNcFinished(false)
        
        if (fileAnswerNcUrl && fileAnswerNcName) {
            const newAnswerNc: UploadAnswerNc = {
                ncId,
                answerName,
                signature,
                containmentAction,
                containmentDueDate,
                containmentName,
                rootCause,
                correctiveAction,
                correctiveDueDate,
                correctiveName,
                editedDoc,
                docDetail,
                fileAnswerNcUrl,
                fileAnswerNcName,
                fileAnswerNcRef: filePath,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }
    
            ncNotifyRef
                .doc(ncId)
                .update({ ncStatus : 'ตอบแล้ว'})
                .catch((err) => {
                    const { message } = err as { message: string }
            
                    setError(message)
                    setLoading(false)
                })
    
            ncAnswerRef.add(newAnswerNc).then(() => {
                setLoading(false)
                setAddAnswerNcFinished(true)
    
            }).catch(err => {
                const { message } = err as {message: string}
    
                setError(message)
                setLoading(false)
            })
        } else {
            const newAnswerNc: UploadAnswerNc = {
                ncId,
                answerName,
                signature,
                containmentAction,
                containmentDueDate,
                containmentName,
                rootCause,
                correctiveAction,
                correctiveDueDate,
                correctiveName,
                editedDoc,
                docDetail,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }
    
            ncNotifyRef
                .doc(ncId)
                .update({ ncStatus : 'ตอบแล้ว'})
                .catch((err) => {
                    const { message } = err as { message: string }
            
                    setError(message)
                    setLoading(false)
                })
    
            ncAnswerRef.add(newAnswerNc).then(() => {
                setLoading(false)
                setAddAnswerNcFinished(true)
    
            }).catch(err => {
                const { message } = err as {message: string}
    
                setError(message)
                setLoading(false)
            })
        }
    }

    const editAnswerNc = (
        answerNcId: string,
        data: AddAnswerNcData, 
        ncId: string,
        ncStatus: StatusNc,
        signature: string,
    ) => (
        fileAnswerNcUrl: string | undefined, 
        filePath: string | undefined
    ) => {
        const { 
            answerName,
            containmentAction,
            containmentDueDate,
            containmentName,
            rootCause,
            correctiveAction,
            correctiveDueDate,
            correctiveName,
            fileAnswerNcName,
            editedDoc,
            docDetail
        } = data
        
        setLoading(true)
        setEditAnswerNcFinished(false)
        
        if (fileAnswerNcUrl && filePath && fileAnswerNcName) {
            const editedAnswerNc: UploadAnswerNc = {
                ncId,
                answerName,
                signature,
                containmentAction,
                containmentDueDate,
                containmentName,
                rootCause,
                correctiveAction,
                correctiveDueDate,
                correctiveName,
                editedDoc,
                docDetail,
                fileAnswerNcUrl,
                fileAnswerNcName,
                fileAnswerNcRef: filePath,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }
    
            if (ncStatus === 'รอตอบ') {
                ncNotifyRef
                    .doc(ncId)
                    .update({ ncStatus : 'ตอบแล้ว'})
                    .catch((err) => {
                        const { message } = err as { message: string }
                
                        setError(message)
                        setLoading(false)
                    })
                    
            } else if (ncStatus === 'ไม่อนุมัติ') {
                ncNotifyRef
                    .doc(ncId)
                    .update({ ncStatus : 'รอปิด'})
                    .catch((err) => {
                        const { message } = err as { message: string }
                
                        setError(message)
                        setLoading(false)
                    })
            }
    
            ncAnswerRef
                .doc(answerNcId)
                .set(editedAnswerNc, {merge: true})
                .then(() => {
                    setEditAnswerNcFinished(true)
                    setLoading(false)
    
                })
                .catch(err => {
                    const { message } = err as {message: string}
        
                    setError(message)
                    setLoading(false)
                })
        } else {
            const editedAnswerNc: UploadAnswerNc = {
                ncId,
                answerName,
                signature,
                containmentAction,
                containmentDueDate,
                containmentName,
                rootCause,
                correctiveAction,
                correctiveDueDate,
                correctiveName,
                editedDoc,
                docDetail,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }
    
            if (ncStatus === 'รอตอบ') {
                ncNotifyRef
                    .doc(ncId)
                    .update({ ncStatus : 'ตอบแล้ว'})
                    .catch((err) => {
                        const { message } = err as { message: string }
                
                        setError(message)
                        setLoading(false)
                    })
                    
            } else if (ncStatus === 'ไม่อนุมัติ') {
                ncNotifyRef
                    .doc(ncId)
                    .update({ ncStatus : 'รอปิด'})
                    .catch((err) => {
                        const { message } = err as { message: string }
                
                        setError(message)
                        setLoading(false)
                    })
            }
    
            ncAnswerRef
                .doc(answerNcId)
                .set(editedAnswerNc, {merge: true})
                .then(() => {
                    setEditAnswerNcFinished(true)
                    setLoading(false)
    
                })
                .catch(err => {
                    const { message } = err as {message: string}
        
                    setError(message)
                    setLoading(false)
                })
        }
    }

    return {
        uploadImageToStorage,
        addNewAnswerNc,
        editAnswerNc,
        setUploadProgression,
        uploadProgression, 
        addAnswerNcFinished, 
        editAnswerNcFinished,
        loading, 
        error
    }
}