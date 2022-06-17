import React from 'react'

import { MainLayout, InnerLayout } from '../styles/LayoutStyle'
import ScrollToTop from '../components/ScrollToTop'
import IqaChart from '../components/report/IqaChart'
import Title from '../components/Title'

interface Props { }

const DashboardIqa: React.FC<Props> = () => {
    return (
        <MainLayout>
            <ScrollToTop />
            <Title title={'Dashboard IQA'} span={'Dashboard IQA'} />
            <InnerLayout>
                <IqaChart />
            </InnerLayout>
        </MainLayout>
    )
}

export default DashboardIqa