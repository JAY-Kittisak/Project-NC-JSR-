import React from 'react'
import styled from 'styled-components'

import { MainLayout, InnerLayout } from '../styles/LayoutStyle'
import Title from '../components/Title'
import { useAuthContext } from '../state/auth-context'
import AddIqa from '../components/iqa/AddIqa'
import IqaHistory from '../components/iqa/IqaHistory'

interface Props { }

const IqAudit: React.FC<Props> = () => {
    const { authState: { userInfo } } = useAuthContext()

    return (
        <MainLayout>
            <Title title={'IQA'} span={'Internal Quality Audit'} />
            <IqAuditStyled>
                <InnerLayout className='iqa'>
                    {userInfo?.dept === 'null' ? (
                        <p className='paragraph-null'>User ของคุณยังไม่ได้รับการอนุมัติใช้งาน โปรดแจ้งผู้ดูแลระบบ</p>
                    ) : (
                        <>
                            <AddIqa
                                userInfo={userInfo} 
                            />
                            <IqaHistory/>
                        </>
                    )}
                </InnerLayout>
            </IqAuditStyled>
        </MainLayout>
    )
}

const IqAuditStyled = styled.div`
    button {
        margin: 1rem;
        padding: .5rem;
    }
    .iqa {
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
`
export default IqAudit