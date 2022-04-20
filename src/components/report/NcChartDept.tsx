import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

import { NcrNotify, Branch, ChartColor, ChartColorType } from '../../types';

interface Props {
    ncJsrToDept: NcrNotify[] | undefined
    branchChart: Branch
    deptChart: string
}

interface PropStyled {
    colors: string
}

type ValueDept ={
    dept: string;
    value: number;
}


const data = [
    {
        name: 'NCR',
        product: 0,
        process: 4,
    },
    {
        name: 'CCS',
        product: 0,
        process: 0,
    },
    {
        name: 'SCR',
        product: 0,
        process: 0,
    },
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

const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#096d27', '#063691', '#066591'];

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

const NcChartDept: React.FC<Props> = ({ ncJsrToDept, branchChart , deptChart}) => {
    const [dataCat, setDataCat] = useState(data)
    const [dataPieChart, setDataPieChart] = useState<ValueDept[]>([])
    const [chartColor, setChartColor] = useState<ChartColor>('#007bff')
    const [chartColorType, setChartColorType] = useState<ChartColorType>('#78b8fd')

    useEffect(() => {
        if (branchChart === 'ลาดกระบัง') {
            setChartColor('#007bff')
            setChartColorType('#78b8fd')
        } else {
            setChartColor('#0bce46')
            setChartColorType('#6fcc8b')
        }
    } ,[branchChart])

    useEffect(() => {
        if (!ncJsrToDept) return

        const ncr = ncJsrToDept.filter(item => item.category === 'NCR')
        const ccr = ncJsrToDept.filter(item => item.category === 'CCR')
        const scr = ncJsrToDept.filter(item => item.category === 'SCR')

        const ncrProcess = ncr.filter(item => item.topicType === 'Process')
        const ncrProduct = ncr.filter(item => item.topicType === 'Product')
        const ccrProcess = ccr.filter(item => item.topicType === 'Process')
        const ccrProduct = ccr.filter(item => item.topicType === 'Product')
        const scrProcess = scr.filter(item => item.topicType === 'Process')
        const scrProduct = scr.filter(item => item.topicType === 'Product')

        const topics = ncJsrToDept.map(item => item.topic)
        
        const onlyTopics = new Set(ncJsrToDept.map(item => item.topic))
        
        let itemPieChart: ValueDept[] = []

        onlyTopics.forEach((onlyTopic) => {
            const result = topics.filter(topic => topic === onlyTopic)
            const testDemo = { dept: onlyTopic, value: result.length }
            itemPieChart.push(testDemo)
        });
        setDataPieChart(itemPieChart)

        setDataCat([
            {
                name: 'NCR',
                process: ncrProcess.length,
                product: ncrProduct.length
            },
            {
                name: 'CCR',
                process: ccrProcess.length,
                product: ccrProduct.length
            },
            {
                name: 'SCR',
                process: scrProcess.length,
                product: scrProduct.length
            },
        ])

    }, [ncJsrToDept])

    return (
        <DeptChartStyled colors={chartColor}>
            <div className="flex-center">
                <h3>แผนก {deptChart} {branchChart}</h3>
            </div>

            <p className="flex-center title">ประเภทความไม่สอดคล้อง</p>
            <TopicAndPic>
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
                    {dataPieChart.map((item,i) => (
                        <TopicStyled key={i}>
                            <CircleStyled colors={COLORS[i]}></CircleStyled>
                            <TextStyled> {item.dept}</TextStyled>
                        </TopicStyled>
                    ))}
                </div>
            </TopicAndPic>

            <div className="type-chart">
            <p className="flex-center title">ประเด็นความไม่สอดคล้อง</p>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={dataCat}
                        margin={{
                            top: 20,
                            right: 50,
                            left: 0,
                            bottom: 30,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="product" fill={chartColor} />
                        <Bar dataKey="process" fill={chartColorType} />
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

    @media screen and (max-width: 1000px){
        width: 100%;
        margin-top: 1.5rem;
        margin-left: 0rem;
    }

    &::before {
        content: '';
        position: absolute;
        height: 45px;
        width: 100%;
        background-color: ${(props: PropStyled) => props.colors};
        border-radius: 10px 10px 0 0;
    }

    .pie-chart {
        height: 200px;
        width: 200px;
    }

    .type-chart {
        height: 220px;
        margin-top: 70px;
        
        @media screen and (max-width: 1400px){
            margin-top: 0px;
        }
    }

    .title {
        color: var(--font-light-color);
        margin-top: 1rem;
        font-size: 1.2rem;
        font-weight: 600rem;
    }
`

const TopicAndPic = styled.section`
    display: flex;
    align-items: center;
    justify-content: start;

    @media screen and (max-width: 1400px){
        flex-direction: column;
    }
`

const TopicStyled = styled.div`
    display: flex;
    align-items: center;
    padding-top: 5px;
    position: relative;
`

const CircleStyled = styled.div`
    position: absolute;
    width: 20px;
    height: 20px;
    background-color:  ${(props: PropStyled) => props.colors};
    border-radius: 50%;
`

const TextStyled = styled.p`
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
    width: 250px;
    padding-left: 25px;
    
    @media screen and (max-width: 1000px){
        width: 100%;
    }
`

export default NcChartDept