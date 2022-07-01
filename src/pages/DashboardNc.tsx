import React from 'react'

import { MainLayout, InnerLayout } from '../styles/LayoutStyle'
import ScrollToTop from '../components/ScrollToTop'
import NcChart from '../components/report/NcChart'
import Title from '../components/Title'

interface Props { }

const DashboardNc: React.FC<Props> = () => {
    return (
        <MainLayout>
            <ScrollToTop />
            <Title title={'Dashboard Nc'} span={'Dashboard Nc'} />
            <InnerLayout>
                <NcChart />
            </InnerLayout>
        </MainLayout>
    )
}

export default DashboardNc