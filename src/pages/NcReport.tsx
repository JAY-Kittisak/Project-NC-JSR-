import React from 'react'
import styled from 'styled-components'
import NcChart from '../components/report/NcChart'

interface Props { }

const NcReport: React.FC<Props> = () => {
return (
    <NcChartStyled>
        <NcChart />
    </NcChartStyled>
)
}

const NcChartStyled = styled.div`
    display: flex;
`

export default NcReport