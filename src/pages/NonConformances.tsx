import React, {useState} from 'react'
import styled from 'styled-components'

import { MainLayout, InnerLayout } from '../styles/LayoutStyle'
import Title from '../components/Title'
import NcHistoryNotify from '../components/ncr/NcHistoryNotify'
import NcNotify from '../components/ncr/NcNotify'
import { UserInfo, AlertNt, AlertType } from '../types'
import AlertNotification from '../components/dialogs/AlertNotification'

interface Props {
    user: UserInfo | null
}

const NonConformances: React.FC<Props> = ({ user }) => {
    const [alertWarning, setAlertWarning] = useState<AlertNt>('hide');
    const [alertState, setAlertState] = useState<AlertType>('success');

    return (
        <MainLayout>
            <AlertNotification
                alertWarning={alertWarning}
                setAlertWarning={setAlertWarning}
                alert={alertState}
            />
            <Title title={'NCR'} span={'Non Conformance Report'} />
            <NcStyled>
                <InnerLayout className='ncr-section'>
                    {user?.dept === 'null' ? (
                        <p className='paragraph-null'>User ของคุณยังไม่ได้รับการอนุมัติใช้งาน โปรดแจ้งผู้ดูแลระบบ</p>
                    ) : (
                        <>
                            <NcNotify 
                                user={user}
                                setAlertWarning={setAlertWarning} 
                                setAlertState={setAlertState}
                            />
                            <NcHistoryNotify historyTitle="ประวัติการออก NC" />
                        </>
                    )}

                    {/* <section className="right-content">
                    </section> */}
                </InnerLayout>
            </NcStyled>
        </MainLayout>
    )
}

const NcStyled = styled.div`
    .ncr-section{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 2rem;
        @media screen and (max-width:978px){
            grid-template-columns: repeat(1, 1fr);
            .f-button{
                margin-bottom: 3rem;
            }
        }
    }

    .paragraph-null {
        text-align: center;
        font-size: 1.4rem;
    }
`
export default NonConformances