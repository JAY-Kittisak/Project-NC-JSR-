import { firebase } from '../firebase/config'

export type AuthUser = firebase.User

export type SignUpData = {
    username: string
    email: string
    password: string
}

export type Provider = 'facebook' | 'google'
export type Role = 'SUPER_ADMIN' | 'CLIENT' | 'ADMIN'

export type Ncr = {
    index?: number
    title: string
    detail: string
}
export type Iqa = {
    index?: number
    title: string
    detail: string
}

export type Branch = 'ลาดกระบัง' | 'ชลบุรี'

export type SelectMonth = "เดือน" |
    "มกราคม" |
    "กุมภาพันธ์" |
    "มีนาคม" |
    "เมษายน" |
    "พฤษภาคม" |
    "มิถุนายน" |
    "กรกฎาคม" |
    "สิงหาคม" |
    "กันยายน" |
    "ตุลาคม" |
    "พฤศจิกายน" |
    "ธันวาคม"

export type UserInfo = {
    id: string
    username: string
    email: string
    role: Role
    branch: Branch
    dept: string
    createdAt: firebase.firestore.Timestamp
    imageUrl?: string
    ncr?: Ncr[]
    Iqa?: Iqa[]
    updateAt?: firebase.firestore.Timestamp
}

export type NcrTab = 'All' | StatusNc
export type StatusNc =
  | 'รอตอบ'
  | 'ตอบแล้ว'
  | 'รอปิด'
  | 'ไม่อนุมัติ'
  | 'ปิดแล้ว'
  | 'ยกเลิก'

export type DemoNcrNotify = {
    id: string;
    category: string;
    code: string;
    dept: string;
    topic: string;
    detail: string;
    status: string;
}[]

export type CatNc = 'NCR' | 'CCR' | 'SCR'
type TopicType = 'Product' | 'Process'
export type UserCreator = {
    id: string
    username: string
    dept: string
    email: string
}

export type EditedDoc = 'QP' | 'SD' | 'WI' | 'KM' | 'OPL' | 'Risk' | 'Kaizen' | 'อื่นๆ...'
export type NcAnswer = {
    id: string
    ncId: string
    answerName: string
    containmentAction: string
    containmentDueDate: string
    containmentName: string

    rootCause: string

    correctiveAction: string
    correctiveDueDate: string
    correctiveName: string

    editedDoc: EditedDoc[]
    docDetail?: string

    fileAnswerNcUrl?: string
    fileAnswerNcRef?: string
    fileAnswerNcName?: string
    createdAt: firebase.firestore.Timestamp
    updatedAt?: firebase.firestore.Timestamp
}

export type FoundFixNc = 'Found fix' | 'Can not fix'
export type FollowNc = {
    followNc: FoundFixNc
    followDetail?: string
    followedAt: firebase.firestore.Timestamp
}
export type Approve = 'Yes' | 'No'
export type ApproveNc = {
    approveNc: Approve
    approveDetail?: string
    qmrName: string
    approvedAt: firebase.firestore.Timestamp
}
export type NcrNotify = {
    id: string
    code: string
    category: CatNc
    dept: string
    topic: string
    topicType: TopicType
    detail: string
    fileNcUrl?: string
    fileNcRef?: string
    fileNcName?: string
    ncStatus: StatusNc
    branch: Branch
    creatorName: string
    creator: UserCreator
    follow?: FollowNc
    approve?: ApproveNc
    createdAt: firebase.firestore.Timestamp
    updatedAt?: firebase.firestore.Timestamp
}

// NC Notify type used to upload a document in firestore
export type UploadNcNotify = Omit<NcrNotify, 'id' | 'createdAt'> & {createdAt?: firebase.firestore.FieldValue}
export type UploadEditNcNotify = Omit<NcrNotify, 
    |'id'
    | 'code'
    | 'branch'
    | 'ncStatus'
    | 'creator'
    | 'createdAt'
    | 'updatedAt'
> & {updatedAt: firebase.firestore.FieldValue}
export type UploadFollowNc = Omit<FollowNc, 'followedAt'> & {followedAt: firebase.firestore.FieldValue}
export type UploadApproveNc = Omit<ApproveNc,'approvedAt'> & {approvedAt: firebase.firestore.FieldValue}

export type AddNcrNotifyData = Pick<
    NcrNotify, 
    | 'creatorName' 
    |'code' 
    | 'category' 
    | 'dept' 
    | 'topic' 
    | 'topicType' 
    | 'detail' 
    | 'fileNcName'
>

export type EditNcrNotifyData = Pick<
    NcrNotify, 
    | 'creatorName' 
    | 'category' 
    | 'dept' 
    | 'topic' 
    | 'topicType' 
    | 'detail' 
    | 'fileNcName'
>

export type AddFollowNcData = Pick<
    FollowNc,
    'followNc' | 'followDetail'
>

export type AddApproveNcData = Pick<
    ApproveNc,
    'approveNc' | 'approveDetail' | 'qmrName'
>

export type UploadAnswerNc = Omit<NcAnswer, 'id' | 'createdAt' | 'updatedAt'> & {
    createdAt?: firebase.firestore.FieldValue
    updatedAt?: firebase.firestore.FieldValue
}
export type AddAnswerNcData = Pick<
    NcAnswer,
    | 'answerName'
    | 'containmentAction' 
    | 'containmentDueDate' 
    | 'containmentName' 
    | 'rootCause'
    | 'correctiveAction'
    | 'correctiveDueDate'
    | 'correctiveName'
    | 'fileAnswerNcName'
    | 'editedDoc'
    | 'docDetail'
>

export type Department = {
    id: string
    dept: string,
    topic?: string[]
}

export type AddDepartment = Omit<Department, 'id' | 'topic'>
export type AddTopic = Pick<Department, 'topic'>

export type CountsCode = { counts: number }

export type AlertNt = "show" | "hide"

export type AlertType = 'success' | 'warning'

export type Nc = { [key in NcrTab]: NcrNotify[] }