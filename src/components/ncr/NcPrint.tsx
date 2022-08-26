import React from 'react'
import styled from 'styled-components'

import ImagePath from '../../assets/svg/check-circle.svg'
import Logo from '../../assets/image/JSR-Logo-new-PNG.png'
import { NcrNotify, NcAnswer } from '../../types'
import { formatDate } from '../../helpers'

interface Props {
    labelRef: React.RefObject<HTMLDivElement>
    ncDetail: NcrNotify
    ncAnswer: NcAnswer
}

type HeightProps = {
    height: string
}

type WidthProps = {
    width: string
}

const NcPrint: React.FC<Props> = ({ labelRef, ncDetail, ncAnswer }) => {
    const {
        creatorName,
        signature,
        code,
        createdAt,
        category,
        dept,
        topic,
        detail,
        topicType,
        creator,
        follow,
        approve,
        branch
    } = ncDetail

    const {
        containmentAction,
        containmentDueDate,
        containmentName,
        rootCause,
        correctiveAction,
        correctiveDueDate,
        correctiveName,
        editedDoc,
        docDetail,
        answerName,
        signature: signatureAnswer,
        createdAt: answerAt
    } = ncAnswer

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
                        <p>ประเภท {category}</p>
                        <p>เลขที่ {code}</p>
                        <p>วันที่ {formatDate(createdAt)}</p>
                    </div>
                </div>

                <p className='header'>รายงานสิ่งที่ไม่เป็นไปตามข้อกำหนด/ข้อบกพร่อง (NC Report)</p>

                <div className='issuer'>
                    <div className='title-nc'>
                        <p className='textAlignVer'>ผู้ออกเอกสาร</p>
                    </div>
                    <WidthStyled width='100%'>
                        <div className='flex-half'>
                            <p>
                                <span className='title'>จาก : </span> {creatorName}
                                <span className='title'>&nbsp;แผนก : </span> {creator.dept}
                            </p>
                            <p>
                                <span className='title'>ถึงแผนก : </span>{dept}
                            </p>
                        </div>
                            <p><span className='title'>ประเภทความไม่สอดคล้อง: </span>{topicType}</p>
                        <p><span className='title'>ประเด็นความไม่สอดคล้อง: </span>{topic}</p>
                        <div className='min-h'>
                            <p><span className='title'>รายละเอียดความไม่สอดคล้อง/ข้อบกพร่อง(Detail of Nonconforming): </span></p>
                            <p className='content'>{detail}</p>
                        </div>
                    </WidthStyled>
                </div>

                <div className='issuer'>
                    <div className='title-nc'>
                        <p className='textAlignVer'>ผู้รับผิดชอบการแก้ไข</p>
                    </div>
                    <div className='content-answer'>
                        <section>
                            <WidthStyled width='75%'>
                                <p>
                                    <span className='title'>การแก้ไขเบื้องต้น(Containment Action)</span>
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
                                    <p>กำหนดเสร็จ</p>
                                </div>
                            </TwentyFive>
                        </section>
                        <section>
                            <WidthStyled width='100%'>
                                <p>
                                    <span className='title'>สาเหตุของปัญหา(Root Cause)(วิเคราะห์ปัญหาโดยหลักการ 5 Why, แผนภูมิก้างปลา ฯลฯ)</span>
                                </p>
                                <p className='content'>{rootCause}</p>
                            </WidthStyled>
                        </section>
                        <section>
                            <WidthStyled width='75%'>
                                <p>
                                    <span className='title'>การแก้ไขปัญหา และการป้องกัน(Corrective Action)</span>
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
                                    <p>กำหนดเสร็จ</p>
                                </div>
                            </TwentyFive>
                        </section>
                        <div className='flex-edited-doc'>
                            <WidthStyled width='75%'>
                                <p>
                                    <span className='title'>เอกสารที่ต้องปรับปรุงแก้ไขเบื้องต้น</span>
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
                                        <span className='title'>เลขที่เอกสาร/เอกสารอื่นๆ(หากมี)</span>
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
                                    {signatureAnswer && <SignatureImage src={signatureAnswer} alt="signatureAnswer" />}
                                    <p>{answerName}</p>
                                    <p>ผู้ตอบ NC</p>
                                    <p>{formatDate(answerAt)}</p>
                                </div>
                            </TwentyFive>
                        </div>
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
                                        <label htmlFor='พบการแก้ไขเชิงระบบ'>พบการแก้ไขเชิงระบบ</label>
                                    </div>
                                </div>
                                <div className='min-h'>
                                    <p>
                                        <span className='title'>ข้อเสนอแนะเพิ่มเติม</span>
                                    </p>
                                    <p className='content'>
                                        {follow?.followDetail}
                                    </p>
                                </div>
                            </WidthStyled>
                            <TwentyFive height='100%'>
                                <div>
                                    {signature && <SignatureImage src={signature} alt="signature" />}
                                    <p>{creatorName}</p>
                                    <p>ผู้ออก NC</p>
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
                                        <span className='title'>ข้อเสนอแนะเพิ่มเติม</span>
                                    </p>
                                    <p className='content'>
                                        {approve?.approveDetail}
                                    </p>
                                </div>
                            </WidthStyled>
                            <TwentyFive height='100%'>
                                <div>
                                    {approve?.signature && <SignatureImage src={approve.signature} alt="signature" />}
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
            <NumForm className='flex-end'><p>FE-MR-MR-01 Rev.01 (Date. 14/03/2022)</p></NumForm>
        </div>
    )
}

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

    h5 {
        font-size: 1.2rem;
        padding-right: 1rem;
    }

    .title {
        font-size: 10pt;
        font-weight : 600;
    }

    .content {
        text-indent: 1.5em;
        font-size: 10pt;
    }

    .header-left {
        border-right: 1px solid;
        width: 70%;

        img {
            padding: 10px;
            width: 90px;
        }
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

    .min-h {
        min-height: 5rem;
    }

    .group {
        padding: 0px 20px;
        margin: 8px;
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

const SignatureImage = styled.img`
    height: 60px;
    width: 99%;
    object-fit: cover;
`

export default NcPrint