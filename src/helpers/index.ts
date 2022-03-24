import { NcrTab, Role, CatNc, Branch, SelectMonth } from "../types";
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

export const orderTabs: NcrTab[] = [
    'รอตอบ',
    'ตอบแล้ว',
    'รอปิด',
    'ไม่อนุมัติ',
    'ปิดแล้ว',
    'All',
]

export const categories: CatNc[] = ['NCR', 'CCR', 'SCR']

export type AlertNotify = "show" | "hide"

export const calculateTotalPages = (totalItems: number, perPage: number) =>
  Math.ceil(totalItems / perPage)