import React from 'react'
import styled from 'styled-components'

import { MainLayout,InnerLayout } from '../styles/LayoutStyle'
import Title from '../components/Title'

interface Props {}

const IqAudit: React.FC<Props> = () => {
    return (
        <MainLayout>
            <Title title={'IQA'} span={'Internal Quality Audit'} />
            <IqAuditStyled>
                <InnerLayout className='iqa'>
                </InnerLayout>
            </IqAuditStyled>
        </MainLayout>
    )
}

const IqAuditStyled = styled.div`
    button {
        margin: 1rem;
        padding: .5rem;
    }
`
export default IqAudit