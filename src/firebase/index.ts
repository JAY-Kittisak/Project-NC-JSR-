import { v4 as uuidV4 } from 'uuid'

import {
    Department,
    NcrNotify,
    UserInfo,
    NcAnswer,
    IqaType,
    IqaAnswer
} from '../types'
import { db, firebase, storageRef } from './config'

export const usersRef = db.collection('users')
export const userCountsRef = db.collection('user-counts')

export const departmentRef = db.collection('department')
export const departmentCdcRef = db.collection('department-cdc')

export const ncNotifyRef = db.collection('nc-notify')
export const ncAnswerRef = db.collection('nc-answer')
export const ncCountsRef = db.collection('nc-counts')
export const ncCountsCdcRef = db.collection('nc-counts-cdc')
export const ncCountsCodeRef = db.collection('nc-code-counts')
export const ncCountsCodeCdcRef = db.collection('nc-code-counts-cdc')
export const ncNotifyFileFolder = 'nc-notify'
export const ncAnswerFileFolder = 'nc-answer'

export const iqaRef = db.collection('iqa')
export const iqaAnswerRef = db.collection('iqa-answer')
export const iqaCountsRef = db.collection('iqa-counts')
export const iqaCountsCdcRef = db.collection('iqa-counts-cdc')
export const iqaCountsCodeRef = db.collection('iqa-code-counts')
export const iqaCountsCodeCdcRef = db.collection('iqa-code-counts-cdc')
export const iqaFileFolder = 'iqa'
export const signatureFileFolder = 'signature'
export const iqaAnswerFileFolder = 'iqa-answer'

export const snapshotToDoc = <T extends
    | UserInfo
    | NcrNotify
    | Department
    | NcAnswer 
    | IqaType 
    | IqaAnswer
>(
    doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
) => {
    const docData = doc.data() as T
    const docObject: T = {
        ...docData,
        id: doc.id,
    }

    return docObject
}

export const createFileRef = (fileName: string) => {
    const uuid = uuidV4()

    return storageRef.child(`${ncNotifyFileFolder}/${fileName}-${uuid}`)
}

export const createFileNcAnswerRef = (fileName: string) => {
    const uuid = uuidV4()

    return storageRef.child(`${ncAnswerFileFolder}/${fileName}-${uuid}`)
}

export const createFileIqaRef = (fileName: string) => {
    const uuid = uuidV4()

    return storageRef.child(`${iqaFileFolder}/${fileName}-${uuid}`)
}

export const createFileIqaAnswerRef = (fileName: string) => {
    const uuid = uuidV4()

    return storageRef.child(`${iqaAnswerFileFolder}/${fileName}-${uuid}`)
}

export const createFileSignatureRef = (fileName: string) => {
    const uuid = uuidV4()

    return storageRef.child(`${signatureFileFolder}/${fileName}-${uuid}`)
}