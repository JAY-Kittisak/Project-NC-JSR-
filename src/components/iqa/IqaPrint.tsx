import React from 'react'
import styled from 'styled-components'

import { IqaAnswer, IqaType } from '../../types'

import ImagePath from '../../assets/svg/check-circle.svg'
import Logo from '../../assets/image/JSR-Logo-new-PNG.png'
import { formatDate } from '../../helpers'

interface Props {
    labelRef: React.RefObject<HTMLDivElement>
    iqaDetail: IqaType
    iqaAnswer: IqaAnswer
}

type HeightProps = {
    height: string
}

type WidthProps = {
    width: string
}

const IqaPrint: React.FC<Props> = ({ labelRef, iqaDetail, iqaAnswer }) => {
    const {
        branch,
        code,
        createdAt,
        toName,
        inspector1,
        inspector2,
        inspector3,
        inspector4,
        dept,
        checkedProcess,
        requirements,
        detail,
        follow,
        approve
    } = iqaDetail

    const {
        containmentAction,
        containmentName,
        containmentDueDate,
        editedRootDoc,
        rootCause,
        correctiveAction,
        correctiveName,
        correctiveDueDate,
        editedDoc,
        docDetail,
        answerName,
        createdAt: answerAt
    } = iqaAnswer

    return (
        <div ref={labelRef}>
            <NcPrintStyled>
                <div className="flex-between">
                    <div className='header-left flex-between'>
                        <img src={Logo} alt="logo" />
                        {branch === 'ลาดกระบัง' ? (
                            <h5>บริษัท จ.ศรีรุ่งเรืองอิมเป็กซ์ จำกัด</h5>
                        ) : (
                            <h5>บริษัท ศรีรุ่งเรืองแมชชีนแอนด์ทูลส์ จำกัด</h5>
                        )}
                    </div>
                    <div className='header-right'>
                        <p><TitleStyled>เลขที่ : </TitleStyled>{code}</p>
                        <p><TitleStyled>วันที่ตรวจ : </TitleStyled>{formatDate(createdAt)}</p>
                    </div>
                </div>

                <p className='header'>ใบคำขอให้ปฏิบัติการแก้ไข <span>(CORRECTIVE ACTION REQUEST)</span></p>

                <div className='issuer'>
                    <div className='title-nc'>
                        <p className='textAlignVer'>ผู้พบสิ่งผิดปกติ</p>
                    </div>
                    <WidthStyled width='100%'>
                        <div className='flex-half'>
                            <p>
                                <TitleStyled>ถึง : </TitleStyled> {toName}
                            </p>
                            <p>
                                <TitleStyled>แผนก : </TitleStyled>{dept}
                            </p>
                        </div>
                        <div className='flex-half'>
                            <p>
                                <TitleStyled>กระบวนการถูกตรวจ : </TitleStyled>{checkedProcess}
                            </p>
                            <p>
                                <TitleStyled>ผิดข้อกำหนด ISO 9001 ข้อที่ : </TitleStyled>{requirements}
                            </p>
                        </div>
                        <div className='flex-half'>
                            <p>
                                <TitleStyled>ผู้ตรวจ/พบ 1 : </TitleStyled>{inspector1}
                            </p>
                            {inspector2 && (
                                <p>
                                    <TitleStyled>2 : </TitleStyled>{inspector2}
                                </p>
                            )}
                        </div>
                        <div className='flex-half'>
                            {inspector3 && (
                                <p>
                                    <TitleStyled>3 : </TitleStyled>{inspector3}
                                </p>
                            )}
                            {inspector4 && (
                                <p>
                                    <TitleStyled>4 : </TitleStyled>{inspector4}
                                </p>
                            )}
                        </div>
                        <div className='min-h'>
                            <p><TitleStyled>รายละเอียดข้อบกพร่อง</TitleStyled></p>
                            <p className='content'>{detail}</p>
                        </div>
                    </WidthStyled>
                </div>

                <div className='issuer'>
                    <div className='title-nc'>
                        <p className='textAlignVer'>รายละเอียดการปฏิบัติการแก้ไข/ป้องกัน</p>
                    </div>
                    <div className='content-answer'>
                        <section>
                            <WidthStyled width='75%'>
                                <p>
                                    <TitleStyled>แนวทางแก้ไขเบื้องต้น</TitleStyled>
                                </p>
                                <p className='content'>{containmentAction}</p>
                            </WidthStyled>
                            <TwentyFive height='50%'>
                                <div>
                                    <p>
                                        {containmentName}
                                    </p>
                                    <p>ผู้รับผิดชอบ</p>
                                </div>
                                <div>
                                    <p>
                                        {containmentDueDate}
                                    </p>
                                    <p>กำหนดวันที่แก้ไขเบื้องต้นเสร็จ</p>
                                </div>
                            </TwentyFive>
                        </section>
                        <section>
                            <WidthStyled width='100%'>
                                <p>
                                    <TitleStyled>สาเหตุเกิดจาก</TitleStyled>
                                </p>
                                <div className="select-doc grid-group-root">
                                    <div className="group">
                                        <input
                                            type="checkbox"
                                            name="editedRootDoc"
                                            id='ด้านเอกสาร'
                                            value='ด้านเอกสาร'
                                            defaultChecked={editedRootDoc.includes('ด้านเอกสาร')}
                                        />
                                        <label htmlFor='ด้านเอกสาร'>ด้านเอกสาร</label>
                                    </div>
                                    <div className="group">
                                        <input
                                            type="checkbox"
                                            name="editedRootDoc"
                                            id='การไม่ปฏิบัติตามแผนงาน'
                                            value='การไม่ปฏิบัติตามแผนงาน'
                                            defaultChecked={editedRootDoc.includes('การไม่ปฏิบัติตามแผนงาน')}
                                        />
                                        <label htmlFor='การไม่ปฏิบัติตามแผนงาน'>การไม่ปฏิบัติตามแผนงาน</label>
                                    </div>
                                    <div className="group">
                                        <input
                                            type="checkbox"
                                            name="editedRootDoc"
                                            id='การประสานงาน/สื่อสาร'
                                            value='การประสานงาน/สื่อสาร'
                                            defaultChecked={editedRootDoc.includes('การประสานงาน/สื่อสาร')}
                                        />
                                        <label htmlFor='การประสานงาน/สื่อสาร'>การประสานงาน/สื่อสาร</label>
                                    </div>
                                    <div className="group">
                                        <input
                                            type="checkbox"
                                            name="editedRootDoc"
                                            id='อุปกรณ์/เครื่องมือ'
                                            value='อุปกรณ์/เครื่องมือ'
                                            defaultChecked={editedRootDoc.includes('อุปกรณ์/เครื่องมือ')}
                                        />
                                        <label htmlFor='อุปกรณ์/เครื่องมือ'>อุปกรณ์/เครื่องมือ</label>
                                    </div>
                                    <div className="group">
                                        <input
                                            type="checkbox"
                                            name="editedRootDoc"
                                            id='ความบกพร่องจากมาตรฐาน'
                                            value='ความบกพร่องจากมาตรฐาน'
                                            defaultChecked={editedRootDoc.includes('ความบกพร่องจากมาตรฐาน')}
                                        />
                                        <label htmlFor='ความบกพร่องจากมาตรฐาน'>ความบกพร่องจากมาตรฐาน</label>
                                    </div>
                                    <div className="group">
                                        <input
                                            type="checkbox"
                                            name="editedRootDoc"
                                            id='สาเหตุอื่นๆ'
                                            value='สาเหตุอื่นๆ'
                                            defaultChecked={editedRootDoc.includes('สาเหตุอื่นๆ')}
                                        />
                                        <label htmlFor='สาเหตุอื่นๆ'>สาเหตุอื่นๆ</label>
                                    </div>
                                </div>
                                <div className='min-h'>
                                    <p>
                                        <TitleStyled>รายละเอียดสาเหตุ</TitleStyled>
                                    </p>
                                    <p className='content'>{rootCause}</p>
                                </div>
                            </WidthStyled>
                        </section>
                        <section>
                            <WidthStyled width='75%'>
                                <p>
                                    <TitleStyled>แนวทางแก้ไข/ป้องกันไม่ให้เกิดซ้ำ</TitleStyled>
                                </p>
                                <p className='content'>{correctiveAction}</p>
                            </WidthStyled>
                            <TwentyFive height='50%'>
                                <div>
                                    <p>{correctiveName}</p>
                                    <p>ผู้รับผิดชอบ</p>
                                </div>
                                <div>
                                    <p>{correctiveDueDate}</p>
                                    <p>กำหนดวันที่แก้ไขป้องกันเสร็จ</p>
                                </div>
                            </TwentyFive>
                        </section>
                        <section className='flex-edited-doc'>
                            <WidthStyled width='75%'>
                                <p>
                                    <TitleStyled>เอกสารที่ต้องปรับปรุงแก้ไขเพิ่มเติม(หากมี)</TitleStyled>
                                </p>
                                <div className="select-doc grid-group">
                                    <div className="group">
                                        <input
                                            type="checkbox"
                                            name="editedDoc"
                                            id='QP'
                                            value='QP'
                                            defaultChecked={editedDoc.includes('QP')}
                                        />
                                        <label htmlFor='QP'>QP</label>
                                    </div>
                                    <div className="group">
                                        <input
                                            type="checkbox"
                                            name="editedDoc"
                                            id='SD'
                                            value='SD'
                                            defaultChecked={editedDoc.includes('SD')}
                                        />
                                        <label htmlFor='SD'>SD</label>
                                    </div>
                                    <div className="group">
                                        <input
                                            type="checkbox"
                                            name="editedDoc"
                                            id='WI'
                                            value='WI'
                                            defaultChecked={editedDoc.includes('WI')}
                                        />
                                        <label htmlFor='WI'>WI</label>
                                    </div>
                                    <div className="group">
                                        <input
                                            type="checkbox"
                                            name="editedDoc"
                                            id='KM'
                                            value='KM'
                                            defaultChecked={editedDoc.includes('KM')}
                                        />
                                        <label htmlFor='KM'>KM</label>
                                    </div>
                                    <div className="group">
                                        <input
                                            type="checkbox"
                                            name="editedDoc"
                                            id='OPL'
                                            value='OPL'
                                            defaultChecked={editedDoc.includes('OPL')}
                                        />
                                        <label htmlFor='OPL'>OPL</label>
                                    </div>
                                    <div className="group">
                                        <input
                                            type="checkbox"
                                            name="editedDoc"
                                            id='Risk'
                                            value='Risk'
                                            defaultChecked={editedDoc.includes('Risk')}
                                        />
                                        <label htmlFor='Risk'>Risk</label>
                                    </div>
                                    <div className="group">
                                        <input
                                            type="checkbox"
                                            name="editedDoc"
                                            id='Kaizen'
                                            value='Kaizen'
                                            defaultChecked={editedDoc.includes('Kaizen')}
                                        />
                                        <label htmlFor='Kaizen'>Kaizen</label>
                                    </div>
                                    <div className="group">
                                        <input
                                            type="checkbox"
                                            name="editedDoc"
                                            id='อื่นๆ...'
                                            value='อื่นๆ...'
                                            defaultChecked={editedDoc.includes('อื่นๆ...')}
                                        />
                                        <label htmlFor='อื่นๆ...'>อื่นๆ...</label>
                                    </div>
                                </div>
                                <div className='min-h'>
                                    <p>
                                        <TitleStyled>เลขที่เอกสาร/เอกสารอื่นๆ</TitleStyled>
                                    </p>
                                    {docDetail && (
                                        <p className='content'>
                                            {docDetail}
                                        </p>
                                    )}
                                </div>
                            </WidthStyled>
                            <TwentyFive height='100%'>
                                <div>
                                    <p>{answerName}</p>
                                    <p>ผู้ตอบ</p>
                                    <p>{formatDate(answerAt)}</p>
                                </div>
                            </TwentyFive>
                        </section>
                    </div>
                </div>

                <div className='issuer'>
                    <div className='title-nc'>
                        <p className='textAlignVer'>การติดตาม</p>
                    </div>
                    <div className='content-answer'>
                        <div className='flex-edited-doc'>
                            <WidthStyled width='75%'>
                                <div className="select-doc grid-only">
                                    <div className="group">
                                        <input
                                            type="checkbox"
                                            name="followNc"
                                            id='foundFix'
                                            value='foundFix'
                                            defaultChecked={true}
                                        />
                                        <label htmlFor='พบการแก้ไขเชิงระบบ'>การแก้ไขเรียบร้อย</label>
                                    </div>
                                </div>
                                <div className='min-h'>
                                    <p>
                                        <TitleStyled>ความเห็น Auditor</TitleStyled>
                                    </p>
                                    <p className='content'>
                                        {follow?.followDetail}
                                    </p>
                                </div>
                            </WidthStyled>
                            <TwentyFive height='100%'>
                                <div>
                                    <p>{inspector1}</p>
                                    <p>ผู้ตรวจติดตาม</p>
                                    {follow?.followedAt && (
                                        <p>{formatDate(follow?.followedAt)}</p>
                                    )}
                                </div>
                            </TwentyFive>
                        </div>
                    </div>
                </div>

                <div className='issuer'>
                    <div className='title-nc'>
                        <p className='textAlignVer'>QMR</p>
                    </div>
                    <div className='content-answer'>
                        <div className='flex-edited-doc'>
                            <WidthStyled width='75%'>
                                <div className="select-doc grid-only">
                                    <div className="group">
                                        <input
                                            type="checkbox"
                                            name="followNc"
                                            id='foundFix'
                                            value='foundFix'
                                            defaultChecked={true}
                                        />
                                        <label htmlFor='อนุมัติเพื่อปิดประเด็น'>อนุมัติเพื่อปิดประเด็น</label>
                                    </div>
                                </div>
                                <div className='min-h'>
                                    <p>
                                        <TitleStyled>ความเห็น QMR</TitleStyled>
                                    </p>
                                    <p className='content'>
                                        {approve?.approveDetail}
                                    </p>
                                </div>
                            </WidthStyled>
                            <TwentyFive height='100%'>
                                <div>
                                    <p>{approve?.qmrName}</p>
                                    <p >QMR</p>
                                    {approve?.approvedAt && (
                                        <p>{formatDate(approve?.approvedAt)}</p>
                                    )}
                                </div>
                            </TwentyFive>
                        </div>
                    </div>
                </div>
            </NcPrintStyled>
            <NumForm className='flex-end'><p>FE-MR-MR-02 Rev.00 (Date. 20/05/2022)</p></NumForm>
        </div>
    )
}

const TitleStyled = styled.span`
    font-size: 10pt;
    font-weight : 600;
`

const WidthStyled = styled.div`
    width: ${(props: WidthProps) => props.width};
    padding: 0px 10px 0px 10px;

    .flex-half {
        display: flex;

        p {
            width: 50%
        }
    }

    p {
        font-size: 10pt;
    }
`

const TwentyFive = styled.div`
    width: 25%;
    border-left: 1px solid;

    p {
        font-size: 10pt;
    }

    div {
        height: ${(props: HeightProps) => props.height};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: end;
        &:not(:last-child) {
            border-bottom: 1px solid;
        }
    }
`

const NumForm = styled.section`
    color: #3b3b3b;
    margin: 0rem 2rem 2rem 2rem;

    p {
        font-size: 10pt;
    }
`

const NcPrintStyled = styled.section`
    border: 1px solid;
    margin: 2rem 2rem 0rem 2rem;
    color: #000;

    img {
        padding: 10px;
        width: 90px;
    }

    h5 {
        font-size: 1.2rem;
        padding-right: 1rem;
    }

    .content {
        text-indent: 1.5em;
        font-size: 10pt;
    }

    .header-left {
        border-right: 1px solid;
        width: 70%;
    }

    .header-right {
        text-align:right;
        padding-right: 10px;
        p {
            font-size: 12pt;
        }
    }

    .header {
        border-top: 1px solid;
        text-align: center;

        span {
            font-size: 14px;
        }
    }

    .issuer {
        width: 100%;
        border-top: 1px solid;
        display: flex;
    }
   
    .title-nc {
        width: 5%;
        border-right: 1px solid;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .content-answer {
        width: 100%;

        section {
            display: flex;
            min-height: 5rem;
            &:not(:last-child) {
                border-bottom: 1px solid;
            }
        }
    }

    .flex-edited-doc {
        display: flex;
        min-height: 5rem;
    }

    .textAlignVer {
        transform: rotate(-90deg);
        white-space:nowrap;
        font-size: 12pt;
    }

    .grid-only {
        display: grid;
        grid-template-columns: repeat(1,1fr);
    }

    .grid-group {
        width: 50%;
        display: grid;
        grid-template-columns: repeat(4,1fr);
    }

    .grid-group-root {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3,1fr);

        label {
            font-size: 14px
        }
    }

    .min-h {
        min-height: 5rem;
    }

    .group {
        padding: 0px 20px;
        margin: 4px;
    }

    input[type="checkbox"] {
        display: none;
    }

    label {
        cursor: pointer;
        position: relative;
        font-size: 12pt;
    }

    label::before {
        content: "";
        border-radius: 50%;
        background-color: #fff;
        background-image: url(${ImagePath});
        background-position: center;
        background-size: contain;
        width: 25px;
        height: 25px;
        position: absolute;
        left: -29px;
        top: -2px;

        transform: scale(0) rotateZ(180deg);
        transition: all 0.4s cubic-bezier(0.54, 0.01, 0, 1.49);
    }

    input[type="checkbox"]:checked + label::before {
        transform: scale(1) rotateZ(0deg);
    }

    label::after {
        content: "";
        border: 2px solid #3b3b3b;
        width: 17px;
        height: 17px;
        position: absolute;
        left: -27px;
        top: 0px;
        border-radius: 50%;
    }
`

export default IqaPrint