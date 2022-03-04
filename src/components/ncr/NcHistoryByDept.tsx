import React from 'react'
import styled from 'styled-components'

import Tab from '../Tab'
import NcHistoryNotifyItem from './NcHistoryNotifyItem'
import { orderTabs } from '../../helpers'
import Spinner from '../Spinner'
import { useQueryNcByDept } from '../../hooks/useQueryNcByDept'
import { SpinnerStyled } from '../../styles/LayoutStyle'
import { Branch } from '../../types'

interface Props {
    dept: string
    branch: Branch
}

const NcHistoryByDept: React.FC<Props> = ({ dept , branch}) => {
    const { ncByDept, loading, error } = useQueryNcByDept(dept, branch)

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
            <HistoryHeader>
                <h4>NC ที่ถูกออกให้กับแผนก { dept }</h4>
                
                <NcTabStyled>
                    {orderTabs.map((tab) => (
                        <Tab
                            key={tab}
                            label={tab}
                            historyTitle=''
                            tabType='dept'
                        />
                    ))}
                </NcTabStyled>

            </HistoryHeader>
            
            <HistoryDetail>
                <div className="nc-content">
                    <div className="nc-column">
                        <h3 className='header--center'>เลขที่</h3>
                    </div>
                    <div className='nc-column'>
                        <h3 className='header--center'>ออกให้กับ</h3>
                    </div>
                    <div className='nc-column'>
                        <h3 className='header--center'>ประเด็น</h3>
                    </div>
                    <div className='nc-column'>
                        <h3 className='header--center'>สถานะ</h3>
                    </div>
                </div>
                {(!ncByDept || ncByDept.length === 0) ? (<h2>No NC.</h2>) : ncByDept.map(item => (
                    <NcHistoryNotifyItem key={item.id} item={item} />
                ))}
            </HistoryDetail>
        </NcHistory>
    )
}

const NcHistory = styled.div`
    padding: 0rem 0.5rem 0rem 0.5rem;
    background-color: var(--background-dark-color);

    h4{
        color: var(--white-color);
        font-size: 1.4rem;
        margin: 16px 0;
        border-left: 5px solid #e74c3c;
        padding-left: 16px;
    }
`

const NcTabStyled = styled.div`
    width: 40%;
    display: flex;
    justify-content: space-between;
    height: 2rem;
`

// const NcPaginationStyled = styled.div`
//     margin-bottom: 1rem;
//     display: flex;
//     justify-content: flex-end;
// `

const HistoryHeader = styled.section`
    display: flex;
    justify-content: space-between;
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
        width: 25%;
    }

    .header--center {
        margin: 1rem 0;
        font-weight: 500;
        text-align: center;
    }
`

export default NcHistoryByDept