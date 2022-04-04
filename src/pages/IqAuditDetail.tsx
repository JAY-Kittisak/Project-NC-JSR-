import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import { MainLayout,InnerLayout, SpinnerStyled } from '../styles/LayoutStyle'
import Title from '../components/Title'
import Spinner from '../components/Spinner'
import { useQueryIqa } from '../hooks/useQueryIqa'
import { useAuthContext } from '../state/auth-context'

interface Props { }

const IqAuditDetail: React.FC<Props> = () => {

    const params = useParams<{ id: string }>()

    const { authState: { userInfo } } = useAuthContext()
    const {iqa, loading, error} = useQueryIqa(params.id)

    if (loading) return (
        <SpinnerStyled>
            <div className="typography">
                <Spinner color='gray' height={50} width={50} /> <span>Loading... </span>
            </div>
        </SpinnerStyled>
    )

    if (error) return <h2 className='header--center'>{error}</h2>

    if (!iqa || !userInfo) return <h2 className='header--center'>Error Non Conformance Detail</h2>

    const {
        code,
        // inspector1,
        // inspector2,
        // inspector3,
        // inspector4,
        // team,
        // category,
        // round,
        // toName,
        // dept,
        // checkedProcess,
        // requirements,
        // detail,
        // createdAt
    } = iqa

    return (
        <MainLayout>
            <Title title={'IQA Detail'} span={'IQA Detail'} />
            <IqaDetailStyled>
                <InnerLayout className='ncr'>
                    <h1>{code}</h1>
                </InnerLayout>
            </IqaDetailStyled>
        </MainLayout>
    )
}

const IqaDetailStyled = styled.div`
    
`
export default IqAuditDetail