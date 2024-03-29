import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import NcHistoryToDeptItem from './NcHistoryToDeptItem'
import Tab from '../Tab'
import Spinner from '../Spinner'
import Pagination from '../Pagination'
import ButtonActive from '../ButtonActive'
import { useNcAdminContext } from '../../state/nc-admin-context'
import { SpinnerStyled } from '../../styles/LayoutStyle'
import { useSelectTab } from '../../hooks/useSelectTab'
import { usePagination } from '../../hooks/usePagination'
import { orderTabs } from '../../helpers'
import { NcrTab, NcrNotify } from '../../types'

export const prodTabType = 'ncStatus'
export const ncPerPage = 10

interface Props { }

const NcHistoryAdminView: React.FC<Props> = () => {
    const {
        ncState: { ncNotify, ncCounts, loading, error, queryMoreNc, branch },
        ncDispatch: { setBranch }
    } = useNcAdminContext()

    const { activeTab } = useSelectTab<NcrTab>(prodTabType, 'All')

    const [ncByDemo, setNcByDemo] = useState(ncNotify[activeTab])
    const [ncByStatus, setNcByStatus] = useState(ncNotify[activeTab])

    const { page, totalPages } = usePagination<NcrTab, NcrNotify>(
        ncCounts[activeTab],
        ncPerPage,
        activeTab,
        ncByDemo,
        branch
    )

    // When the tab changed
    useEffect(() => {
        const startIndex = ncPerPage * (page - 1)
        const endIndex = ncPerPage * page

        if (
            ncNotify[activeTab].length < ncCounts[activeTab] &&
            ncNotify[activeTab].length < ncPerPage * page
        ) {
            // Make a new query to the nc collection in firestore
            return queryMoreNc()
        }

        setNcByDemo(ncNotify[activeTab])
        setNcByStatus(ncNotify[activeTab].slice(startIndex, endIndex))
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, ncNotify, page, ncCounts])
    
    if (error) return <h2 className='header--center'>{error}</h2>
    
    return (
        <NcHistory>
            <section className='header-status'>
                <h4>ประวัติการออก NC ทั้งหมด</h4>
                <div className='tab-status'>
                    {orderTabs.map((tab) => (
                        <Tab
                            key={tab}
                            label={tab}
                            tabType={prodTabType}
                            activeTab={activeTab}
                            withPagination={true}
                        />
                    ))}
                </div>
            </section>

            <NcPaginationStyled>
                <div className='flex-between'>
                    <ButtonActive active={branch === 'ลาดกระบัง'} onClick={() => setBranch('ลาดกระบัง')}>ลาดกระบัง</ButtonActive>
                    <ButtonActive active={branch === 'ชลบุรี'}  onClick={() => setBranch('ชลบุรี')}>ชลบุรี</ButtonActive>
                </div>

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    tabType={prodTabType}
                    activeTab={activeTab}
                />
            </NcPaginationStyled>

            {loading ? (
                <SpinnerStyled>
                    <div className='typography' style={{ height: '600px' }}>
                        <Spinner color='#007bff' height={50} width={50} />
                        <span>Loading... </span>
                    </div>
                </SpinnerStyled>
            ) : (
                <HistoryDetail>
                    <div className="nc-content">
                        <div className="nc-column">
                            <p className='header--center'>เลขที่</p>
                        </div>
                        <div className='nc-column table-phone--hide'>
                            <p className='header--center'>วันที่ออก NC</p>
                        </div>
                        <div className='nc-column-dept'>
                                <p className='header--center'>ออกโดย</p>
                        </div>
                        <div className='nc-column-dept'>
                                <p className='header--center'>ออกให้กับ</p>
                        </div>
                        <div className='nc-column table-ipad--hide'>
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
            )}
        </NcHistory>
    )
}

const NcHistory = styled.div`
    padding: 0rem 0.5rem 0rem 0.5rem;
    background-color: var(--background-dark-color);
`

const NcPaginationStyled = styled.div`
    display: flex;
    justify-content: space-between;
`

const HistoryDetail = styled.section`
    margin-top: 1rem;
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
        font-size: 1.2rem;
    }
`

export default NcHistoryAdminView