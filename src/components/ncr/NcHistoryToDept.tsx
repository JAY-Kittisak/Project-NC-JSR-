import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Tab from '../Tab'
import NcHistoryToDeptItem from './NcHistoryToDeptItem'
import { orderTabs } from '../../helpers'
import Spinner from '../Spinner'
import { useQueryNcByDept } from '../../hooks/useQueryNcByDept'
import { SpinnerStyled } from '../../styles/LayoutStyle'
import { Branch, NcrTab } from '../../types'
import { useSelectTab } from '../../hooks/useSelectTab'
import Button from '../Button'

export const prodTabType = 'ncStatus'

interface Props {
    dept: string
    branch: Branch
}

const NcHistoryToDept: React.FC<Props> = ({ dept, branch }) => {
    const { ncByDept, loading, error , queryMoreNc, btnLoading } = useQueryNcByDept(dept, branch)
    const { activeTab } = useSelectTab<NcrTab>(prodTabType, 'All')
    const [ncByStatus, setNcByStatus] = useState(ncByDept[activeTab])

    // When the tab changed
    useEffect(() => {
        setNcByStatus(ncByDept[activeTab])
    }, [activeTab, ncByDept])

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
        <NcHistory>
            <section className='header-status'>
                <h4>NC ที่ถูกออกให้กับแผนก {dept}</h4>

                <div className='tab-status'>
                    {orderTabs.map((tab) => (
                        <Tab
                            key={tab}
                            label={tab}
                            tabType={prodTabType}
                            activeTab={activeTab}
                        />
                    ))}
                </div>

            </section>

            <HistoryDetail>
                <div className="nc-content">
                    <div className="nc-column">
                        <p className='header--center'>เลขที่</p>
                    </div>
                    <div className='nc-column'>
                        <p className='header--center'>วันที่ออก NC</p>
                    </div>
                    <div className='nc-column-dept'>
                            <p className='header--center'>ออกโดย</p>
                    </div>
                    <div className='nc-column-dept'>
                            <p className='header--center'>ออกให้กับ</p>
                    </div>
                    <div className='nc-column'>
                        <p className='header--center'>ประเด็น</p>
                    </div>
                    <div className='nc-column'>
                        <p className='header--center'>สถานะ</p>
                    </div>
                </div>
                {ncByStatus.map(item => (
                    <NcHistoryToDeptItem key={item.id} item={item} />
                ))}
            </HistoryDetail>
            <br />
            {ncByStatus.length > 9 &&(
                <div className='flex-center'>
                    <Button
                        type='button'
                        loading={btnLoading}
                        width='10%'
                        style={{ margin: '0.5rem 0' }}
                        onClick={() => queryMoreNc()}
                    >
                        โหลดเพิ่ม
                    </Button>
                </div>
            )} 
        </NcHistory>
    )
}

const NcHistory = styled.div`
    padding: 0rem 0.5rem 0rem 0.5rem;
    background-color: var(--background-dark-color);
`

const HistoryDetail = styled.section`
    border-bottom: 0.5px solid rgb(40, 44, 52, 0.3);
    
    .nc-content {
        padding: 0rem 1rem ;
        border-top: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid rgb(40, 44, 52, 0.3);
        border-bottom: 1px solid rgb(40, 44, 52, 0.3);
    }

    .nc-column {
        width: 20%;
    }

    .nc-column-dept {
        width: 10%;
    }

    .header--center {
        margin: 1rem 0;
        text-align: center;
        font-size: 1.1rem;
    }
`

export default NcHistoryToDept