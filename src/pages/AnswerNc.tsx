import React from 'react'
import styled from 'styled-components'
import NcHistoryByDept from '../components/ncr/NcHistoryByDept'
import Title from '../components/Title'
import { useAuthContext } from '../state/auth-context'
import { InnerLayout, MainLayout } from '../styles/LayoutStyle'

interface Props { }

const AnswerNc: React.FC<Props> = () => {
    const { authState: { userInfo } } = useAuthContext()
    return (
        <MainLayout>
            <Title title={'Answer NCR'} span={'Answer NCR'} />
            <AnswerNcStyled>
                <InnerLayout>
                    {(!userInfo || userInfo.dept === 'null') ? (
                        <h2 className='header--center'>No. User INFO หรือยังไม่ได้มีการตั้งค่าแผนกของคุณ</h2>
                    ) : (<NcHistoryByDept dept={userInfo.dept} branch={userInfo.branch}/>)}
                    
                </InnerLayout>
            </AnswerNcStyled>
        </MainLayout>

    )
}

const AnswerNcStyled = styled.div`

`
export default AnswerNc