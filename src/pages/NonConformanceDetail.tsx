import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useReactToPrint } from 'react-to-print'

import ManageNcAnswer from '../components/ncr/ManageNcAnswer'
import NcFollow from '../components/ncr/NcFollow'
import NcApprove from '../components/ncr/NcApprove'
import Spinner from '../components/Spinner'
import Title from '../components/Title'
import Button from '../components/Button'
import NcPrint from '../components/ncr/NcPrint'
import { formatDate } from '../helpers'
import { useQueryNc } from '../hooks/useQueryNc'
import { InnerLayout, MainLayout, SpinnerStyled } from '../styles/LayoutStyle'
import { StatusNc, AlertNt, AlertType} from '../types'
import { useQueryNcAnswer } from '../hooks/useQueryNcAnswer'
import AlertNotification from '../components/dialogs/AlertNotification'

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
    } else return 'var(--primary-color)'
}

const NonConformanceDetail: React.FC<Props> = () => {
    const [alertWarning, setAlertWarning] = useState<AlertNt>('hide');
    const [alertState, setAlertState] = useState<AlertType>('success');

    const params = useParams<{ id: string }>()

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

    if (!nc) return <h2 className='header--center'>Error Non Conformance Detail</h2>

    const {
        creatorName,
        code,
        createdAt,
        category,
        dept,
        email,
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
                        <div className='notify'>
                            <h4>รายงานสิ่งที่ไม่เป็นไปตามข้อกำหนด/ข้อบกพร่อง (NC Report)</h4>
                            <p className='flex-between'>
                                เลขที่ :<SpanStyled>{code}</SpanStyled>
                                <span>วันที่ :</span><SpanStyled>{formatDate(createdAt)}</SpanStyled>
                                <span>Type : </span><SpanStyled>{category}</SpanStyled>
                            </p>
                            <div className="form-field">
                                <label htmlFor="name">ชื่อ-นามสกุล ผู้ออก NC</label>
                                <input readOnly type="text" id="name" value={creatorName + ' แผนก ' + creator.dept} />
                            </div>
                            <div className='flex-between'>
                                <div className="form-field">
                                    <label htmlFor="name">ถึงแผนก</label>
                                    <input readOnly type="text" id="name" value={dept + ' อีเมล ' + email} />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="name">ประเภทของความไม่สอดคล้อง</label>
                                    <input readOnly type="text" id="name" value={topicType} />
                                </div>
                            </div>
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
                                    rows={3}
                                    name="detail"
                                    id="detail"
                                    value={detail}
                                />
                            </div>
                            <div className='flex-between'>
                                <div className='flex-between'>
                                    <p className='mar-right'>
                                        สถานะปัจจุบัน :<NcStatusStyled ncStatus={ncStatus}>
                                            {ncStatus}
                                        </NcStatusStyled>
                                    </p>
                                    {ncStatus === 'ปิดแล้ว' && <Button className='btn--orange' onClick={printNcDetail}>Print</Button>}
                                </div>
                                {fileNcUrl && (
                                    <div className="flex-end">
                                        <a
                                            href={fileNcUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            ไฟล์แนบ / เอกสารอ้างอิง
                                        </a>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                    
                    <div className="right-content">
                        <ManageNcAnswer
                            ncId={params.id}
                            ncAnswer={ncAnswer}
                            ncStatus={ncStatus}
                            ncToDept={dept}
                            setAlertWarning={setAlertWarning} 
                            setAlertState={setAlertState}
                        />
                        {queryError && <p className='paragraph-error'>!!Query Error NC Answer : {queryError.length}</p>}
                    </div>

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

        </MainLayout>

    )
}

const PrintStyled = styled.div`
    display: none;
`

const NcStatusStyled = styled.span`
    font-size: 1.2rem;
    color: ${(props: { ncStatus: StatusNc }) => getStatusColor(props.ncStatus)};
`

const NcDetailStyled = styled.div`
    .nc-detail-section {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 2rem;
        @media screen and (max-width:1310px){
            grid-template-columns: repeat(1, 1fr);
            .f-button{
                margin-bottom: 3rem;
            }
        }
    }
    
    .right-content{
        display: grid;
        grid-template-columns: repeat(1,1fr);
        @media screen and (max-width: 502px){
            width: 70%;
        }
    }
        
    .btn--orange {
        background-color: chocolate;
    }

    .btn--orange:hover {
        background-color: coral;
    }

    .notify {
        p {
            margin: 0.5rem;
        }

        span {
            margin-left: .5rem;
        }

        a {
            border-bottom: 3px solid var(--primary-color);
        }
    }

    .mar-right {
        margin-right: 13px;
    }

    .left-content {
        display: flex;
        justify-content: space-between;
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
    
    .follow {
        margin-top: 1rem;
        margin-bottom: .5rem;
        padding: 1rem;
        border: 2px solid var(--border-color);
        background-color: var(--background-dark-color);
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
            height: 50px;
            padding: 0 15px;
            width: 100%;
            color: inherit;
            box-shadow: none;
        }
        select{
            border: 1px solid var(--border-color);
            outline: none;
            height: 50px;
            padding: 0 15px 0px 15px;
            width: 100%;
            color: inherit;
            box-shadow: none;
            background-color: var(--background-dark-color);
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
const SpanStyled = styled.span`
    color: var(--white-color);
    border-bottom: 1px solid var(--border-color);
`
export default NonConformanceDetail