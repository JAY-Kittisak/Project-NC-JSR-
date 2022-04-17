import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Tab from '../Tab'
import Spinner from '../Spinner'
import Pagination from '../Pagination'
import { useIqaAdminContext } from '../../state/iqa-admin-context'
import { useSelectTab } from '../../hooks/useSelectTab'
import { usePagination } from '../../hooks/usePagination'
import { NcrTab, IqaType } from '../../types'
import { orderTabs } from '../../helpers'
import { SpinnerStyled } from '../../styles/LayoutStyle'
import PrimaryButton from '../PrimaryButton'
import IqaToDeptItem from './IqaToDeptItem'

const prodTabType = 'iqaStatus'
const iqaPerPage = 10

interface Props { }

const IqaAdminView: React.FC<Props> = () => {
    const {
        iqaState: { iqa, iqaCounts, loading, error, queryMoreIqa, branch },
        iqaDispatch: { setBranch }
    } = useIqaAdminContext()

    const { activeTab } = useSelectTab<NcrTab>(prodTabType, 'All')

    const [iqaToPage, setIqaToPage] = useState(iqa[activeTab])
    const [iqaByStatus, setIqaByStatus] = useState(iqa[activeTab])

    const { page, totalPages } = usePagination<NcrTab, IqaType>(
        iqaCounts[activeTab],
        iqaPerPage,
        activeTab,
        iqaToPage,
        branch
    )

    useEffect(() => {
        const startIndex = iqaPerPage * (page - 1)
        const endIndex = iqaPerPage * page

        if (
            iqa[activeTab].length < iqaCounts[activeTab] &&
            iqa[activeTab].length < iqaPerPage * page
        ) {
            return queryMoreIqa()
        }
        
        setIqaToPage(iqa[activeTab])
        setIqaByStatus(iqa[activeTab].slice(startIndex, endIndex))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, iqa, page, iqaCounts])

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
        <IqaHistory>
            <HistoryHeader>
                <h4>ประวัติการออก IQA ทั้งหมด</h4>
                <IqaTabStyled>
                    {orderTabs.map((tab) => (
                        <Tab
                            key={tab}
                            label={tab}
                            tabType={prodTabType}
                            activeTab={activeTab}
                            withPagination={true}
                        />
                    ))}
                </IqaTabStyled>
            </HistoryHeader>

            <IqaPaginationStyled>
                <HistoryHeader>
                    <div onClick={() => setBranch('ลาดกระบัง')}>
                        <PrimaryButton  title={"ลาดกระบัง"}/>
                    </div>
                    <div onClick={() => setBranch('ชลบุรี')}>
                        <PrimaryButton  title={"ชลบุรี"}/>
                    </div>
                </HistoryHeader>

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    tabType={prodTabType}
                    activeTab={activeTab}
                />
            </IqaPaginationStyled>

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
        </IqaHistory>
    )
}

const IqaHistory = styled.div`
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
`

const IqaPaginationStyled = styled.div`
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
`

const HistoryHeader = styled.section`
    display: flex;
    justify-content: space-between;
    div:first-child{
        margin-right: 10px
    }
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
        font-size: 1.2rem;
    }
`

export default IqaAdminView