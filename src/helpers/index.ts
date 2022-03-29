import { NcrTab, Role, CatNc, Branch, SelectMonth, StatusNc } from "../types";
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

export type AlertNotify = "show" | "hide"

export const calculateTotalPages = (totalItems: number, perPage: number) =>
    Math.ceil(totalItems / perPage)