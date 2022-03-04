import { DemoNcrNotify } from "../../types";

export const demoNcr: DemoNcrNotify = [
    {
        id: '1',
        category: "NCR",
        code: "J-NCR01011",
        dept: "Engineer",
        topic: "เสนอราคางานซ่อมไม่ถูกต้อง",
        detail: "detail : NCRNON CONFORMANCE REPORT",
        status: "Issue"
    },
    {
        id: '2',
        category: "CCR",
        code: "J-CCR01012",
        dept: "Engineer",
        topic: "สินค้าของลูกค้าชำรุดจากการจัดเก็บภายในหน่วยงาน",
        detail: "detail : NCRNON CONFORMANCE REPORT",
        status: "รอตอบ"
    },
    {
        id: '3',
        category: "SCR",
        code: "J-SCR01013",
        dept: "Engineer",
        topic: "นำส่งเงินให้กับหน่วยงานที่เกี่ยวข้องล่าช้า",
        detail: "detail : NCRNON CONFORMANCE REPORT",
        status: "รอปิด"
    },
    {
        id: '4',
        category: "NCR",
        code: "J-NCR01014",
        dept: "Engineer",
        topic: "การจัดการทั่วไปมีปัญหา",
        detail: "detail : NCRNON CONFORMANCE REPORT",
        status: "ปิดแล้ว"
    },
]