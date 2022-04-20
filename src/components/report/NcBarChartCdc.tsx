import React, { useCallback, useState, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { NcrNotify, Branch } from '../../types';

interface Props {
    dataBarCdc: NcrNotify[] | null
    setNcCdcToDept: React.Dispatch<React.SetStateAction<NcrNotify[] | undefined>>
    setBranchChart: React.Dispatch<React.SetStateAction<Branch>>
    setDeptChart: React.Dispatch<React.SetStateAction<string>>
}

type DeptCdc =  
    | 'SC'
    | 'SA'
    | 'QMR'
    | 'PU'
    | 'MK'
    | 'IV'
    | 'HR'
    | 'GA'
    | 'EN'
    | 'DL'
    | 'AC'

type deptDemoCountsCdc = { [key in DeptCdc]: NcrNotify[]}

const initialArrDemoCdc: deptDemoCountsCdc = {
    SC: [],
    SA: [],
    QMR: [],
    PU: [],
    IV: [],
    MK: [],
    HR: [],
    GA: [],
    EN: [],
    DL: [],
    AC: [],
}

const initialDemoCdc :{
    nameDept: DeptCdc;
    counts: number;
}[] = [{
    nameDept: 'SC', 
    counts: 0,
}]

const NcBarChartCdc: React.FC<Props> = ({ dataBarCdc, setNcCdcToDept, setBranchChart, setDeptChart }) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [activeDept, setActiveDept] = useState<DeptCdc>('SC')

    const [dataCdc, setDataCdc] = useState(initialDemoCdc)
    const [ncCdc, setNcCdc] = useState(initialArrDemoCdc)
    
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

        Object.keys(initialArrDemoCdc).forEach(ncStatus => {
            const status = ncStatus as DeptCdc

            updatedCdc[status] = dataBarCdc.filter((item) => item.dept === status)
        })
        
        setNcCdc(updatedCdc)

        setDataCdc([
            {
                nameDept: 'SC',
                counts: updatedCdc.SC.length,
            },
            {
                nameDept: 'SA',
                counts: updatedCdc.SA.length,
            },
            {
                nameDept: 'QMR',
                counts: updatedCdc.QMR.length,
            },
            {
                nameDept: 'PU',
                counts: updatedCdc.PU.length,
            },
            {
                nameDept: 'MK',
                counts: updatedCdc.MK.length,
            },
            {
                nameDept: 'IV',
                counts: updatedCdc.IV.length,
            },
            {
                nameDept: 'HR',
                counts: updatedCdc.HR.length,
            },
            {
                nameDept: 'GA',
                counts: updatedCdc.GA.length,
            },
            {
                nameDept: 'EN',
                counts: updatedCdc.EN.length,
            },
            {
                nameDept: 'DL',
                counts: updatedCdc.DL.length,
            },
            {
                nameDept: 'AC',
                counts: updatedCdc.AC.length,
            },
        ])

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