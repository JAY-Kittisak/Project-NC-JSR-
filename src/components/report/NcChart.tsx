import React from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import styled from 'styled-components';
import NcChartDept from './NcChartDept';

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
            <div className="flex-between">
                <FilterDateStyled>
                    <InputStyled>
                        <label htmlFor="containmentDueDate">จากวันที่</label>
                        <input
                            type="date"
                            name='containmentDueDate'
                            id="containmentDueDate"
                            min="2022-01-01"
                            defaultValue="2022-01-01"
                        />
                    </InputStyled>
                    <InputStyled>
                        <label htmlFor="containmentDueDate">ถึงวันที่</label>
                        <input
                            type="date"
                            name='containmentDueDate'
                            id="containmentDueDate"
                            min="2022-01-01"
                            defaultValue="2022-12-31"
                        />
                    </InputStyled>
                </FilterDateStyled>
            </div>
            <NcChartStyled>
                <div className="left-content">
                    {/* ลาดกระบัง */}
                    <div className='card'>
                        <div className="flex-center">
                            <h3>ลาดกระบัง</h3>
                        </div>
                        <div className="chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    width={500}
                                    height={300}
                                    data={data}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 0,
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
                        </div>
                    </div>

                    {/* ชลบุรี */}
                    <div className='card m-top'>
                        <div className="flex-center">
                            <h3>ชลบุรี</h3>
                        </div>
                        <div className="chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    width={500}
                                    height={300}
                                    data={data}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 0,
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
                        </div>
                    </div>
                </div>

                {/* แผนก */}
                <NcChartDept />
            </NcChartStyled>
        </>
    )
}

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

const NcChartStyled = styled.div`
    margin-top: .5rem;
    display: flex;
    width: 100%;

    /* FIXME: ใส่มีเดี่ย */

    .left-content {
        display: flex;
        flex-direction: column;
        width: 70%;
    }

    .right-content {
        margin-left: 1.5rem;
        width: 30%;
    }

    .card {
        margin-top: .5rem;
        background-color: var(--background-dark-color);
        position: relative;
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    }

    .m-top {
        margin-top: 1.5rem;
    }

    .chart {
        height: 250px;
    }

    .card::before{
        content: '';
        position: absolute;
        height: 45px;
        width: 100%;
        background-color: #007bff;
        border-radius: 20px 20px 0 0;
    }

    .card + .card::before{
        background-color: #50c272;
    }

    h3 {
        padding-top: 10px;
        color: #fff;
        font-size: 1.4rem;
        z-index: 1;
    }
`

export default NcChart