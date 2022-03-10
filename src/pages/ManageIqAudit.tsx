import React from 'react'
import styled from 'styled-components'
import { MainLayout,InnerLayout } from '../styles/LayoutStyle'
import Title from '../components/Title'

interface Props { }

const ManageIqAudit: React.FC<Props> = () => {
    const tim = {
        code: '00001',
        name: 'kittisak',
        nick: 'jay',
        age: '27'
    }

    return (
        <MainLayout>
            <Title title={'Manage IQA'} span={'Manage IQA'} />
            <ManageIqAStyled>
                <InnerLayout className='manage-iqa'>
                    <p>{tim.code}</p>
                </InnerLayout>
            </ManageIqAStyled>
        </MainLayout>
    )
}

const ManageIqAStyled = styled.div`
    
`
export default ManageIqAudit