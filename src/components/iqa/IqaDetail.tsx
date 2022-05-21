import React, { useState } from 'react'
import styled from 'styled-components'
import EditIcon from "@material-ui/icons/EditOutlined";
import PrintRoundedIcon from "@material-ui/icons/PrintRounded";

import Button from '../Button'
import { formatDate, isAdmin, diffDay, getStatusColor } from '../../helpers'
import { IqaType, UserInfo, AlertNt, AlertType, StatusNc } from '../../types'
import { firebase } from '../../firebase/config'
import UpdateIqaStatus from './UpdateIqaStatus';

interface Props {
    iqa: IqaType
    userInfo: UserInfo
    answerDateAt: firebase.firestore.Timestamp | undefined
    setAlertWarning: React.Dispatch<React.SetStateAction<AlertNt>>
    setAlertState: React.Dispatch<React.SetStateAction<AlertType>>
    setOpenNcForm: React.Dispatch<React.SetStateAction<boolean>>
    printNcDetail: () => void
}

const IqaDetail: React.FC<Props> = ({ 
    iqa, 
    userInfo, 
    answerDateAt, 
    setAlertWarning,
    setAlertState, 
    setOpenNcForm,
    printNcDetail
}) => {
    const [isEditing, setIsEditing] = useState(false)

    const {
        id,
        code,
        inspector1,
        inspector2,
        inspector3,
        inspector4,
        team,
        category,
        round,
        toName,
        dept,
        checkedProcess,
        requirements,
        detail,
        iqaStatus,
        fileIqaUrl,
        creator,
        createdAt
    } = iqa

    return (
        <IqaDetailStyled className='box-shadows'>
            <div className='flex-between'>
                <h4>คำขอให้ปฏิบัติการแก้ไข</h4>
                <SvgStyled>
                    {isAdmin(userInfo.role) && <EditIcon onClick={() => setIsEditing(!isEditing)} />}
                </SvgStyled>
            </div>
            <div className='flex-iqa'>
                <div>
                    <p><span>ประเภท : </span></p>
                    <p>{category} ตรวจรอบที่ {round}</p>
                </div>
                <div>
                    <p><span>เลขที่ :</span></p>
                    <p>{code}</p>
                </div>
            </div>
            <div  className='flex-iqa'>
                <div>
                    <p><span> วันที่ :</span></p>
                    <p>{formatDate(createdAt)}</p>
                </div>
                <div>
                    <p><span>เอกสาร :</span></p>
                    {fileIqaUrl ? (
                        <a
                            href={fileIqaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ดูเอกสาร / ไฟล์แนบ
                        </a>
                    ) : (
                        <p>ไม่มีเอกสาร</p>
                    )}
                </div>
            </div>
            <div className='flex-iqa'>
                            <div>
                                {answerDateAt && (
                                    <>
                                        <p><span>ระยะเวลาในการตอบ : </span></p>
                                        <p style={{ color: diffDay(createdAt, answerDateAt) > 7 ? 'red' : undefined }}>
                                            {diffDay(createdAt, answerDateAt)} วัน
                                        </p>
                                    </>
                                )}
                            </div>
                            <div>
                                <p><span>สถานะ : </span></p>
                                {isEditing ? (
                                    <UpdateIqaStatus
                                        iqaId={id}
                                        iqaStatus={iqaStatus}
                                        setAlertWarning={setAlertWarning}
                                        setAlertState={setAlertState}
                                        setIsEditing={setIsEditing}
                                    />
                                ) : (
                                    <NcStatusStyled ncStatus={iqaStatus}>
                                        {iqaStatus}
                                    </NcStatusStyled>
                                )}
                            </div>
                        </div>
            <div className='grid-two'>
                <div className="form-field">
                    <label htmlFor="name">ชื่อผู้ตรวจ/พบ 1</label>
                    <input readOnly type="text" id="name" value={inspector1} />
                </div>
                {inspector2 && (
                    <div className="form-field">
                        <label htmlFor="name">ชื่อผู้ตรวจ/พบ 2</label>
                        <input readOnly type="text" id="name" value={inspector2} />
                    </div>
                )}
                {inspector3 && (
                    <div className="form-field">
                        <label htmlFor="name">ชื่อผู้ตรวจ/พบ 3</label>
                        <input readOnly type="text" id="name" value={inspector3} />
                    </div>
                )}
                {inspector4 && (
                    <div className="form-field">
                        <label htmlFor="name">ชื่อผู้ตรวจ/พบ 4</label>
                        <input readOnly type="text" id="name" value={inspector4} />
                    </div>
                )}
            </div>
            <div className="form-field">
                <label htmlFor="name">ทีม</label>
                <input readOnly type="text" id="name" value={team} />
            </div>
            <div className='grid-two'>
                <div className="form-field">
                    <label htmlFor="name">ถึง</label>
                    <input readOnly type="text" id="name" value={toName} />
                </div>
                <div className="form-field">
                    <label htmlFor="name">แผนก</label>
                    <input readOnly type="text" id="name" value={dept} />
                </div>
            </div>
            <div className='grid-two'>
                <div className="form-field">
                    <label htmlFor="name">กระบวนการถูกตรวจ</label>
                    <input readOnly type="text" id="name" value={checkedProcess} />
                </div>
                <div className="form-field">
                    <label htmlFor="name">ผิดข้อกำหนด ISO 9001 ข้อ</label>
                    <input readOnly type="text" id="name" value={requirements} />
                </div>
            </div>
            <div className="form-field">
                <label htmlFor="name">รายละเอียดข้อบกพร่อง</label>
                <textarea
                    readOnly
                    cols={30}
                    rows={7}
                    name="detail"
                    value={detail}
                />
            </div>
                        <div className='edit-nc flex-center'>
                            {iqaStatus === 'ปิดแล้ว' && (
                                <Button className='btn--orange' onClick={printNcDetail}>
                                    <span><PrintRoundedIcon /> Print</span>
                                </Button>
                            )}
                            {isEditing ? (
                                <Button className='btn--darkcyan' onClick={() => setOpenNcForm(true)}>
                                    <span><EditIcon /> แก้ไข</span>
                                </Button>
                            ) : (
                                ((creator.id === userInfo.id) && (answerDateAt === undefined)) && (
                                    <Button className='btn--darkcyan' onClick={() => setOpenNcForm(true)}>
                                        <span><EditIcon /> แก้ไข</span>
                                    </Button>
                                )
                            )}
                        </div>
        </IqaDetailStyled>
    )
}

const IqaDetailStyled = styled.div`
    display: flex;
    flex-direction: column;
    background-color: var(--background-dark-color);
`
const SvgStyled = styled.div`
    svg {
        cursor: pointer;
        background-color: #e74c3c;
        color: #fff;
        border-radius: 5px;
    }

    svg:hover {
        background-color: #ac1403;
    }
`
const NcStatusStyled = styled.section`
    font-size: 1.2rem;
    color: ${(props: { ncStatus: StatusNc }) => getStatusColor(props.ncStatus)};
`

export default IqaDetail