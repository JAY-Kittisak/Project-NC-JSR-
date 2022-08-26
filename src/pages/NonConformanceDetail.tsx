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
import { useAuthContext } from '../state/auth-context'
import { useQueryNc } from '../hooks/useQueryNc'
import { useQueryNcAnswer } from '../hooks/useQueryNcAnswer'
import { InnerLayout, MainLayout, SpinnerStyled } from '../styles/LayoutStyle'
import { StatusProps } from '../types'
import { formatDate, diffDay, isAdmin, getStatusColor } from '../helpers'

interface Props { }

const NonConformanceDetail: React.FC<Props> = () => {
    const [openNcForm, setOpenNcForm] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

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
            <Title title={'NCR Detail'} span={'NCR Detail'} />
            <NcDetailStyled>
                <InnerLayout className='nc-detail-section' >
                    <div className="left-content box-shadows">
                        <div className='flex-between'>
                            <h4>รายงานสิ่งที่ไม่เป็นไปตามข้อกำหนด/ข้อบกพร่อง</h4>
                            <SvgStyled>
                                {isAdmin(userInfo.role) && <EditIcon onClick={() => setIsEditing(!isEditing)} />}
                            </SvgStyled>
                        </div>
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
                                <p><span>สถานะ : </span></p>
                                {isEditing ? (
                                    <UpdateNcStatus
                                        ncId={nc.id}
                                        ncStatus={ncStatus}
                                        setIsEditing={setIsEditing}
                                    />
                                ) : (
                                    <NcStatusStyled status={ncStatus}>
                                        <p>{ncStatus}</p>
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
                                rows={7}
                                name="detail"
                                value={detail}
                            />
                        </div>
                        <br />
                        <div className='edit-nc flex-center'>
                            {ncStatus === 'ปิดแล้ว' && (
                                <Button className='btn--orange' onClick={printNcDetail}>
                                    <span><PrintRoundedIcon /> Print</span>
                                </Button>
                            )}
                            {isEditing ? (
                                <Button className='btn--darkcyan' onClick={() => setOpenNcForm(true)}>
                                    <span><EditIcon /> แก้ไข</span>
                                </Button>
                            ) : (
                                (creator.id === userInfo.id) && (!ncAnswer) && (
                                    <Button className='btn--darkcyan' onClick={() => setOpenNcForm(true)}>
                                        <span><EditIcon /> แก้ไข</span>
                                    </Button>
                                )
                            )}
                        </div>
                    </div>
                    <section>
                        <ManageNcAnswer
                            ncId={params.id}
                            ncAnswer={ncAnswer}
                            ncStatus={ncStatus}
                            ncToDept={dept}
                            userInfo={userInfo}
                        />
                        {queryError && <p className='paragraph-error'>!!Query Error NC Answer : {queryError}</p>}
                    </section>

                    <NcFollow
                        ncId={params.id}
                        follow={follow}
                        ncStatus={ncStatus}
                        creatorId={creator.id}
                        userInfo={userInfo}
                    />

                    <NcApprove
                        ncId={params.id}
                        approve={approve}
                        ncStatus={ncStatus}
                        userInfo={userInfo}
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
            {openNcForm && <EditNc nc={nc} setOpenNcForm={setOpenNcForm} personnel={userInfo.personnel}/>}
        </MainLayout>
    )
}
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
const FlexStyled = styled.div`
    display: flex;
    justify-content: space-between;

    p span {
        margin: 0.5rem;
        font-size: 1.2rem;
    }
    
    a {
        border-bottom: 1px solid var(--primary-color);
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

const NcStatusStyled = styled.section`
    width: 100px;
    padding: 2px;
    border-radius: 30px;
    color: white;
    background-color: ${(props: StatusProps) => getStatusColor(props.status)};
    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);

    p {
        font-size: 1.2rem;
        text-align: center;
    }
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
        grid-column-gap: 1.5rem;
        grid-row-gap: 1.5rem;
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

    .edit-nc {
        button {
            margin: 10px;
        }
    }

    .box-shadows {
        border: 2px solid var(--border-color);
        padding: 0px 20px 20px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 10px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
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