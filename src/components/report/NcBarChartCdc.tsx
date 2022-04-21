import React, { useCallback, useState, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';

import { NcrNotify, Branch, DeptCdc, CountsBarCdc } from '../../types';
import { initialDeptCdc } from '../../helpers'

interface Props {
    dataBarCdc: NcrNotify[] | null
    setNcCdcToDept: React.Dispatch<React.SetStateAction<NcrNotify[] | undefined>>
    setBranchChart: React.Dispatch<React.SetStateAction<Branch>>
    setDeptChart: React.Dispatch<React.SetStateAction<string>>
}

const initialDemoCdc: CountsBarCdc[] = [{
    nameDept: 'SC', 
    counts: 0,
}]

const NcBarChartCdc: React.FC<Props> = ({ dataBarCdc, setNcCdcToDept, setBranchChart, setDeptChart }) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [activeDept, setActiveDept] = useState<DeptCdc>('SC')

    const [dataCdc, setDataCdc] = useState(initialDemoCdc)
    const [ncCdc, setNcCdc] = useState(initialDeptCdc)
    
    const handleClick = useCallback((_, index: number) => {
        const result = dataCdc[index].nameDept

        setActiveIndex(index)
        setActiveDept(result)
        setDeptChart(result)
        setBranchChart('ชลบุรี')
    },[setActiveIndex, setBranchChart, dataCdc, setDeptChart ]);

    useEffect(() => {
        if (!dataBarCdc) return

        const updatedCdc: any = {}
        let countsBarChart: CountsBarCdc[] = []

        Object.keys(initialDeptCdc).forEach(deptCdc => {
            const dept = deptCdc as DeptCdc

            updatedCdc[dept] = dataBarCdc.filter((item) => item.dept === dept)

            const countsBar: CountsBarCdc = { nameDept: dept, counts: updatedCdc[dept].length }
            countsBarChart.push(countsBar)
        })
        
        setNcCdc(updatedCdc)

        setDataCdc(countsBarChart)

    }, [dataBarCdc])

    useEffect(() => {
        const result = ncCdc[activeDept]
        setNcCdcToDept(result)
    }, [ dataCdc, activeDept, ncCdc, setNcCdcToDept])

    return (
        <div className='card m-top'>
            <div className="flex-center">
                <h3>ชลบุรี NC ทั้งหมด {dataBarCdc?.length}</h3>
            </div>
            <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={dataCdc}
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
                        <Bar 
                            dataKey="counts"
                            onClick={handleClick}
                        >
                            {dataCdc.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    cursor="pointer"
                                    fill={index === activeIndex ? "#0bce46" : '#50c272'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default NcBarChartCdc