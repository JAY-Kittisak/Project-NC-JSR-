import React, { useCallback, useState, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import styled from 'styled-components';
import { Branch, DataDemo } from '../../types';
// import NcBarChartJsr from './NcBarChartJsr';
// import { useQueryNcReport } from '../../hooks/useQueryNcReport';
import NcChartDept from './NcChartDept';

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

type deptDemoCountsCdc = { [key in DeptCdc]: DataDemo[]}

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

type CountsBrach ={
    latKrabang?: number;
    chonburi?: number;
}

const data: DataDemo[] = [
    {
        id: '1',
        dept: 'SC',
        NCR: 7,
        CCR: 6,
        SCR: 2,
        category: 'NCR',
        topic: 'topic 1',
        topicType: 'Process',
        branch: 'ลาดกระบัง',
        ncStatus: 'ปิดแล้ว'
    },
    {
        id: '2',
        dept: 'SA',
        NCR: 11,
        CCR: 5,
        SCR: 4,
        category: 'NCR',
        topic: 'topic 1',
        topicType: 'Process',
        branch: 'ลาดกระบัง',
        ncStatus: 'ปิดแล้ว'
    },
    {
        id: '3',
        dept: 'QMR',
        NCR: 6,
        CCR: 12,
        SCR: 3,
        category: 'NCR',
        topic: 'topic 1',
        topicType: 'Process',
        branch: 'ลาดกระบัง',
        ncStatus: 'ปิดแล้ว'
    },
    {
        id: '4',
        dept: 'PU',
        NCR: 10,
        CCR: 15,
        SCR: 6,
        category: 'NCR',
        topic: 'topic 1',
        topicType: 'Process',
        branch: 'ลาดกระบัง',
        ncStatus: 'ปิดแล้ว'
    },
    {
        id: '5',
        dept: 'MK',
        NCR: 7,
        CCR: 5,
        SCR: 4,
        category: 'NCR',
        topic: 'topic 1',
        topicType: 'Process',
        branch: 'ลาดกระบัง',
        ncStatus: 'ปิดแล้ว'
    },
    {
        id: '6',
        dept: 'IV',
        NCR: 8,
        CCR: 14,
        SCR: 5,
        category: 'NCR',
        topic: 'topic 1',
        topicType: 'Process',
        branch: 'ลาดกระบัง',
        ncStatus: 'ปิดแล้ว'
    },
    {
        id: '7',
        dept: 'HR',
        NCR: 12,
        CCR: 3,
        SCR: 7,
        category: 'NCR',
        topic: 'topic 1',
        topicType: 'Process',
        branch: 'ลาดกระบัง',
        ncStatus: 'ปิดแล้ว'
    },
    {
        id: '8',
        dept: 'EN',
        NCR: 5,
        CCR: 8,
        SCR: 7,
        category: 'NCR',
        topic: 'topic 1',
        topicType: 'Process',
        branch: 'ลาดกระบัง',
        ncStatus: 'ปิดแล้ว'
    },
    {
        id: '9',
        dept: 'DL',
        NCR: 12,
        CCR: 8,
        SCR: 2,
        category: 'NCR',
        topic: 'topic 1',
        topicType: 'Process',
        branch: 'ลาดกระบัง',
        ncStatus: 'ปิดแล้ว'
    },
    {
        id: '10',
        dept: 'DC',
        NCR: 6,
        CCR: 5,
        SCR: 1,
        category: 'NCR',
        topic: 'topic 1',
        topicType: 'Process',
        branch: 'ลาดกระบัง',
        ncStatus: 'ปิดแล้ว'
    },
    {
        id: '11',
        dept: 'AD',
        NCR: 3,
        CCR: 10,
        SCR: 6,
        category: 'NCR',
        topic: 'topic 1',
        topicType: 'Process',
        branch: 'ลาดกระบัง',
        ncStatus: 'ปิดแล้ว'
    },
    {
        id: '12',
        dept: 'GA',
        NCR: 10,
        CCR: 15,
        SCR: 6,
        category: 'NCR',
        topic: 'topic 1',
        topicType: 'Process',
        branch: 'ชลบุรี',
        ncStatus: 'ปิดแล้ว'
    },
    {
        id: '13',
        dept: 'AC',
        NCR: 10,
        CCR: 15,
        SCR: 6,
        category: 'NCR',
        topic: 'topic 1',
        topicType: 'Process',
        branch: 'ชลบุรี',
        ncStatus: 'ปิดแล้ว'
    },
];

const initialDemoCdc :{
    nameDept: DeptCdc;
    counts: number;
    branch: Branch;
}[] = [{
    nameDept: 'SC', 
    counts: 0,
    branch: 'ชลบุรี'
}]

interface Props { }

const NcChart: React.FC<Props> = () => {
    const [activeIndexCdc, setActiveIndexCdc] = useState(0);
    const [countsBrach, setCountsBrach] = useState<CountsBrach | null>(null);
    // const [dataDemoJsr, setDataDemoJsr] = useState<DataDemo[] | null>(null);
    
    const [toBranch, setToBranch] = useState<Branch>('ลาดกระบัง')
    const [dataCdc, setDataCdc] = useState<{
        nameDept: DeptCdc;
        counts: number;
        branch: Branch;
    }[]>(initialDemoCdc);

    const [ncCdc, setNcCdc] = useState(initialArrDemoCdc)
    console.log(ncCdc.AC)

    // const [dateStart, setDateStart] = useState('2022-01-01');
    // const [dateEnd, setDateEnd] = useState('2022-12-31');

    // const {
    //     ncNotify,
    //     //  loading, error 
    //     } = useQueryNcReport(dateStart,dateEnd)
    // console.log('ncNotify', ncNotify)

    const handleClickCdc = useCallback(
        (_, index: number) => {
            setActiveIndexCdc(index);
            // setToDept(dataCdc[index].nameDept)
            setToBranch(dataCdc[index].branch)
        },
        [setActiveIndexCdc, dataCdc]
    );

    useEffect(() => {
        const branchLkb = data.filter(value => value.branch === 'ลาดกระบัง')
        const branchCdc = data.filter(value => value.branch === 'ชลบุรี')
        setCountsBrach({
            latKrabang: branchLkb.length,
            chonburi: branchCdc.length
        })
        // setDataDemoJsr(branchLkb)

        const updatedCdc: any = {}

        Object.keys(initialArrDemoCdc).forEach(ncStatus => {
            const status = ncStatus as DeptCdc

            updatedCdc[status] = branchCdc.filter((item) => item.dept === status)
        })
        
        setNcCdc(updatedCdc)

        setDataCdc([
            {
                nameDept: 'SC',
                counts: updatedCdc.SC.length,
                branch: 'ชลบุรี'
            },
            {
                nameDept: 'SA',
                counts: updatedCdc.SA.length,
                branch: 'ชลบุรี'
            },
            {
                nameDept: 'QMR',
                counts: updatedCdc.QMR.length,
                branch: 'ชลบุรี'
            },
            {
                nameDept: 'PU',
                counts: updatedCdc.PU.length,
                branch: 'ชลบุรี'
            },
            {
                nameDept: 'MK',
                counts: updatedCdc.MK.length,
                branch: 'ชลบุรี'
            },
            {
                nameDept: 'IV',
                counts: updatedCdc.IV.length,
                branch: 'ชลบุรี'
            },
            {
                nameDept: 'HR',
                counts: updatedCdc.HR.length,
                branch: 'ชลบุรี'
            },
            {
                nameDept: 'GA',
                counts: updatedCdc.GA.length,
                branch: 'ชลบุรี'
            },
            {
                nameDept: 'EN',
                counts: updatedCdc.EN.length,
                branch: 'ชลบุรี'
            },
            {
                nameDept: 'DL',
                counts: updatedCdc.DL.length,
                branch: 'ชลบุรี'
            },
            {
                nameDept: 'AC',
                counts: updatedCdc.AC.length,
                branch: 'ชลบุรี'
            },
        ])

        
    }, [])

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
                            // onChange={e => setDateStart(e.target.value)}
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
                            // onChange={e => setDateEnd(e.target.value)}
                        />
                    </InputStyled>
                </FilterDateStyled>
            </div>
            <NcChartStyled>
                <div className="left-content">
                    {/* ลาดกระบัง */}
                    <div className='card'>
                        <div className="flex-center">
                            <h3>ลาดกระบัง NC ทั้งหมด {countsBrach?.latKrabang}</h3>
                            {/* <NcBarChartJsr dataDemoJsr={dataDemoJsr} /> */}
                        </div>
                    </div>

                    {/* ชลบุรี */}
                    <div className='card m-top'>
                        <div className="flex-center">
                            <h3>ชลบุรี NC ทั้งหมด {countsBrach?.chonburi}</h3>
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
                                        onClick={handleClickCdc}
                                    >
                                        {dataCdc.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                cursor="pointer"
                                                fill={index === activeIndexCdc ? "#0bce46" : '#50c272'}
                                            />
                                        ))}
                                    </Bar>
                                    {/* <Bar dataKey="NCR" fill="#0bce46" /> */}
                                    {/* <Bar dataKey="CCR" fill="#50c272" />
                                    <Bar dataKey="SCR" fill="#097028" /> */}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* แผนก */}
                <NcChartDept dept={'SC'} branch={toBranch}/>
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