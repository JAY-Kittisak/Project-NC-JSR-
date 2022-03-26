import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

const data = [
    {
        name: 'SC',
        NCR: 10,
        CCR: 15,
        SCR: 6,
    },
    {
        name: 'SA',
        NCR: 10,
        CCR: 15,
        SCR: 6,
    },
    {
        name: 'QMR',
        NCR: 10,
        CCR: 15,
        SCR: 6,
    },
    {
        name: 'PU',
        NCR: 10,
        CCR: 15,
        SCR: 6,
    },
    {
        name: 'MK',
        NCR: 10,
        CCR: 15,
        SCR: 6,
    },
    {
        name: 'IV',
        NCR: 10,
        CCR: 15,
        SCR: 6,
    },
    {
        name: 'HR',
        NCR: 10,
        CCR: 15,
        SCR: 6,
    },
    {
        name: 'EN',
        NCR: 10,
        CCR: 15,
        SCR: 6,
    },
    {
        name: 'DL',
        NCR: 10,
        CCR: 15,
        SCR: 6,
    },
    {
        name: 'DC',
        NCR: 10,
        CCR: 15,
        SCR: 6,
    },
    {
        name: 'AD',
        NCR: 10,
        CCR: 15,
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
                <Bar dataKey="NCR" fill="#8884d8" />
                <Bar dataKey="CCR" fill="#82ca9d" />
                <Bar dataKey="SCR" fill="#c2147f" />
            </BarChart>
        </ResponsiveContainer>
        </ChartStyled>
    )
}

const ChartStyled = styled.div`
    height: 400px;
    width: 100%;
`
export default NcChart