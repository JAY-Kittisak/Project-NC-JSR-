import React, { useState , useRef} from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'

import { MainLayout, InnerLayout, SpinnerStyled } from '../styles/LayoutStyle'
import Title from '../components/Title'
import Spinner from '../components/Spinner'
import { useQueryIqa } from '../hooks/useQueryIqa'
import { useQueryIqaAnswer } from '../hooks/useQueryIqaAnswer'
import { useAuthContext } from '../state/auth-context'
import IqaDetail from '../components/iqa/IqaDetail'
import ManageIqaAnswer from '../components/iqa/ManageIqaAnswer'
import IqaFollow from '../components/iqa/IqaFollow'
import IqaApprove from '../components/iqa/IqaApprove'
import { AlertNt, AlertType } from '../types'
import AlertNotification from '../components/dialogs/AlertNotification'
import IqaPrint from '../components/iqa/IqaPrint'
import EditIqa from '../components/iqa/EditIqa'

interface Props { }

const IqAuditDetail: React.FC<Props> = () => {
    const [alertWarning, setAlertWarning] = useState<AlertNt>('hide');
    const [alertState, setAlertState] = useState<AlertType>('success');
    const [openIqaForm, setOpenIqaForm] = useState(false)

    const params = useParams<{ id: string }>()

    const { authState: { userInfo } } = useAuthContext()
    const { iqa, loading, error } = useQueryIqa(params.id)
    const { iqaAnswer, error: answerError } = useQueryIqaAnswer(params.id)

    const labelRef = useRef<HTMLDivElement>(null)

    const printNcDetail = useReactToPrint({
        content: () => labelRef.current,
        documentTitle: `${iqa?.code}`
    })

    const approveEdit = () => {
        if (iqa?.branch === userInfo?.branch) {
            if (iqa?.dept === userInfo?.dept) {
                if ((iqa?.iqaStatus === 'รอตอบ') || (iqa?.iqaStatus === 'ไม่อนุมัติ')) {
                    return false
                }
            }
        }
        
        return true
    }

    if (loading) return (
        <SpinnerStyled>
            <div className="typography">
                <Spinner color='gray' height={50} width={50} /> <span>Loading... </span>
            </div>
        </SpinnerStyled>
    )

    if (error) return <h2 className='header--center'>{error}</h2>

    if (!iqa || !userInfo) return <h2 className='header--center'>Error Non Conformance Detail</h2>

    return (
        <MainLayout>
            <AlertNotification
                alertWarning={alertWarning}
                setAlertWarning={setAlertWarning}
                alert={alertState}
            />
            <Title title={'IQA Detail'} span={'IQA Detail'} />
            <IqAuditDetailStyled>
                <InnerLayout className='iqa-detail-section'>

                    <IqaDetail
                        iqa={iqa}
                        userInfo={userInfo}
                        answerDateAt={iqaAnswer?.createdAt}
                        setAlertWarning={setAlertWarning}
                        setAlertState={setAlertState}
                        setOpenIqaForm={setOpenIqaForm}
                        printNcDetail={printNcDetail}
                    />

                    <section>
                        <ManageIqaAnswer
                            iqaId={params.id}
                            iqaAnswer={iqaAnswer}
                            iqaStatus={iqa.iqaStatus}
                            approveEdit={approveEdit()}
                            setAlertWarning={setAlertWarning}
                            setAlertState={setAlertState}
                        />
                        {answerError && <p className='paragraph-error'>!!Query Error IQA Answer : {answerError}</p>}
                    </section>

                    <IqaFollow
                        iqaId={params.id}
                        follow={iqa.follow}
                        iqaStatus={iqa.iqaStatus}
                        creatorId={iqa.creator.id}
                        setAlertWarning={setAlertWarning}
                        setAlertState={setAlertState}
                    />

                    <IqaApprove 
                        iqaId={params.id}
                        approve={iqa.approve}
                        iqaStatus={iqa.iqaStatus}
                        setAlertWarning={setAlertWarning}
                        setAlertState={setAlertState}
                    />

                </InnerLayout>
            </IqAuditDetailStyled>

            {(iqaAnswer && iqa.iqaStatus === 'ปิดแล้ว') && (
                <PrintStyled>
                    <IqaPrint
                        labelRef={labelRef}
                        iqaDetail={iqa}
                        iqaAnswer={iqaAnswer}
                    />
                </PrintStyled>
            )}
            {openIqaForm && <EditIqa iqa={iqa} setOpenIqaForm={setOpenIqaForm} />}
        </MainLayout>
    )
}

const PrintStyled = styled.div`
    display: none;
`

const IqAuditDetailStyled = styled.div`
    .iqa-detail-section {
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

    .grid-two {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 2rem;
        @media screen and (max-width:800px){
            grid-template-columns: repeat(1, 1fr);
        }
    }

    .box-shadows {
        border: 2px solid var(--border-color);
        padding: 0px 20px 20px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 10px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    }

    .flex-iqa {
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
        select{
            border: 1px solid var(--border-color);
            outline: none;
            height: 40px;
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
    
    h4 {
        color: var(--white-color);
        font-size: 1.4rem;
        margin: 16px 0;
        border-left: 5px solid #e74c3c;
        padding-left: 16px;
    }
    
`
export default IqAuditDetail