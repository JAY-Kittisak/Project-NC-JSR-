import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import IqaToDeptItem from './IqaToDeptItem'
import Button from '../Button'
import Spinner from '../Spinner'
import Tab from '../Tab'
import { useQueryIqaByDept } from '../../hooks/useQueryIqaByDept'
import { Branch, NcrTab } from '../../types'
import { orderTabs } from '../../helpers'
import { SpinnerStyled } from '../../styles/LayoutStyle'
import { useSelectTab } from '../../hooks/useSelectTab'

export const prodTabType = 'iqaStatus'

interface Props {
    dept: string
    branch: Branch
}

const IqaToDept: React.FC<Props> = ({ dept, branch }) => {
    const { iqaByDept, loading, error, queryMoreIqa, btnLoading } = useQueryIqaByDept(dept, branch)
    const { activeTab } = useSelectTab<NcrTab>(prodTabType, 'All')
    const [iqaByStatus, setIqaByStatus] = useState(iqaByDept[activeTab])

    const handleQueryMore = () => queryMoreIqa()
    // When the tab changed
    useEffect(() => {
        setIqaByStatus(iqaByDept[activeTab])
    }, [activeTab, iqaByDept])

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
        <IqaToDeptStyled>
            <HistoryHeader>
                <h4>IQA ที่ถูกออกให้กับแผนก {dept}</h4>

                <IqaTabStyled>
                    {orderTabs.map((tab) => (
                        <Tab
                            key={tab}
                            label={tab}
                            tabType={prodTabType}
                            activeTab={activeTab}
                        />
                    ))}
                </IqaTabStyled>
            </HistoryHeader>

            <HistoryDetail>
                <div className="nc-content">
                    <div className="nc-column">
                        <p className='header--center'>เลขที่</p>
                    </div>
                    <div className='nc-column'>
                        <p className='header--center'>วันที่ออก IQA</p>
                    </div>
                    <div className='nc-column'>
                        <p className='header--center'>ออกให้กับ</p>
                    </div>
                    <div className='nc-column'>
                        <p className='header--center'>ผิดข้อกำหนด ISO 9001</p>
                    </div>
                    <div className='nc-column'>
                        <p className='header--center'>สถานะ</p>
                    </div>
                </div>
                {iqaByStatus.map(item => (
                    <IqaToDeptItem key={item.id} item={item} />
                ))}
            </HistoryDetail>
            <br />
            {iqaByStatus.length > 9 && (
                <div className='flex-center'>
                    <Button
                        type='button'
                        loading={btnLoading}
                        width='10%'
                        style={{ margin: '0.5rem 0' }}
                        onClick={handleQueryMore}
                    >
                        โหลดเพิ่ม
                    </Button>
                </div>
            )}
        </IqaToDeptStyled>
    )
}


const IqaToDeptStyled = styled.div`
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

const IqaTabStyled = styled.div`
    width: 40%;
    display: flex;
    justify-content: space-between;
    height: 2rem;
`

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
        width: 20%;
    }

    .header--center {
        margin: 1rem 0;
        text-align: center;
        font-size: 1.1rem;
    }
`
export default IqaToDept