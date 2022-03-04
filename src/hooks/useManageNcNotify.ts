import { useState } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { createFileRef, ncNotifyRef, ncCountsCodeRef, ncCountsCodeCdcRef } from '../firebase'
import { firebase } from '../firebase/config'
import { 
    AddNcrNotifyData, 
    UploadNcNotify, 
    StatusNc, 
    Branch,
    UserCreator,
    AddFollowNcData,
    UploadFollowNc,
    AddApproveNcData,
    UploadApproveNc,
    CountsCode
} from "../types"

export const useManageNcNotify = () => {
    const [uploadProgression, setUploadProgression] = useState(0)
    const [addNcNotifyFinished, setAddNcNotifyFinished] = useState(false)

    const {loading, setLoading, error, setError} = useAsyncCall()

    const addNewNcNotify = async (
        fileNc: File | null, 
        data: AddNcrNotifyData, 
        email: string,
        creator: UserCreator,
        code: string, 
        branch: Branch, 
        ncStatus: StatusNc
    ) => {
        
        const { category, dept, topic, topicType, detail } = data
        
        setLoading(true)
        setAddNcNotifyFinished(false)
        
        let codeFinished: string

        if (branch === 'ลาดกระบัง') {
            const codeCountsItem = ncCountsCodeRef.doc(code)
            const codeCount = await codeCountsItem.get()
            
            if (!codeCount.exists) {
                codeFinished = code + '0001'
            } else {
                const {counts} = codeCount.data() as CountsCode
                
                const sumCountCode = counts + 1 
                codeFinished = code + sumCountCode.toString().padStart(4, '0')
            }
        } else {
            const codeCountsItemCdc = ncCountsCodeCdcRef.doc(code)
            const codeCount = await codeCountsItemCdc.get()
            
            if (!codeCount.exists) {
                codeFinished = code + '0001'
            } else {
                const {counts} = codeCount.data() as CountsCode

                const sumCountCode = counts + 1 
                codeFinished = code + sumCountCode.toString().padStart(4, '0')
            }
        }

        if (fileNc) {

            // 1. Upload an file Nc to firebase storage, get back a image url
            const fileNcRef = createFileRef(fileNc.name)
            const uploadTask = fileNcRef.put(fileNc)
    
            uploadTask.on('state_changed', (snapshot) => {
                // Calculate upload progression
                const progression = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    
                setUploadProgression(progression)
            }, (err) => {
                // Error case
                setError(err.message)
                setLoading(false)
            }, () => {
                // Success case
    
                // Get the file Url
                uploadTask.snapshot.ref.getDownloadURL().then((fileNcUrl) => {
                    // 2. Create a new document in the nc-notify collection in firestore, requires nc-notify data and the image url
    
                    const newNcNotify: UploadNcNotify = {
                        code: codeFinished,
                        category,
                        dept,
                        email,
                        topic,
                        topicType,
                        detail,
                        branch,
                        ncStatus,
                        fileNcUrl,
                        fileNcName: fileNc.name,
                        fileNcRef: fileNcRef.fullPath,
                        creator,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    }
    
                    ncNotifyRef.add(newNcNotify).then(() => {
                        setAddNcNotifyFinished(true)
                        setLoading(false)
    
                    }).catch(err => {
                        const { message } = err as {message: string}
        
                        setError(message)
                        setLoading(false)
                    })
    
                }).catch(err => {
                    const { message } = err as {message: string}
    
                    setError(message)
                    setLoading(false)
                })
            })
            
        } else {

            const newNcNotify: UploadNcNotify = {
                code: codeFinished,
                category,
                dept,
                email,
                topic,
                topicType,
                detail,
                branch,
                ncStatus,
                creator,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }

            ncNotifyRef.add(newNcNotify).then(() => {
                setAddNcNotifyFinished(true)
                setLoading(false)

            }).catch(err => {
                const { message } = err as {message: string}

                setError(message)
                setLoading(false)
            })
        }
    }

    const updateNcFollow = async (ncId: string, data: AddFollowNcData) => {
        try {
            setLoading(true)

            const { followNc, followDetail } = data

            const upFollowNc: UploadFollowNc = {
                followNc,
                followDetail,
                followedAt: firebase.firestore.FieldValue.serverTimestamp(),
            }

            if (followNc === 'Found fix') {
                await ncNotifyRef.doc(ncId).update({
                    ncStatus : 'รอปิด',
                    follow : upFollowNc
                })

                setLoading(false)
                return true 
            } 

            if (followNc === 'Can not fix') {
                await ncNotifyRef.doc(ncId).update({
                    ncStatus : 'รอตอบ',
                    follow : upFollowNc
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

    const updateNcApprove = async (ncId: string, data: AddApproveNcData) => {
        try {
            setLoading(true)

            const { approveNc, approveDetail, qmrName } = data

            const upApproveNc: UploadApproveNc = {
                approveNc,
                approveDetail,
                qmrName,
                approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
            }

            if (approveNc === 'Yes') {
                await ncNotifyRef.doc(ncId).update({
                    ncStatus : 'ปิดแล้ว',
                    approve : upApproveNc
                })

                setLoading(false)
                return true 
            } 

            if (approveNc === 'No') {
                await ncNotifyRef.doc(ncId).update({
                    ncStatus : 'ไม่อนุมัติ',
                    approve : upApproveNc
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

    return {
        addNewNcNotify,
        setUploadProgression,
        updateNcFollow,
        updateNcApprove,
        uploadProgression, 
        addNcNotifyFinished, 
        loading, 
        error
    }
}