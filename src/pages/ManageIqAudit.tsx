import React from 'react'
import styled from 'styled-components'
import { MainLayout,InnerLayout } from '../styles/LayoutStyle'
import Title from '../components/Title'

interface Props { }

const ManageIqAudit: React.FC<Props> = () => {
    return (
        <MainLayout>
            <Title title={'Manage IQA'} span={'Manage IQA'} />
            <ManageIqAStyled>
                <InnerLayout className='manage-iqa'>
                </InnerLayout>
            </ManageIqAStyled>
        </MainLayout>
    )
}

const ManageIqAStyled = styled.div`
    
`
export default ManageIqAudit