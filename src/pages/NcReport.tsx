import React from 'react'
import styled from 'styled-components'

import { MainLayout, InnerLayout } from '../styles/LayoutStyle'
import NcChart from '../components/report/NcChart'
import Title from '../components/Title'

interface Props { }

const NcReport: React.FC<Props> = () => {
    return (
        <MainLayout>
            <Title title={'Report Nc'} span={'Report Nc'} />
            <InnerLayout>
                <div className="flex-between">
                    <ReportTitle>
                        <h3>ลาดกระบัง</h3>
                    </ReportTitle>
                    <FilterDateStyled>
                        <InputStyled>
                            <label htmlFor="containmentDueDate">จากวันที่</label>
                            <input
                                type="date"
                                name='containmentDueDate'
                                id="containmentDueDate"
                                min="2022-01-01"
                            />
                        </InputStyled>
                        <InputStyled>
                            <label htmlFor="containmentDueDate">ถึงวันที่</label>
                            <input
                                type="date"
                                name='containmentDueDate'
                                id="containmentDueDate"
                                min="2022-01-01"
                            />
                        </InputStyled>
                    </FilterDateStyled>
                </div>

                <NcChart />
                
            </InnerLayout>
        </MainLayout>
    )
}

const ReportTitle = styled.section`
    h3 {
        color: var(--white-color);
        font-size: 1.4rem;
        margin: 16px 0;
        border-left: 5px solid #e74c3c;
        padding-left: 16px;
    }
`
const FilterDateStyled = styled.div`
    display: flex;
`

const InputStyled = styled.div`
    text-align: start;
    margin: .3rem auto;
    width: 100%;

    label {
        font-weight: 600;
    }
    
    input {
        width: 100%;
        border: 0.6px solid #79849b;
        padding: 0.3rem;
        outline: none;
        border-radius: 2px;
        box-shadow: 2px 2px 4px rgb(137, 145, 160, 0.4);
        color: var(--font-light-color);
        background-color: var(--background-dark-color);
    }
`

export default NcReport