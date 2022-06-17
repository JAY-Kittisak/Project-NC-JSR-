import React from 'react'

import { MainLayout,InnerLayout } from '../styles/LayoutStyle'
import Title from '../components/Title'
import { useAuthContext } from '../state/auth-context'

interface Props { }

const Profile: React.FC<Props> = () => {
    const { authState: { userInfo } } = useAuthContext()
    
    return (
        <MainLayout>
            <Title title={'Profile'} span={'Profile'} />
            <InnerLayout>
                <div>
                <p>UserName</p><p>{userInfo?.username}</p>
                </div>
            </InnerLayout>
        </MainLayout>
    )
}

export default Profile