import React from 'react'
import styled from 'styled-components'
import { MainLayout,InnerLayout } from '../styles/LayoutStyle'
import Title from '../components/Title'
import NcHistoryAdminView from '../components/ncr/NcHistoryAdminView'

interface Props { }

const ManageNc: React.FC<Props> = () => {

    return (
        <MainLayout>
            <Title title={'Manage NCR'} span={'Manage NCR'} />
            <ManageNcStyled>
                <InnerLayout>
                    <NcHistoryAdminView />
                </InnerLayout>
            </ManageNcStyled>
        </MainLayout>
    )
}

const ManageNcStyled = styled.div`
    
`
export default ManageNc