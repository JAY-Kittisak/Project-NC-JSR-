import React from 'react'

import { MainLayout, InnerLayout } from '../styles/LayoutStyle'
import NcChart from '../components/report/NcChart'
import Title from '../components/Title'

interface Props { }

const NcReport: React.FC<Props> = () => {
    return (
        <MainLayout>
            <Title title={'Report Nc'} span={'Report Nc'} />
            <InnerLayout>

                <NcChart />
                
            </InnerLayout>
        </MainLayout>
    )
}

export default NcReport