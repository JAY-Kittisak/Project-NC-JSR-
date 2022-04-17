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

export type FoundFix = 'Found fix' | 'Can not fix'
export type FollowNc = {
    followNc: FoundFix
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
export type UploadNcNotify = Omit<NcrNotify, 'id' | 'createdAt'> & { createdAt?: firebase.firestore.FieldValue }
export type UploadEditNcNotify = Omit<NcrNotify,
    | 'id'
    | 'code'
    | 'branch'
    | 'ncStatus'
    | 'creator'
    | 'createdAt'
    | 'updatedAt'
> & { updatedAt: firebase.firestore.FieldValue }
export type UploadFollowNc = Omit<FollowNc, 'followedAt'> & { followedAt: firebase.firestore.FieldValue }
export type UploadApproveNc = Omit<ApproveNc, 'approvedAt'> & { approvedAt: firebase.firestore.FieldValue }

export type AddNcrNotifyData = Pick<
    NcrNotify,
    | 'creatorName'
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

// TODO: IQA
export type CatIqa = 'CAR' | 'OBS'
export type Team = 'A' | 'B' | 'C' | 'B'

export type Requirements =
    | '4.1' | '4.2' | '4.3' | '4.4.1' | '5.1.1' | '5.1.2' | '5.2.1' | '5.2.2' | '5.3' | '6.1'
    | '6.1.2' | '6.2.1' | '6.2.2' | '6.3' | '7.1.1' | '7.1.2' | '7.1.3' | '7.1.4' | '7.1.5.1'
    | '7.1.5.2' | '7.1.6' | '7.2' | '7.3' | '7.4' | '7.5.1' | '7.5.2' | '7.5.3.1' | '7.5.3.2'
    | '8.2.1' | '8.2.2' | '8.2.3.1' | '8.2.3.2' | '8.2.4' | '8.3' | '8.4' | '8.4.1' | '8.4.2'
    | '8.4.3' | '8.5.1' | '8.5.2' | '8.5.3' | '8.5.4' | '8.5.5' | '8.5.6' | '8.6' | '8.7.1'
    | '8.7.2' | '9.1.1' | '9.1.2' | '9.1.3' | '9.2.1' | '9.2.2' | '9.3.1' | '9.3.2' | '9.3.3'
    | '10.1' | '10.2.1' | '10.2.2' | '10.3'

export type FollowIqa = {
    followIqa: FoundFix
    followDetail?: string
    followedAt: firebase.firestore.Timestamp
}

export type ApproveIqa = {
    approveIqa: Approve
    approveDetail?: string
    qmrName: string
    approvedAt: firebase.firestore.Timestamp
}
export type IqaType = {
    id: string
    code: string
    category: CatIqa
    toName: string
    dept: string
    checkedProcess: string
    requirements: Requirements
    inspector1: string
    inspector2: string | null
    inspector3: string | null
    inspector4: string | null
    team: Team
    round: string
    detail: string
    fileIqaUrl?: string
    fileIqaRef?: string
    fileIqaName?: string
    iqaStatus: StatusNc
    branch: Branch
    creator: UserCreator
    follow?: FollowIqa
    approve?: ApproveIqa
    createdAt: firebase.firestore.Timestamp
    updatedAt?: firebase.firestore.Timestamp
}

export type AddIqaTypeData = Pick<
    IqaType,
    | 'inspector1'
    | 'inspector2'
    | 'inspector3'
    | 'inspector4'
    | 'team'
    | 'round'
    | 'category'
    | 'toName'
    | 'dept'
    | 'checkedProcess'
    | 'requirements'
    | 'detail'
    | 'fileIqaName'
>

export type UploadIqa = Omit<IqaType, 'id' | 'createdAt' | 'updatedAt'> & {
    createdAt?: firebase.firestore.FieldValue
    updatedAt?: firebase.firestore.FieldValue
}

export type IqaTabAll = { [key in NcrTab]: IqaType[] }

export type EditedRootDoc = 
    |"ด้านเอกสาร" 
    | "การไม่ปฏิบัติตามแผนงาน" 
    | "การประสานงาน/สื่อสาร"
    | "อุปกรณ์/เครื่องมือ"
    | "ความบกพร่องจากมาตรฐาน"
    | "อื่นๆ..."
export type IqaAnswer = {
    id: string
    iqaId: string
    answerName: string
    containmentAction: string
    containmentDueDate: string
    containmentName: string

    editedRootDoc: EditedRootDoc[]
    rootCause: string

    correctiveAction: string
    correctiveDueDate: string
    correctiveName: string

    editedDoc: EditedDoc[]
    docDetail?: string

    fileAnswerIqaUrl?: string
    fileAnswerIqaRef?: string
    fileAnswerIqaName?: string
    createdAt: firebase.firestore.Timestamp
    updatedAt?: firebase.firestore.Timestamp
}
export type AddAnswerIqaData = Pick<
    IqaAnswer,
    | 'answerName'
    | 'containmentAction'
    | 'containmentDueDate'
    | 'containmentName'
    | 'editedRootDoc'
    | 'rootCause'
    | 'correctiveAction'
    | 'correctiveDueDate'
    | 'correctiveName'
    | 'fileAnswerIqaName'
    | 'editedDoc'
    | 'docDetail'
>
export type UploadAnswerIqa = Omit<IqaAnswer, 'id' | 'createdAt' | 'updatedAt'> & {
    createdAt?: firebase.firestore.FieldValue
    updatedAt?: firebase.firestore.FieldValue
}
export type AddFollowIqaData = Pick<
    FollowIqa,
    'followIqa' | 'followDetail'
>
export type AddApproveIqaData = Pick<
    ApproveIqa,
    'approveIqa' | 'approveDetail' | 'qmrName'
>
export type UploadFollowIqa = Omit<FollowIqa, 'followedAt'> & { followedAt: firebase.firestore.FieldValue }
export type UploadApproveIqa = Omit<ApproveIqa, 'approvedAt'> & { approvedAt: firebase.firestore.FieldValue }

export type SidebarType = {
    title: string;
    path: string;
    iconClosed: JSX.Element;
    iconOpened: JSX.Element;
    subNav: {
        title: string;
        path: string;
    }[];
}

export type ChartColor = '#007bff' | '#0bce46'
export type ChartColorType = '#78b8fd' | '#6fcc8b'