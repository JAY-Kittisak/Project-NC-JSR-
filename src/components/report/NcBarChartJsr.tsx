import React, { useCallback, useState, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { DataDemo, Branch } from '../../types';

interface Props {
    dataDemoJsr: DataDemo[] | null
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
type deptDemoCounts = { [key in DeptJsr]: DataDemo[]}
const initialArrDemo: deptDemoCounts = {
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
const initialDemo :{
    nameDept: DeptJsr;
    counts: number;
    branch: Branch;
}[] = [{
    nameDept: 'SC', 
    counts: 0,
    branch: 'ลาดกระบัง'
}]

const NcBarChartJsr: React.FC<Props> = ({ dataDemoJsr }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [dataJsr, setDataJsr] = useState<{
        nameDept: DeptJsr;
        counts: number;
        branch: Branch;
    }[]>(initialDemo);
    const [ncJsr, setNcJsr] = useState(initialArrDemo)

    
    const handleClick = useCallback(
        (_, index: number) => {
            setActiveIndex(index);
        },
        [setActiveIndex, dataJsr]
    );

    useEffect(() => {
        if (!dataDemoJsr) return 

        const updatedJsr: any = {}

        Object.keys(initialArrDemo).forEach(ncStatus => {
            const status = ncStatus as DeptJsr

            updatedJsr[status] = dataDemoJsr.filter((item) => item.dept === status)
        })
        
        setNcJsr(updatedJsr)

        setDataJsr([
            {
                nameDept: 'SC',
                counts: updatedJsr.SC.length,
                branch: 'ลาดกระบัง'
            },
            {
                nameDept: 'SA',
                counts: updatedJsr.SA.length,
                branch: 'ลาดกระบัง'
            },
            {
                nameDept: 'QMR',
                counts: updatedJsr.QMR.length,
                branch: 'ลาดกระบัง'
            },
            {
                nameDept: 'PU',
                counts: updatedJsr.PU.length,
                branch: 'ลาดกระบัง'
            },
            {
                nameDept: 'MK',
                counts: updatedJsr.MK.length,
                branch: 'ลาดกระบัง'
            },
            {
                nameDept: 'IV',
                counts: updatedJsr.IV.length,
                branch: 'ลาดกระบัง'
            },
            {
                nameDept: 'HR',
                counts: updatedJsr.HR.length,
                branch: 'ลาดกระบัง'
            },
            {
                nameDept: 'EN',
                counts: updatedJsr.EN.length,
                branch: 'ลาดกระบัง'
            },
            {
                nameDept: 'DL',
                counts: updatedJsr.DL.length,
                branch: 'ลาดกระบัง'
            },
            {
                nameDept: 'AD',
                counts: updatedJsr.AD.length,
                branch: 'ลาดกระบัง'
            },
            {
                nameDept: 'AC',
                counts: updatedJsr.AC.length,
                branch: 'ลาดกระบัง'
            },
        ])

    }, [dataDemoJsr])
return (
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
                                    {/* <Legend /> */}
                                    <Bar 
                                        dataKey="counts"
                                        onClick={handleClick}
                                    >
                                        {dataDemoJsr && dataDemoJsr.map((_, index) => (
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
)
}

export default NcBarChartJsr