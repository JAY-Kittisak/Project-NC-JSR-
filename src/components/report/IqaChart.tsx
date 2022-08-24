import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Spinner from '../Spinner'
import IqaBarChart from './IqaBarChart'
import { useQueryIqaReport } from '../../hooks/useQueryIqaReport'
import { IqaType } from '../../types'
import { SpinnerStyled } from '../../styles/LayoutStyle'
import TabIqa from './TabIqa'

interface Props { }

const initialYears = ["2022","2023","2024","2025","2026"]

const IqaChart: React.FC<Props> = () => {
    const [dataJsr, setDataJsr] = useState<IqaType[] | null>(null)
    const [dataCdc, setDataCdc] = useState<IqaType[] | null>(null)
    
    const [year, setYear] = useState("2022")
    const [selectRound, setSelectRound] = useState("1")

    const { iqa, loading, error } = useQueryIqaReport(year)

    useEffect(() => {
        if (!iqa) return

        const filterRound = iqa.filter(value => value.round === selectRound)
        
        const branchLkb = filterRound.filter(value => value.branch === 'ลาดกระบัง')
        const branchCdc = filterRound.filter(value => value.branch === 'ชลบุรี')

        setDataJsr(branchLkb)
        setDataCdc(branchCdc)
    }, [iqa, selectRound])

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
        <IqaCartStyled>
            <section className='filter-iql'>
                <div className='form-field'>
                    <label htmlFor='year'>Year</label>
                    <select id='year' onChange={(e) => setYear(e.target.value)}>
                        {initialYears.map((item,i) => {
                            return (
                                <option key={i} value={item}>{item}</option>
                            )
                        })}
                    </select>
                </div>
                <div className='form-field'>
                    <label htmlFor='round'>Round</label>
                    <select id='round' onChange={(e) => setSelectRound(e.target.value)}>
                        <option value="1">Round 1</option>
                        <option value="2">Round 2</option>
                    </select>
                </div>
            </section>

            <section>
                <IqaBarChart 
                    title='ลาดกระบัง'
                    colorOne='#0081a1'
                    colorTwo='#00ccff'
                    colorThree='#005cbe'
                    colorFour='#007bff'
                    dataChart={dataJsr}
                />
                <IqaBarChart 
                    title='ชลบุรี'
                    colorOne='#00b185'
                    colorTwo='#00C897'
                    colorThree='#098b30'
                    colorFour='#0bce46'
                    dataChart={dataCdc}
                />
            </section>
            
            <TabIqa dataJsr={dataJsr} dataCdc={dataCdc}/>
        </IqaCartStyled>
    )
}

const IqaCartStyled = styled.div`
    background-color: var(--background-dark-color);
        
    .filter-iql {
        display: flex;
        width: 500px;

        div:not(:first-child) {
            margin-left: 1rem;
        }

        .form-field {
            margin-top: 1rem;
            position: relative;
            width: 100%;
            label{
                position: absolute;
                left: 20px;
                top: -17px;
                display: inline-block;
                background-color: var(--background-dark-color);
                padding: 0 .5rem;
                font-size: 1.2rem;
                color: inherit;
            }
            select{
                cursor: pointer;
                border: 1px solid var(--border-color);
                outline: none;
                height: 40px;
                padding: 0 15px 0px 15px;
                width: 100%;
                color: inherit;
                box-shadow: none;
                background-color: var(--background-dark-color);
            }
        }
    }
`
export default IqaChart