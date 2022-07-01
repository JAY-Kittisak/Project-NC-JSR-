import React from 'react'

import { InnerLayout, MainLayout } from '../styles/LayoutStyle'
import Title from '../components/Title'
import IqaToDept from '../components/iqa/IqaToDept'
import { useAuthContext } from '../state/auth-context'

interface Props { }

const AnswerIqa: React.FC<Props> = () => {
    const { authState: { userInfo } } = useAuthContext()

    return (
        <MainLayout>
            <Title title={'Answer IQA'} span={'Answer IQA'} />
            <InnerLayout>
                {(!userInfo || userInfo.dept === 'null') ? (
                    <h2 className='header--center'>No. User INFO หรือยังไม่ได้มีการตั้งค่าแผนกของคุณ</h2>
                ) : (
                    <IqaToDept dept={userInfo.dept} branch={userInfo.branch} />
                )}
            </InnerLayout>
        </MainLayout>
    )
}

export default AnswerIqa