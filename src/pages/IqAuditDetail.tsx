import React from 'react'
import styled from 'styled-components'
import { MainLayout,InnerLayout } from '../styles/LayoutStyle'
import Title from '../components/Title'

interface Props { }

const iqAuditDetail: React.FC<Props> = () => {
    return (
        <MainLayout>
            <Title title={'IQA Detail'} span={'IQA Detail'} />
            <IqaDetailStyled>
                <InnerLayout className='ncr'>
                </InnerLayout>
            </IqaDetailStyled>
        </MainLayout>
    )
}

const IqaDetailStyled = styled.div`
    
`
export default iqAuditDetail