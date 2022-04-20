import React, { useState, useEffect } from 'react'
import styled from 'styled-components';

import NcBarChartJsr from './NcBarChartJsr';
import NcBarChartCdc from './NcBarChartCdc';
import NcChartDept from './NcChartDept';
import Spinner from '../Spinner'
import { NcrNotify, Branch } from '../../types';
import { useQueryNcReport } from '../../hooks/useQueryNcReport';
import { SpinnerStyled } from '../../styles/LayoutStyle'

interface Props { }

const NcChart: React.FC<Props> = () => {
    const [dataBarJsr, setDataBarJsr] = useState<NcrNotify[] | null>(null);
    const [dataBarCdc, setDataBarCdc] = useState<NcrNotify[] | null>(null);

    const [ncJsrToDept, setNcJsrToDept] = useState<NcrNotify[]>()
    const [ncCdcToDept, setNcCdcToDept] = useState<NcrNotify[]>()

    const [branchChart, setBranchChart] = useState<Branch>('ลาดกระบัง')
    const [deptChart, setDeptChart] = useState('SC')

    // const [dateStart, setDateStart] = useState('2022-01-01');
    // const [dateEnd, setDateEnd] = useState('2022-12-31');

    const dateStart = '2022-01-01'
    const dateEnd = '2022-12-31'

    const { ncNotify, loading, error } = useQueryNcReport(dateStart,dateEnd)

    useEffect(() => {
        if (!ncNotify) return
        
        const branchLkb = ncNotify.filter(value => value.branch === 'ลาดกระบัง')
        const branchCdc = ncNotify.filter(value => value.branch === 'ชลบุรี')

        setDataBarJsr(branchLkb)
        setDataBarCdc(branchCdc)

    }, [ncNotify])

    if (loading) return (
        <SpinnerStyled>
            <div className='typography'>
                <Spinner color='#007bff' height={50} width={50} />
                <span>Loading... </span>
            </div>
        </SpinnerStyled>
    )

    if (error) return <h2 className='header--center'>{error}</h2>

    return (
        <>
            <div className="flex-between">
                <FilterDateStyled>
                    <InputStyled>
                        <label htmlFor="containmentDueDate">จากวันที่</label>
                        <input
                            disabled
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
                            disabled
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
                    <NcBarChartJsr
                        dataBarJsr={dataBarJsr}
                        setNcJsrToDept={setNcJsrToDept}
                        setBranchChart={setBranchChart}
                        setDeptChart={setDeptChart}
                    />

                    {/* ชลบุรี */}
                    <NcBarChartCdc
                        dataBarCdc={dataBarCdc}
                        setNcCdcToDept={setNcCdcToDept}
                        setBranchChart={setBranchChart}
                        setDeptChart={setDeptChart}
                    />
                </div>

                {/* แผนก */}
                {branchChart === 'ลาดกระบัง' ? (
                    <NcChartDept ncJsrToDept={ncJsrToDept} deptChart={deptChart} branchChart={branchChart}/>
                ): (
                    <NcChartDept ncJsrToDept={ncCdcToDept} deptChart={deptChart} branchChart={branchChart}/>
                )}
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

    .left-content {
        display: flex;
        flex-direction: column;
        width: 70%;
    }

    @media screen and (max-width: 1000px){
        flex-direction: column;
        .left-content {
            width: 100%;
        }
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
        border-radius: 10px 10px 0 0;
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