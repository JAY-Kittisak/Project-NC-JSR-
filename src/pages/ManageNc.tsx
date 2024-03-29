import React from 'react'

import { MainLayout,InnerLayout } from '../styles/LayoutStyle'
import Title from '../components/Title'
import NcHistoryAdminView from '../components/ncr/NcHistoryAdminView'

interface Props { }

const ManageNc: React.FC<Props> = () => {

    return (
        <MainLayout>
            <Title title={'Manage NCR'} span={'Manage NCR'} />
            <InnerLayout>
                <NcHistoryAdminView />
            </InnerLayout>
        </MainLayout>
    )
}

export default ManageNc