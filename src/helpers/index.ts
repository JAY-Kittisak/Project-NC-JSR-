import {
    NcrTab, 
    Role, 
    CatNc, 
    Branch, 
    SelectMonth, 
    StatusNc, 
    Requirements, 
    EditedDoc, 
    EditedRootDoc,
    DeptJsrCounts,
    DeptCdcCounts
} from "../types";
import { firebase } from '../firebase/config'

export const isAdmin = (role: Role | null) => role === 'ADMIN' || role === 'SUPER_ADMIN'
export const isClient = (role: Role | null) => role === 'CLIENT'

export const branchSelect: Branch[] = ['ลาดกระบัง', 'ชลบุรี']

export const fileType = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']

export const selectMonth: SelectMonth[] = [
    "เดือน",
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม"
]

export const formatDate = (value: firebase.firestore.Timestamp) => {
    const date = value.toDate()
    const dd = date.getDate()
    const mm = date.getMonth()
    const yy = date.getFullYear()
    return `${dd} ${selectMonth[mm + 1]} ${yy}`;
}

export const sumNewDate = (value: firebase.firestore.Timestamp) => {
    const date = value.toDate()
    date.setDate(date.getDate() + 7)

    return date < new Date()
}

export const formatAddDate = (value: firebase.firestore.Timestamp) => {
    const date = value.toDate()
    date.setDate(date.getDate() + 7)

    const dd = date.getDate()
    const mm = date.getMonth()
    return `${dd} ${selectMonth[mm + 1]}`
}

export const diffDay = (
    value1: firebase.firestore.Timestamp,
    value2: firebase.firestore.Timestamp
) => {
    const date1 = value1.toDate().valueOf();
    const date2 = value2.toDate().valueOf();
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays
}

export const orderTabs: NcrTab[] = [
    'รอตอบ',
    'ตอบแล้ว',
    'รอปิด',
    'ไม่อนุมัติ',
    'ปิดแล้ว',
    'ยกเลิก',
    'All',
]

export const categories: CatNc[] = ['NCR', 'CCR', 'SCR']
export const selectStatusNC: StatusNc[] = ['รอตอบ', 'ตอบแล้ว', 'รอปิด', 'ไม่อนุมัติ', 'ปิดแล้ว', 'ยกเลิก']
export const selectEditedDoc: EditedDoc[] = [
    'QP',
    'SD',
    'WI',
    'KM',
    'OPL',
    'Risk',
    'Kaizen',
    'อื่นๆ...',
]
export const selectRootDoc: EditedRootDoc[] = [
    'ด้านเอกสาร',
    'การไม่ปฏิบัติตามแผนงาน',
    'การประสานงาน/สื่อสาร',
    'อุปกรณ์/เครื่องมือ',
    'ความบกพร่องจากมาตรฐาน',
    'สาเหตุอื่นๆ',
]

export const calculateTotalPages = (totalItems: number, perPage: number) =>
    Math.ceil(totalItems / perPage)

// TODO: IQA
export const requirements: Requirements[] = [
    '4.1','4.2','4.3','4.4.1','4.4.2','5.1.1','5.1.2','5.2.1','5.2.2','5.3','6.1',
    '6.1.1','6.1.2','6.2.1','6.2.2','6.3','7.1.1','7.1.2','7.1.3','7.1.4','7.1.5.1',
    '7.1.5.2','7.1.6','7.2','7.3','7.4','7.5.1','7.5.2','7.5.3.1','7.5.3.2','8.1',
    '8.2.1','8.2.2','8.2.3.1','8.2.3.2','8.2.4','8.4.1','8.4.2','8.4.3','8.5.1',
    '8.5.2','8.5.3','8.5.4','8.5.5','8.5.6','8.6','8.7.1','8.7.2','9.1.1','9.1.2',
    '9.1.3','9.2.1','9.2.2','9.3.1','9.3.2','9.3.3','10.1','10.2.1','10.2.2','10.3',
]

export const selectTeams = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'
]

export function getStatusColor(value: StatusNc) {
    if (value === 'ตอบแล้ว') {
        return 'chocolate'
    } else if (value === 'รอปิด') {
        return '#ff5d94'
    } else if (value === 'ปิดแล้ว') {
        return '#0cbd0c'
    } else if (value === 'ไม่อนุมัติ') {
        return '#FF0505'
    } else if (value === 'ยกเลิก') {
        return '#7a05ff'
    } else return 'var(--primary-color)'
}

export const initialDeptJsr: DeptJsrCounts = {
    SC: [],
    QMR: [],
    PU: [],
    IV: [],
    MK: [],
    HR: [],
    EN: [],
    DL: [],
    AD: [],
    AC: [],
    SAYA: [],
    SARG: [],
    SAPJ: [],
    SAMO: [],
    SAAR: [],
}

export const initialDeptCdc: DeptCdcCounts = {
    SC: [],
    QMR: [],
    PU: [],
    IV: [],
    MK: [],
    HR: [],
    GA: [],
    EN: [],
    DL: [],
    AC: [],
    SACT: [],
    SAAR: [],
}