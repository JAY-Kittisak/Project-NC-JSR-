import React from 'react'
import styled from 'styled-components'

import { InnerLayout, SpinnerStyled } from '../../styles/LayoutStyle'
import TopicItem from './TopicItem'
import { useDepartmentsContext } from '../../state/dept-context'
import Spinner from '../Spinner'

interface Props { }

const DeptItem: React.FC<Props> = () => {
    const {
        departmentsState: { departments, loading, error }
    } = useDepartmentsContext()

    if (loading) return (
        <SpinnerStyled>
            <div className='typography'>
                <Spinner color='#007bff' height={50} width={50} />
                <span>Loading... </span>
            </div>
        </SpinnerStyled>
    )

    if (error) return <h2 className='header--center'>{error}</h2>

    return (
        <DeptItemStyled>
            <InnerLayout>
                <div className="resume-content">
                    {(!departments || departments.length === 0)
                        ? (<h2>No NC.</h2>)
                        : departments.map((value) => {
                            return (
                                <TopicItem
                                    key={value.id}
                                    department={value}
                                />
                            )
                        })
                    }
                </div>
            </InnerLayout>
        </DeptItemStyled>
    )
}

const DeptItemStyled = styled.section`
    .resume-content{
        border-left: 2px solid var(--border-color);
    }
`
export default DeptItem