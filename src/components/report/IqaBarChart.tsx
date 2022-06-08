import React, { useState, useCallback, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';
import styled from 'styled-components';

import { IqaType } from '../../types'

interface Props {
    title: string
    colorOne: string
    colorTwo: string
    colorThree: string
    colorFour: string
    dataChart: IqaType[] | null
}

type BarChartDept = {
    nameDept: string,
    car: number,
    obs: number,
}

type BarChartReq = {
    req: string,
    counts: number
}

const initialBarJsr = [
    {
        nameDept: 'ไม่มีข้อมูล',
        car: 0,
        obs: 0
    },
]

const initialRequirements = [
    {
        req: 'ไม่มีข้อมูล',
        counts: 0
    },
]

const IqaBarChart: React.FC<Props> = ({ 
    title,
    colorOne,
    colorTwo,
    colorThree,
    colorFour,
    dataChart
}) => {
    const [ activeIndex, setActiveIndex ] = useState(30)
    const [ deptName, setDeptName ] = useState('All')
    const [ chartDept, setChartDept ] = useState<BarChartDept[]>(initialBarJsr)
    const [ chartReq, setChartReq ] = useState<BarChartReq[]>(initialRequirements)
    
    const handleClick = useCallback((_, index: number) => {
        if (index === activeIndex) {
            setDeptName("All")
            setActiveIndex(30)
        } else {
            const result = chartDept[index].nameDept

            setDeptName(result)
            setActiveIndex(index)
        }
        
    },[ setActiveIndex,setDeptName ,activeIndex, chartDept])

    useEffect(() => {
        if (!dataChart) return

        let countChartDept: BarChartDept[] = []
        let countChartReq: BarChartReq[] = []

        const mapDept = dataChart.map(value => value.dept)
        const mapRequirements = dataChart.map(value => value.requirements)

        const newSetDept = new Set(mapDept)
        const newSetRequirements = new Set(mapRequirements)

        newSetDept.forEach(dept => {
            const filterDept = dataChart.filter(val => val.dept === dept)
            const filterCar = filterDept.filter(val => val.category === 'CAR')
            const filterObs = filterDept.filter(val => val.category === 'OBS')

            countChartDept.push({
                nameDept: dept,
                car: filterCar.length,
                obs: filterObs.length
            })
        })


        if (deptName === "All") {
            newSetRequirements.forEach(req => {
                const filterReq = dataChart.filter(val => val.requirements === req)
    
                countChartReq.push({
                    req,
                    counts: filterReq.length
                })
            })
        } else {
            newSetRequirements.forEach(req => {
                const filterDeptName = dataChart.filter(val => val.dept === deptName)
                const filterReq = filterDeptName.filter(val => val.requirements === req)
    
                countChartReq.push({
                    req,
                    counts: filterReq.length
                })
            })
        }
        
        setChartDept(countChartDept)
        setChartReq(countChartReq)

    }, [ dataChart, deptName])
    
    return (
        <IqaBarStyled color={colorFour}>
            <div className="left-content">
                <div className='card'>
                    <div className="flex-center">
                        <h3>{title} IQA ทั้งหมด {dataChart?.length}</h3>
                    </div>
                    <div className="chart">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                width={500}
                                height={300}
                                data={chartDept}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 0,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="nameDept" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="car"
                                    onClick={handleClick}
                                    fill={colorTwo}
                                >
                                    {chartDept.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            cursor="pointer"
                                            fill={index === activeIndex ? colorOne : colorTwo}
                                        />
                                    ))}
                                </Bar>
                                <Bar
                                    dataKey="obs"
                                    onClick={handleClick}
                                    fill={colorFour}
                                >
                                    {chartDept.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            cursor="pointer"
                                            fill={index === activeIndex ? colorThree : colorFour}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div className="right-content">
                <div className='card'>
                    <div className="flex-center">
                        {/* <h3>ลาดกระบัง NC ทั้งหมด {dataBarJsr?.length}</h3> */}
                        <h3>{deptName}</h3>
                    </div>
                    <div className="chart">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                width={500}
                                height={300}
                                data={chartReq}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 0,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="req" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="counts" fill={colorFour}>
                                    {chartReq.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={colorFour}/>
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </IqaBarStyled>
    )
}

const IqaBarStyled = styled.div`
    display: flex;
    margin-top: .5rem;

    @media screen and (max-width: 900px){
        flex-direction: column;
    }

    .left-content {
        width: 70%;

        @media screen and (max-width: 900px){
            width: 100%;
        }
    
    }

    .right-content {
        margin-left: 1rem;
        width: 30%;

        @media screen and (max-width: 900px){
            width: 100%;
            margin-left: 0;
            margin-top: .5rem;
        }
    }

    .card {
        margin-top: .5rem;
        position: relative;
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    }

    .card::before{
        content: '';
        position: absolute;
        height: 45px;
        width: 100%;
        background-color: ${(props: {color: string}) => props.color};
        border-radius: 10px 10px 0 0;
    }

    .chart {
        height: 250px;
    }

    h3 {
        padding-top: 10px;
        color: #fff;
        font-size: 1.4rem;
        z-index: 1;
    }
`

export default IqaBarChart