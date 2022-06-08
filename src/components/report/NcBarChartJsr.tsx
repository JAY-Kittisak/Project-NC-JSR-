import React, { useCallback, useState, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';

import { initialDeptJsr } from '../../helpers'
import { NcrNotify ,Branch, DeptJsr, CountsBarJsr } from '../../types';

interface Props {
    dataBarJsr: NcrNotify[] | null
    setNcJsrToDept: React.Dispatch<React.SetStateAction<NcrNotify[] | undefined>>
    setBranchChart: React.Dispatch<React.SetStateAction<Branch>>
    setDeptChart: React.Dispatch<React.SetStateAction<string>>
}

const initialBarJsr: CountsBarJsr[] = [{
    nameDept: 'SC',
    counts: 0,
}]

const NcBarChartJsr: React.FC<Props> = ({ dataBarJsr, setNcJsrToDept, setBranchChart, setDeptChart }) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [activeDept, setActiveDept] = useState<DeptJsr>('SC')

    const [dataJsr, setDataJsr] = useState(initialBarJsr)
    const [ncJsr, setNcJsr] = useState(initialDeptJsr)
    
    const handleClick = useCallback((_, index: number) => {
        const result = dataJsr[index].nameDept
        
        setActiveIndex(index);
        setActiveDept(result)
        setDeptChart(result)
        setBranchChart('ลาดกระบัง')
    },[setActiveIndex, setBranchChart, dataJsr, setDeptChart]);

    useEffect(() => {
        if (!dataBarJsr) return

        const updatedJsr: any = {}
        let countsBarChart: CountsBarJsr[] = []

        Object.keys(initialDeptJsr).forEach(deptJsr => {
            const dept = deptJsr as DeptJsr

            updatedJsr[dept] = dataBarJsr.filter((item) => item.dept === dept)

            const countsBar: CountsBarJsr  = { nameDept: dept, counts: updatedJsr[dept].length }
            countsBarChart.push(countsBar)
        })

        setNcJsr(updatedJsr)

        setDataJsr(countsBarChart)

    }, [dataBarJsr])

    useEffect(() => {
        const result = ncJsr[activeDept]
        setNcJsrToDept(result)
    }, [ activeDept, ncJsr, setNcJsrToDept])

    return (
        <div className='card'>
            <div className="flex-center">
                <h3>ลาดกระบัง NC ทั้งหมด {dataBarJsr?.length}</h3>
            </div>
            <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={dataJsr}
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
                            {dataJsr.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    cursor="pointer"
                                    fill={index === activeIndex ? "#007bff" : '#78b8fd'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default NcBarChartJsr