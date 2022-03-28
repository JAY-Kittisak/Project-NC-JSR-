import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

const data = [
    {
        name: 'SC',
        NCR: 7,
        CCR: 6,
        SCR: 2,
    },
    {
        name: 'SA',
        NCR: 11,
        CCR: 5,
        SCR: 4,
    },
    {
        name: 'QMR',
        NCR: 6,
        CCR: 12,
        SCR: 3,
    },
    {
        name: 'PU',
        NCR: 10,
        CCR: 15,
        SCR: 6,
    },
    {
        name: 'MK',
        NCR: 7,
        CCR: 5,
        SCR: 4,
    },
    {
        name: 'IV',
        NCR: 8,
        CCR: 14,
        SCR: 5,
    },
    {
        name: 'HR',
        NCR: 12,
        CCR: 3,
        SCR: 7,
    },
    {
        name: 'EN',
        NCR: 5,
        CCR: 8,
        SCR: 7,
    },
    {
        name: 'DL',
        NCR: 12,
        CCR: 8,
        SCR: 2,
    },
    {
        name: 'DC',
        NCR: 6,
        CCR: 5,
        SCR: 1,
    },
    {
        name: 'AD',
        NCR: 3,
        CCR: 10,
        SCR: 6,
    },
    {
        name: 'AC',
        NCR: 10,
        CCR: 15,
        SCR: 6,
    },
];
interface Props { }

const NcChart: React.FC<Props> = () => {
    return (
        <>
            <ChartStyled>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="NCR" fill="#007bff" />
                        <Bar dataKey="CCR" fill="#78b8fd" />
                        <Bar dataKey="SCR" fill="#235488" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartStyled>

            <ReportTitle>
                <h3>ชลบุรี</h3>
            </ReportTitle>
            <ChartStyled>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="NCR" fill="#0bce46" />
                        <Bar dataKey="CCR" fill="#50c272" />
                        <Bar dataKey="SCR" fill="#097028" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartStyled>
        </>
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
const ChartStyled = styled.div`
    height: 290px;
    width: 100%;
`

export default NcChart