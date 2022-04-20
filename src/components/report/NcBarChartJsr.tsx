import React, { useCallback, useState, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { NcrNotify ,Branch } from '../../types';

interface Props {
    dataBarJsr: NcrNotify[] | null
    setNcJsrToDept: React.Dispatch<React.SetStateAction<NcrNotify[] | undefined>>
    setBranchChart: React.Dispatch<React.SetStateAction<Branch>>
    setDeptChart: React.Dispatch<React.SetStateAction<string>>
}

type DeptJsr =
    | 'SC'
    | 'SA'
    | 'QMR'
    | 'PU'
    | 'MK'
    | 'IV'
    | 'HR'
    | 'EN'
    | 'DL'
    | 'AD'
    | 'AC'

type DeptDemoCounts = { [key in DeptJsr]: NcrNotify[] }

const initialArrDemo: DeptDemoCounts = {
    SC: [],
    SA: [],
    QMR: [],
    PU: [],
    IV: [],
    MK: [],
    HR: [],
    EN: [],
    DL: [],
    AD: [],
    AC: [],
}

const initialDemo: {
    nameDept: DeptJsr;
    counts: number;
}[] = [{
    nameDept: 'SC',
    counts: 0,
}]

const NcBarChartJsr: React.FC<Props> = ({ dataBarJsr, setNcJsrToDept, setBranchChart, setDeptChart }) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [activeDept, setActiveDept] = useState<DeptJsr>('SC')

    const [dataJsr, setDataJsr] = useState(initialDemo)
    const [ncJsr, setNcJsr] = useState(initialArrDemo)
    
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

        Object.keys(initialArrDemo).forEach(ncStatus => {
            const status = ncStatus as DeptJsr

            updatedJsr[status] = dataBarJsr.filter((item) => item.dept === status)
        })

        setNcJsr(updatedJsr)

        setDataJsr([
            {
                nameDept: 'SC',
                counts: updatedJsr.SC.length,
            },
            {
                nameDept: 'SA',
                counts: updatedJsr.SA.length,
            },
            {
                nameDept: 'QMR',
                counts: updatedJsr.QMR.length,
            },
            {
                nameDept: 'PU',
                counts: updatedJsr.PU.length,
            },
            {
                nameDept: 'MK',
                counts: updatedJsr.MK.length,
            },
            {
                nameDept: 'IV',
                counts: updatedJsr.IV.length,
            },
            {
                nameDept: 'HR',
                counts: updatedJsr.HR.length,
            },
            {
                nameDept: 'EN',
                counts: updatedJsr.EN.length,
            },
            {
                nameDept: 'DL',
                counts: updatedJsr.DL.length,
            },
            {
                nameDept: 'AD',
                counts: updatedJsr.AD.length,
            },
            {
                nameDept: 'AC',
                counts: updatedJsr.AC.length,
            },
        ])

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
                        {/* <Bar dataKey="NCR" fill="#007bff" />
                                    <Bar dataKey="CCR" fill="#78b8fd" />
                                    <Bar dataKey="SCR" fill="#235488" /> */}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default NcBarChartJsr