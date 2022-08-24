import { useState } from 'react'

import { useAsyncCall } from './useAsyncCall'
import { createFileSignatureRef, usersRef } from '../firebase'
import { firebase } from '../firebase/config'
import { Personnel, UserInfo, PersonnelInput } from '../types'

export const useManagePersonnel = () => {
    const [uploadProgression, setUploadProgression] = useState(0)
    const [addFinished, setAddFinished] = useState(false)
    const [editFinished, setEditFinished] = useState(false)

    const { loading, setLoading, error, setError } = useAsyncCall()

    const uploadImageToStorage = (
        image: File,
        cb: (
            imageUrl: string,
            imagePath: string
        ) => void
    ) => {
        setLoading(true)

        const imageRef = createFileSignatureRef(image.name)
        const uploadTask = imageRef.put(image)

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Calculate upload progression
                const progression =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100

                setUploadProgression(progression)
            },
            (err) => {
                // Error case
                setError(err.message)
                setLoading(false)
            },
            () => {
                // Sucess case

                // Get the image url
                uploadTask.snapshot.ref
                    .getDownloadURL()
                    .then((imageUrl) => {
                        // CallBack to addPersonnel
                        cb(imageUrl, imageRef.fullPath)
                    })
                    .catch((err) => {
                        const { message } = err as { message: string }

                        setError(message)
                        setLoading(false)
                    })
            }
        )
    }

    const addPersonnel = (
        data: PersonnelInput,
        userInfo: UserInfo
    ) => (
        imageUrl: string,
        imagePath: string
    ) => {
            const { personnelName, imageFileName } = data
            setLoading(true)
            setAddFinished(false)

            const personnelData: Omit<Personnel, 'index'> = {
                personnelName,
                imageUrl,
                imageRef: imagePath,
                imageFileName
            }

            const updatedUserInfo = {
                personnel: userInfo.personnel
                    ? [...userInfo.personnel, personnelData]
                    : [personnelData],
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            }

            usersRef
                .doc(userInfo.id)
                .set(updatedUserInfo, { merge: true })
                .then(() => {
                    setAddFinished(true)
                    setLoading(false)
                }).catch((err) => {
                    const { message } = err as { message: string }

                    setError(message)
                    setLoading(false)
                })
        }

    const editPersonnel = (
        data: PersonnelInput,
        index: number,
        userInfo: UserInfo
    ) => (
        imageUrl: string,
        imagePath: string
    ) => {
            const { personnelName, imageFileName } = data
            setLoading(true)
            setEditFinished(false)
            
            const personnelData: Omit<Personnel, 'index'> = {
                personnelName,
                imageUrl,
                imageRef: imagePath,
                imageFileName
            }

            if (!userInfo.personnel) {
                setError('Sorry cannot edit the personnel.')
                setLoading(false)
                return
            }

            // The current personnel array
            const currentPersonnel = userInfo.personnel

            // Update the personnel
            currentPersonnel[index] = personnelData

            // An updated user info
            const updatedUserInfo = {
                personnel: currentPersonnel,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            }

            // Update the user document in firestore
            usersRef
                .doc(userInfo.id)
                .set(updatedUserInfo, { merge: true })
                .then(() => {
                    setEditFinished(true)
                    setLoading(false)
                }).catch((err) => {
                    const { message } = err as { message: string }

                    setError(message)
                    setLoading(false)
                })
        }

    const deletePersonnel = async (index: number, userInfo: UserInfo) => {
        try {
            if (
                !userInfo.personnel ||
                userInfo.personnel.length === 0
            ) {
                setError('Sorry, something went wrong.')
                return false
            }

            setLoading(true)

            // An updated user info
            const updatedUserInfo = {
                personnel: userInfo.personnel.filter(
                    (_, i) => i !== index
                ),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            }

            // Update the user document in firestore
            await usersRef.doc(userInfo.id).set(updatedUserInfo, { merge: true })
            setLoading(false)

            return true
        } catch (err) {
            const { message } = err as { message: string }

            setError(message)
            setLoading(false)

            return false
        }
    }

    return {
        uploadImageToStorage,
        setUploadProgression,
        addPersonnel,
        editPersonnel,
        deletePersonnel,
        uploadProgression,
        addFinished,
        editFinished,
        loading,
        error
    }
}