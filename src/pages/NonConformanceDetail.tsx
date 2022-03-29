import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useReactToPrint } from 'react-to-print'
import EditIcon from "@material-ui/icons/EditOutlined";
import PrintRoundedIcon from "@material-ui/icons/PrintRounded";

import ManageNcAnswer from '../components/ncr/ManageNcAnswer'
import NcFollow from '../components/ncr/NcFollow'
import NcApprove from '../components/ncr/NcApprove'
import NcPrint from '../components/ncr/NcPrint'
import EditNc from '../components/ncr/EditNc'
import UpdateNcStatus from '../components/ncr/UpdateNcStatus'
import Spinner from '../components/Spinner'
import Title from '../components/Title'
import Button from '../components/Button'
import AlertNotification from '../components/dialogs/AlertNotification'
import { useAuthContext } from '../state/auth-context'
import { useQueryNc } from '../hooks/useQueryNc'
import { useQueryNcAnswer } from '../hooks/useQueryNcAnswer'
import { InnerLayout, MainLayout, SpinnerStyled } from '../styles/LayoutStyle'
import { StatusNc, AlertNt, AlertType } from '../types'
import { formatDate, diffDay, isAdmin } from '../helpers'

interface Props { }

function getStatusColor(value: StatusNc) {
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

const NonConformanceDetail: React.FC<Props> = () => {
    const [alertWarning, setAlertWarning] = useState<AlertNt>('hide');
    const [alertState, setAlertState] = useState<AlertType>('success');
    const [openNcForm, setOpenNcForm] = useState(false)

    const params = useParams<{ id: string }>()

    const { authState: { userInfo } } = useAuthContext()
    const { nc, loading, error } = useQueryNc(params.id)
    const { ncAnswer, error: queryError } = useQueryNcAnswer(params.id)

    const labelRef = useRef<HTMLDivElement>(null)

    const printNcDetail = useReactToPrint({
        content: () => labelRef.current,
        documentTitle: `${nc?.code}`
    })

    if (loading) return (
        <SpinnerStyled>
            <div className="typography">
                <Spinner color='gray' height={50} width={50} /> <span>Loading... </span>
            </div>
        </SpinnerStyled>
    )

    if (error) return <h2 className='header--center'>{error}</h2>

    if (!nc || !userInfo) return <h2 className='header--center'>Error Non Conformance Detail</h2>

    const {
        creatorName,
        code,
        createdAt,
        category,
        dept,
        topic,
        detail,
        topicType,
        fileNcUrl,
        creator,
        ncStatus,
        follow,
        approve,
    } = nc

    return (
        <MainLayout>
            <AlertNotification
                alertWarning={alertWarning}
                setAlertWarning={setAlertWarning}
                alert={alertState}
            />
            <Title title={'NCR Detail'} span={'NCR Detail'} />
            <NcDetailStyled>
                <InnerLayout className='nc-detail-section' >
                    <div className="left-content">
                        <h4>รายงานสิ่งที่ไม่เป็นไปตามข้อกำหนด/ข้อบกพร่อง</h4>

                        <FlexStyled>
                            <div>
                                <p><span>ประเภท : </span></p>
                                <p>{category}</p>
                            </div>
                            <div>
                                <p><span>เลขที่ :</span></p>
                                <p>{code}</p>
                            </div>
                        </FlexStyled>
                        <FlexStyled>
                            <div>
                                <p><span> วันที่ :</span></p>
                                <p>{formatDate(createdAt)}</p>
                            </div>
                            <div>
                                <p><span>เอกสาร :</span></p>
                                {fileNcUrl ? (
                                    <a
                                        href={fileNcUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        ดูเอกสาร / ไฟล์แนบ
                                    </a>
                                ) : (
                                    <p>ไม่มีเอกสาร</p>
                                )}
                            </div>
                        </FlexStyled>
                        <FlexStyled>
                            <div>
                                {ncAnswer && (
                                    <>
                                        <p><span>ระยะเวลาในการตอบ : </span></p>
                                        <p style={{ color: diffDay(createdAt, ncAnswer.createdAt) > 7 ? 'red' : undefined }}>
                                            {diffDay(createdAt, ncAnswer.createdAt)} วัน
                                        </p>
                                    </>
                                )}
                            </div>
                            <div>
                                <p><span>สถานะ :</span></p>
                                {isAdmin(userInfo.role) ? (
                                    <UpdateNcStatus
                                        ncId={nc.id} 
                                        ncStatus={ncStatus}
                                        setAlertWarning={setAlertWarning}
                                        setAlertState={setAlertState}
                                    />
                                ) : (
                                    <NcStatusStyled ncStatus={ncStatus}>
                                        {ncStatus}
                                    </NcStatusStyled>
                                )}
                            </div>
                        </FlexStyled>
                        <div className="form-field">
                            <label htmlFor="name">ชื่อ-นามสกุล ผู้ออก NC</label>
                            <input readOnly type="text" id="name" value={creatorName + ' แผนก ' + creator.dept} />
                        </div>
                        <GridStyled>
                            <div className="form-field">
                                <label htmlFor="name">ถึงแผนก</label>
                                <input readOnly type="text" id="name" value={dept} />
                            </div>
                            <div className="form-field">
                                <label htmlFor="name">ประเภทของความไม่สอดคล้อง</label>
                                <input readOnly type="text" id="name" value={topicType} />
                            </div>
                        </GridStyled>
                        <div className="form-field">
                            <label htmlFor="name">ประเด็นความไม่สอดคล้อง</label>
                            <input readOnly type="text" id="name" value={topic} />
                        </div>
                        <div className="form-field">
                            <label htmlFor="name">
                                รายละเอียดความไม่สอดคล้อง
                            </label>
                            <textarea
                                readOnly
                                cols={30}
                                rows={5}
                                name="detail"
                                value={detail}
                            />
                        </div>
                        <br />
                        <div className='flex-center'>
                            {ncStatus === 'ปิดแล้ว' && (
                                <Button className='btn--orange' onClick={printNcDetail}>
                                    <span><PrintRoundedIcon /> Print</span>
                                </Button>
                            )}

                            {(userInfo.dept === 'SC') && (!ncAnswer) && (ncStatus === 'รอตอบ') && (
                                <Button className='btn--darkcyan' onClick={() => setOpenNcForm(true)}>
                                    <span><EditIcon /> แก้ไข NC</span>
                                </Button>
                            )}
                        </div>
                    </div>
                    <section>
                        <ManageNcAnswer
                            ncId={params.id}
                            ncAnswer={ncAnswer}
                            ncStatus={ncStatus}
                            ncToDept={dept}
                            setAlertWarning={setAlertWarning}
                            setAlertState={setAlertState}
                        />
                        {queryError && <p className='paragraph-error'>!!Query Error NC Answer : {queryError.length}</p>}
                    </section>

                    <NcFollow
                        ncId={params.id}
                        follow={follow}
                        ncStatus={ncStatus}
                        creatorId={creator.id}
                        setAlertWarning={setAlertWarning}
                        setAlertState={setAlertState}
                    />

                    <NcApprove
                        ncId={params.id}
                        approve={approve}
                        ncStatus={ncStatus}
                        setAlertWarning={setAlertWarning}
                        setAlertState={setAlertState}
                    />

                </InnerLayout>
            </NcDetailStyled>

            {(ncAnswer && ncStatus === 'ปิดแล้ว') && (
                <PrintStyled>
                    <NcPrint
                        labelRef={labelRef}
                        ncDetail={nc}
                        ncAnswer={ncAnswer}
                    />
                </PrintStyled>
            )}
            {openNcForm && <EditNc nc={nc} setOpenNcForm={setOpenNcForm} />}
        </MainLayout>
    )
}

const FlexStyled = styled.div`
    display: flex;
    justify-content: space-between;

    p span {
        margin: 0.5rem;
        font-size: 1.2rem;
    }
    
    a {
        border-bottom: 1px solid var(--border-color);
    }

    a:hover {
        font-weight: 600;
        color: var(--primary-color);
    }

    div {
        margin: 0.5rem 0.5rem 0rem 0.5rem;
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`

const PrintStyled = styled.div`
    display: none;
`

const NcStatusStyled = styled.span`
    font-size: 1.2rem;
    color: ${(props: { ncStatus: StatusNc }) => getStatusColor(props.ncStatus)};
`

const GridStyled = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 2rem;
    @media screen and (max-width:1800px){
        grid-template-columns: repeat(1, 1fr);
    }
`

const NcDetailStyled = styled.div`
    .nc-detail-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 2rem;
        @media screen and (max-width:1350px){
            grid-template-columns: repeat(1, 1fr);
            .f-button{
                margin-bottom: 3rem;
            }
        }
    }

    .paragraph-end {
        display: flex;
        flex-direction: row;
        align-items: end;
        justify-content: space-between;
        @media screen and (max-width:1800px){
            flex-direction: column;
        }
    }
        
    .btn--orange {
        background-color: chocolate;
        
        svg {
            margin-bottom: -5px;
        }
    }

    .btn--orange:hover {
        background-color: coral;
    }
        
    .btn--darkcyan {
        background-color: #008B8B;

        svg {
            margin-bottom: -5px;
        }
    }

    .btn--darkcyan:hover {
        background-color: #055a5a;
                
    }

    .mar-right {
        margin-right: 13px;
    }

    .left-content {
        display: flex;
        flex-direction: column;
        background-color: var(--background-dark-color);
    }
    
    h4 {
        color: var(--white-color);
        font-size: 1.4rem;
        margin: 16px 0;
        border-left: 5px solid #e74c3c;
        padding-left: 16px;
    }

    .form-field{
        margin-top: 2rem;
        position: relative;
        width: 100%;
        label{
            position: absolute;
            left: 20px;
            top: -17px;
            display: inline-block;
            background-color: var(--background-dark-color);
            padding: 0 .5rem;
            font-size: 1.2rem;
            color: inherit;
        }
        input{
            border: 1px solid var(--border-color);
            outline: none;
            background: transparent;
            height: 40px;
            padding: 0 15px;
            width: 100%;
            color: inherit;
            box-shadow: none;
        }
        textarea{
            background-color: transparent;
            border: 1px solid var(--border-color);
            outline: none;
            color: inherit;
            width: 100%;
            padding: .8rem 1rem;
        }
    }
`

export default NonConformanceDetail