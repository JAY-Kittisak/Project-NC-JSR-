import React from 'react'
import styled from 'styled-components'
import NcHistoryToDept from '../components/ncr/NcHistoryToDept'
import Title from '../components/Title'
import { useAuthContext } from '../state/auth-context'
import { InnerLayout, MainLayout } from '../styles/LayoutStyle'

interface Props { }

const AnswerNc: React.FC<Props> = () => {
    const { authState: { userInfo } } = useAuthContext()
    
    return (
        <MainLayout>
            <Title title={'Answer NC'} span={'Answer NC'} />
            <AnswerNcStyled>
                <InnerLayout>
                    {(!userInfo || userInfo.dept === 'null') ? (
                        <h2 className='header--center'>No. User INFO หรือยังไม่ได้มีการตั้งค่าแผนกของคุณ</h2>
                    ) : (<NcHistoryToDept dept={userInfo.dept} branch={userInfo.branch}/>)}
                    
                </InnerLayout>
            </AnswerNcStyled>
        </MainLayout>

    )
}

const AnswerNcStyled = styled.div`

`
export default AnswerNc