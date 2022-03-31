import React from 'react'
import styled from 'styled-components'
import {
    BarChart, Bar, XAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface Props { }

interface PropStyled {
    colors: string
}


const data = [
    {
        name: 'NCR',
        Product: 3,
        Process: 4,
    },
    {
        name: 'CCS',
        Product: 4,
        Process: 2,
    },
    {
        name: 'SCR',
        Product: 1,
        Process: 1,
    },
];
const dataPieChart = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];

type RenderCu = {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: RenderCu) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const NcChartDept: React.FC<Props> = () => {
    return (
        <DeptChartStyled>
            <div className="flex-center">
                <h3>แผนก SC ลาดกระบัง</h3>
            </div>

            <p className="flex-center title">ประเภทความไม่สอดคล้อง</p>
            <div className='flex-start'>
                <div className="pie-chart">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={300} height={300}>
                            <Pie
                                data={dataPieChart}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {dataPieChart.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <TopicStyled>
                        <CircleStyled colors={COLORS[0]}></CircleStyled>
                        <p>ลงทะเบียนไม่ครบถ้วน</p>
                    </TopicStyled>
                    <TopicStyled>
                        <CircleStyled colors={COLORS[1]}></CircleStyled>
                        <p>จัดทำใบเสนอราคาไม่ถูกต้อง</p>
                    </TopicStyled>
                    <TopicStyled>
                        <CircleStyled colors={COLORS[2]}></CircleStyled>
                        <p>การสื่อสารผิดพลาด </p>
                    </TopicStyled>
                    <TopicStyled>
                        <CircleStyled colors={COLORS[3]}></CircleStyled>
                        <p>สินค้าเคลม / คืนสินค้า</p>
                    </TopicStyled>
                    <TopicStyled>
                        <CircleStyled colors={COLORS[1]}></CircleStyled>
                        <p>จัดทำใบเสนอราคาไม่ถูกต้อง</p>
                    </TopicStyled>
                    <TopicStyled>
                        <CircleStyled colors={COLORS[2]}></CircleStyled>
                        <p>การสื่อสารผิดพลาด </p>
                    </TopicStyled>
                    <TopicStyled>
                        <CircleStyled colors={COLORS[3]}></CircleStyled>
                        <p>สินค้าเคลม / คืนสินค้า</p>
                    </TopicStyled>
                </div>
            </div>

            <div className="type-chart">
            <p className="flex-center title">ประเด็นความไม่สอดคล้อง</p>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 25,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <Tooltip />
                        <Bar dataKey="Product" fill="#007bff" />
                        <Bar dataKey="Process" fill="#78b8fd" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </DeptChartStyled>
    )
}

const DeptChartStyled = styled.section`
    width: 30%;
    margin-left: 1.5rem;
    margin-top: .5rem;
    background-color: var(--background-dark-color);
    position: relative;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);

    &::before {
        content: '';
        position: absolute;
        height: 45px;
        width: 100%;
        background-color: #007bff;
        border-radius: 20px 20px 0 0;
    }

    .pie-chart {
        height: 200px;
        width: 200px;
    }

    .type-chart {
        height: 220px;
        margin-top: 50px;
    }

    .title {
        color: var(--font-light-color);
        margin-top: 1rem;
        font-size: 1.2rem;
        font-weight: 600rem;
    }
`
const TopicStyled = styled.div`
    display: flex;
    align-items: center;
    padding-top: 10px;

    p {
        white-space: nowrap; 
        overflow: hidden;
        text-overflow: ellipsis;
    }
`
const CircleStyled = styled.div`
    width: 20px;
    height: 20px;
    background-color:  ${(props: PropStyled) => props.colors};
    border-radius: 50%;
    margin-right: 0.5rem;
`

export default NcChartDept