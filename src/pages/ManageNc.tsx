import React from 'react'
import styled from 'styled-components'
import { MainLayout,InnerLayout } from '../styles/LayoutStyle'
import Title from '../components/Title'
import NcHistoryNotify from '../components/ncr/NcHistoryNotify'

interface Props { }

const ManageNc: React.FC<Props> = () => {

    return (
        <MainLayout>
            <Title title={'Manage NCR'} span={'Manage NCR'} />
            <ManageNcStyled>
                <InnerLayout>
                    <NcHistoryNotify historyTitle="จัดการเอกสาร"/>
                </InnerLayout>
            </ManageNcStyled>
        </MainLayout>
    )
}

const ManageNcStyled = styled.div`
    
`
export default ManageNc