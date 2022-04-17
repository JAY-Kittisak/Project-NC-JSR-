import React from 'react'

import { MainLayout,InnerLayout } from '../styles/LayoutStyle'
import Title from '../components/Title'
import IqaAdminView from '../components/iqa/IqaAdminView'

export const prodTabType = 'ncStatus'
export const ncPerPage = 10

interface Props { }

const ManageIqAudit: React.FC<Props> = () => {
    return (
        <MainLayout>
            <Title title={'Manage IQA'} span={'Manage IQA'} />
            <div>
                <InnerLayout className='manage-iqa'>
                    <IqaAdminView />
                </InnerLayout>
            </div>
        </MainLayout>
    )
}
export default ManageIqAudit